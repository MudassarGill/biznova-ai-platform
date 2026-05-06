"""
BizNova AI — Chat & Document Pydantic Schemas
================================================

This module defines all the request/response schemas for the chat system,
including:

1. **Chat Session Management** — Create, list, and delete conversation
   sessions for the LTM (Long-Term Memory) system.
2. **Chat Messaging** — Send messages (with streaming support) and
   retrieve message history.
3. **Document Upload** — Upload business documents for the CRAG
   (Corrective RAG) pipeline.

These schemas ensure type safety and automatic validation for all API
endpoints. FastAPI uses them to:
- Validate incoming request bodies
- Serialize outgoing response bodies
- Generate OpenAPI documentation (Swagger UI)

Schema Naming Convention
------------------------
- ``*Request``: Incoming data from the frontend.
- ``*Response``: Outgoing data to the frontend.
- ``*Create``: Data needed to create a new resource.

All schemas extend Pydantic's ``BaseModel`` with ``Field()`` descriptors
that provide validation rules and OpenAPI documentation.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# ─── Chat Session Schemas ────────────────────────────────────────────────────

class ChatSessionCreate(BaseModel):
    """
    Request schema for creating a new chat session.

    When a user clicks "New Chat", the frontend sends this to create a
    fresh conversation thread. The title is optional and defaults to
    "New Chat" — it gets auto-updated after the first message.

    Attributes:
        title (str): Display name for the session. Auto-generated from
            the user's first message if not provided.
    """
    title: str = Field(default="New Chat", description="Session display title")


class ChatSessionResponse(BaseModel):
    """
    Response schema for a chat session.

    Returned when listing sessions or creating a new one. Provides the
    frontend with enough info to display the session in the sidebar and
    track the active session.

    Attributes:
        id (int): Unique session identifier.
        title (str): Display title (e.g., "FinTech Ideas Discussion").
        created_at (datetime): When the session was first created.
        updated_at (datetime): Last time a message was added.
        message_count (int): Total number of messages in the session.
    """
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0

    class Config:
        from_attributes = True


# ─── Chat Message Schemas ────────────────────────────────────────────────────

class ChatMessageResponse(BaseModel):
    """
    Response schema for a single chat message.

    Used when loading a session's message history. The frontend renders
    each message as a chat bubble with role-based styling (user = right
    aligned blue, assistant = left aligned dark).

    Attributes:
        id (int): Unique message identifier.
        role (str): Either ``'user'`` or ``'assistant'``.
        content (str): The full text content of the message.
        created_at (datetime): When the message was sent/generated.
    """
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatStreamRequest(BaseModel):
    """
    Request schema for the streaming chat endpoint (SSE).

    This is the primary schema for sending messages to the AI assistant.
    It includes the session ID for LTM context, the user's message, and
    optional business context for more relevant responses.

    The ``use_rag`` flag tells the backend whether to use the CRAG pipeline
    (document-based Q&A) or regular chat (general knowledge).

    Attributes:
        session_id (int): ID of the active chat session. Messages are
            saved to this session for LTM persistence.
        message (str): The user's question or message text.
        context (str | None): Optional business context string, e.g.,
            "Currently exploring: AI Finance App (FinTech)". Injected
            into the prompt for more relevant responses.
        use_rag (bool): If True, routes the query through the CRAG
            pipeline to search uploaded documents. If False, uses
            standard chat with LLM general knowledge.
    """
    session_id: int = Field(..., description="Chat session ID for LTM")
    message: str = Field(..., min_length=1, description="User's message")
    context: Optional[str] = Field(default=None, description="Business context")
    use_rag: bool = Field(default=False, description="Use CRAG document search")


# ─── Document Schemas ────────────────────────────────────────────────────────

class DocumentResponse(BaseModel):
    """
    Response schema for an uploaded document.

    Returned when listing a user's documents or after a successful upload.
    Provides metadata for the frontend to display document cards.

    Attributes:
        id (int): Unique document identifier.
        filename (str): Original filename as uploaded.
        file_type (str): File extension (e.g., ``'pdf'``, ``'txt'``).
        file_size (int): File size in bytes.
        total_chunks (int): Number of text chunks extracted.
        created_at (datetime): Upload timestamp.
    """
    id: int
    filename: str
    file_type: str
    file_size: int
    total_chunks: int
    created_at: datetime

    class Config:
        from_attributes = True
