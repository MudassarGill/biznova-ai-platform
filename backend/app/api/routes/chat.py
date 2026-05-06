"""
BizNova AI — Chat API Routes (Streaming + LTM + CRAG)
=======================================================

This module defines all HTTP endpoints for the chat system. It is the most
feature-rich route module in the BizNova backend, handling:

1. **Streaming Chat (SSE)** — Real-time typewriter-effect responses using
   Server-Sent Events. The LLM's response is streamed token-by-token to
   the frontend, dramatically improving perceived responsiveness.

2. **Long-Term Memory (LTM)** — Chat sessions and messages are persisted
   in the SQLite database. Users can:
   - Create new chat sessions
   - List all their past sessions
   - Load messages from any session
   - Delete sessions they no longer need

3. **CRAG Document Q&A** — Users can upload business documents (PDF, TXT)
   and ask questions about them. The Corrective RAG pipeline retrieves
   relevant sections, grades them for relevance, and generates grounded
   answers.

4. **Fallback Chat** — A non-streaming endpoint for simpler use cases
   (e.g., the ChatBubble popup widget).

Endpoint Summary
-----------------
::

    POST  /api/chat                         → Non-streaming chat (fallback)
    POST  /api/chat/stream                  → Streaming chat (SSE)
    GET   /api/chat/sessions                → List user's chat sessions
    POST  /api/chat/sessions                → Create new chat session
    GET   /api/chat/sessions/{id}/messages  → Load session messages (LTM)
    DELETE /api/chat/sessions/{id}          → Delete a chat session
    POST  /api/chat/documents/upload        → Upload document for CRAG
    GET   /api/chat/documents               → List user's documents
    DELETE /api/chat/documents/{id}         → Delete a document

Server-Sent Events (SSE) Protocol
-----------------------------------
The streaming endpoint uses SSE to push text chunks to the frontend.
Each chunk is sent as a ``data:`` event::

    data: Hello

    data: , how

    data:  can

    data:  I help?

    data: [DONE]

The frontend reads these events via ``fetch()`` with ``ReadableStream``
and appends each chunk to the displayed message in real-time.

Authentication
--------------
Session and document endpoints require JWT authentication via the
``get_current_user`` dependency. The non-streaming chat endpoint
remains unauthenticated for backward compatibility.
"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.chat import ChatSession, ChatMessage
from app.db.models.document import Document, DocumentChunk
from app.db.models.user import User
from app.api.dependencies.auth import get_current_user
from app.schemas.idea import ChatRequest
from app.schemas.chat import (
    ChatSessionCreate,
    ChatSessionResponse,
    ChatMessageResponse,
    ChatStreamRequest,
    DocumentResponse,
)
from app.services.business_service import BusinessService
from app.ai.rag_pipeline import crag_pipeline
import logging
import json

logger = logging.getLogger(__name__)
router = APIRouter()
business_service = BusinessService()


# ─────────────────────────────────────────────────────────────────────────────
# NON-STREAMING CHAT (Fallback / Legacy)
# ─────────────────────────────────────────────────────────────────────────────

@router.post("")
async def chat(request: ChatRequest):
    """
    Non-streaming chat endpoint (legacy fallback).

    Sends the user's message to the AI and returns the complete response
    as a JSON object. Used by the ChatBubble popup or when SSE is not
    supported.

    This endpoint does NOT persist messages to the database — it uses
    the ``history`` field from the request body for context (short-term
    memory only).

    Request Body:
        - ``message`` (str): The user's question
        - ``history`` (list): Recent conversation messages
        - ``context`` (str, optional): Business context

    Returns:
        dict: ``{"response": "AI response text here"}``
    """
    try:
        history = [msg.model_dump() for msg in request.history] if request.history else []

        response = await business_service.chat_response(
            message=request.message,
            history=history,
            context=request.context,
        )
        return {"response": response}
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Chat AI failed: {str(e)}"
        )


# ─────────────────────────────────────────────────────────────────────────────
# STREAMING CHAT (SSE) — Main Chat Endpoint
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/stream")
async def chat_stream(
    request: ChatStreamRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Streaming chat endpoint using Server-Sent Events (SSE).

    This is the primary chat endpoint that provides:
    1. **Streaming responses** — Text chunks sent in real-time via SSE
    2. **Long-Term Memory** — Messages saved to DB, history loaded from DB
    3. **CRAG support** — Document-based Q&A when ``use_rag=True``

    How it works:
    1. Validate the chat session belongs to the current user
    2. Save the user's message to the database
    3. Load the last 20 messages from the session (LTM context)
    4. Route to either CRAG pipeline or standard chat
    5. Stream the response chunks via SSE
    6. After streaming completes, save the full assistant response to DB
    7. Auto-update session title from first user message

    Request Body (ChatStreamRequest):
        - ``session_id`` (int): Active chat session ID
        - ``message`` (str): User's message text
        - ``context`` (str, optional): Business context
        - ``use_rag`` (bool): Whether to use CRAG document search

    Returns:
        StreamingResponse: SSE stream with Content-Type ``text/event-stream``.
        Each event is ``data: <text_chunk>\\n\\n``.
        Stream ends with ``data: [DONE]\\n\\n``.

    Raises:
        HTTPException 404: If session doesn't exist or doesn't belong to user
    """
    # ─── Validate session ownership ───
    session = (
        db.query(ChatSession)
        .filter(ChatSession.id == request.session_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")

    # ─── Save user message to DB ───
    user_msg = ChatMessage(
        session_id=session.id,
        role="user",
        content=request.message,
    )
    db.add(user_msg)
    db.commit()

    # ─── Auto-update session title from first message ───
    msg_count = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).count()
    if msg_count <= 1 and session.title == "New Chat":
        # Use first 50 chars of the first message as title
        session.title = request.message[:50] + ("..." if len(request.message) > 50 else "")
        db.commit()

    # ─── Load LTM: last 20 messages from this session ───
    history_messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session.id)
        .order_by(ChatMessage.created_at.desc())
        .limit(20)
        .all()
    )
    # Reverse to chronological order (oldest first)
    history_messages.reverse()

    history = [
        {"role": msg.role, "content": msg.content}
        for msg in history_messages[:-1]  # Exclude the message we just saved
    ]

    # ─── Build SSE stream generator ───
    async def event_stream():
        """
        Async generator that produces SSE events.

        Collects all chunks into ``full_response`` for DB persistence,
        while simultaneously streaming each chunk to the client.
        """
        full_response = ""
        try:
            if request.use_rag:
                # CRAG mode: search user's documents
                gen = business_service.chat_crag_stream(
                    message=request.message,
                    user_id=current_user.id,
                )
            else:
                # Standard chat mode with LTM
                gen = business_service.chat_response_stream(
                    message=request.message,
                    history=history,
                    context=request.context,
                )

            async for chunk in gen:
                full_response += chunk
                # SSE format: "data: <content>\n\n"
                yield f"data: {json.dumps({'content': chunk})}\n\n"

        except Exception as e:
            logger.error(f"Streaming error: {e}")
            error_msg = f"\n\n⚠️ Error: {str(e)}"
            full_response += error_msg
            yield f"data: {json.dumps({'content': error_msg})}\n\n"

        # ─── Save complete assistant response to DB ───
        if full_response.strip():
            assistant_msg = ChatMessage(
                session_id=session.id,
                role="assistant",
                content=full_response.strip(),
            )
            db.add(assistant_msg)
            db.commit()

        # Signal end of stream
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        },
    )


# ─────────────────────────────────────────────────────────────────────────────
# CHAT SESSION CRUD (Long-Term Memory Management)
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/sessions", response_model=list[ChatSessionResponse])
async def list_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all chat sessions for the authenticated user.

    Returns sessions sorted by most recently updated (newest first).
    Each session includes a message count for the frontend to display.

    The frontend uses this to render the session sidebar, allowing
    users to switch between conversations (Long-Term Memory access).

    Returns:
        list[ChatSessionResponse]: All user's chat sessions with
            id, title, timestamps, and message count.
    """
    sessions = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.updated_at.desc())
        .all()
    )

    result = []
    for s in sessions:
        msg_count = db.query(ChatMessage).filter(ChatMessage.session_id == s.id).count()
        result.append(
            ChatSessionResponse(
                id=s.id,
                title=s.title,
                created_at=s.created_at,
                updated_at=s.updated_at,
                message_count=msg_count,
            )
        )
    return result


@router.post("/sessions", response_model=ChatSessionResponse)
async def create_session(
    request: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new chat session for the authenticated user.

    Called when the user clicks "New Chat" in the frontend. Creates an
    empty session that will be populated as the user sends messages.

    The title defaults to "New Chat" and auto-updates to the first
    message content when the user sends their first message.

    Request Body:
        - ``title`` (str, optional): Custom session title. Default "New Chat".

    Returns:
        ChatSessionResponse: The newly created session.
    """
    session = ChatSession(
        user_id=current_user.id,
        title=request.title,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return ChatSessionResponse(
        id=session.id,
        title=session.title,
        created_at=session.created_at,
        updated_at=session.updated_at,
        message_count=0,
    )


@router.get("/sessions/{session_id}/messages", response_model=list[ChatMessageResponse])
async def get_session_messages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Load all messages for a specific chat session (LTM retrieval).

    This is the core of the LTM system's frontend integration. When a
    user clicks on a past session in the sidebar, the frontend calls
    this endpoint to load the full conversation history.

    Security: Validates that the session belongs to the current user
    before returning messages. Prevents users from reading each other's
    conversations.

    Args:
        session_id (int): The ID of the session to load.

    Returns:
        list[ChatMessageResponse]: All messages in chronological order,
            each with id, role, content, and timestamp.

    Raises:
        HTTPException 404: If session not found or belongs to another user.
    """
    session = (
        db.query(ChatSession)
        .filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
    return messages


@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a chat session and all its messages.

    Uses SQLAlchemy's cascade delete to automatically remove all
    ``ChatMessage`` records associated with the session. This is
    a permanent action — deleted conversations cannot be recovered.

    Args:
        session_id (int): The ID of the session to delete.

    Returns:
        dict: ``{"message": "Session deleted"}``

    Raises:
        HTTPException 404: If session not found or belongs to another user.
    """
    session = (
        db.query(ChatSession)
        .filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    db.delete(session)
    db.commit()
    return {"message": "Session deleted"}


# ─────────────────────────────────────────────────────────────────────────────
# DOCUMENT MANAGEMENT (CRAG)
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/documents/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload a business document for CRAG-powered Q&A.

    Accepts PDF or TXT files and processes them through the CRAG pipeline:
    1. Extract text from the uploaded file
    2. Split text into overlapping chunks
    3. Embed chunks and store in ChromaDB (vector store)
    4. Save metadata to SQLite for tracking

    After upload, the user can ask questions about the document's content
    using the chat interface with ``use_rag=True``.

    Supported file types:
    - PDF (``application/pdf``)
    - TXT (``text/plain``)

    Args:
        file (UploadFile): The uploaded file.

    Returns:
        DocumentResponse: Metadata about the uploaded and processed document.

    Raises:
        HTTPException 400: If file type is unsupported or text extraction fails.
    """
    # Determine file type
    filename = file.filename or "unknown.txt"
    extension = filename.rsplit(".", 1)[-1].lower() if "." in filename else "txt"

    if extension not in ("pdf", "txt", "text", "md"):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: .{extension}. Please upload PDF or TXT files."
        )

    # Read file bytes
    file_bytes = await file.read()
    file_size = len(file_bytes)

    # Extract text
    try:
        text = crag_pipeline.extract_text(file_bytes, extension)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not text.strip():
        raise HTTPException(status_code=400, detail="Document appears to be empty or unreadable.")

    # Split into chunks
    chunks = crag_pipeline.split_text(text)

    # Save document to SQLite
    doc = Document(
        user_id=current_user.id,
        filename=filename,
        file_type=extension,
        file_size=file_size,
        total_chunks=len(chunks),
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Embed and store in ChromaDB
    chroma_ids = crag_pipeline.embed_and_store(chunks, doc.id, current_user.id)

    # Save chunks to SQLite (for reference/debugging)
    for i, (chunk_text, chroma_id) in enumerate(zip(chunks, chroma_ids)):
        db_chunk = DocumentChunk(
            document_id=doc.id,
            chunk_index=i,
            content=chunk_text,
            chroma_id=chroma_id,
        )
        db.add(db_chunk)

    db.commit()

    logger.info(
        f"Document uploaded: {filename} ({len(chunks)} chunks) "
        f"by user {current_user.id}"
    )

    return doc


@router.get("/documents", response_model=list[DocumentResponse])
async def list_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all documents uploaded by the authenticated user.

    Returns documents sorted by most recently uploaded. The frontend
    uses this to display a document list with file names, sizes, and
    chunk counts.

    Returns:
        list[DocumentResponse]: All user's documents with metadata.
    """
    documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
        .all()
    )
    return documents


@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a document and its chunks from both SQLite and ChromaDB.

    Removes:
    1. All chunk embeddings from ChromaDB (vector store)
    2. All DocumentChunk records from SQLite
    3. The Document record from SQLite

    This is permanent — the document will need to be re-uploaded if
    the user wants to use it again.

    Args:
        document_id (int): The ID of the document to delete.

    Returns:
        dict: ``{"message": "Document deleted"}``

    Raises:
        HTTPException 404: If document not found or belongs to another user.
    """
    doc = (
        db.query(Document)
        .filter(Document.id == document_id, Document.user_id == current_user.id)
        .first()
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Remove from ChromaDB
    crag_pipeline.delete_document_chunks(doc.id, current_user.id)

    # Remove from SQLite (cascade deletes chunks)
    db.delete(doc)
    db.commit()

    logger.info(f"Document deleted: {doc.filename} (user {current_user.id})")
    return {"message": "Document deleted"}
