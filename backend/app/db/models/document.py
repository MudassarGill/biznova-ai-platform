"""
BizNova AI — Document Storage Models for CRAG (Corrective RAG)
================================================================

This module defines the database models that support the document-based
Corrective Retrieval-Augmented Generation (CRAG) system. Users can upload
business documents (PDFs, text files) and ask questions about them. The
CRAG pipeline retrieves relevant chunks, grades their relevance, and either
uses them directly or corrects the retrieval before generating an answer.

How CRAG Differs from Standard RAG
------------------------------------
Standard RAG blindly passes retrieved chunks to the LLM. CRAG adds a
**grading step** that evaluates whether each retrieved chunk is actually
relevant to the user's question:

1. **Correct** — Chunk is relevant → use it for generation.
2. **Incorrect** — Chunk is irrelevant → discard it and use the LLM's
   general knowledge instead.
3. **Ambiguous** — Chunk is partially relevant → rewrite the query and
   re-retrieve, then grade again.

This produces significantly better answers than naive RAG, especially
when documents contain mixed content.

Models
------
- ``Document``: Represents an uploaded file (PDF, TXT, DOCX). Stores
  metadata like filename, file type, and the owning user.
- ``DocumentChunk``: Represents a text chunk extracted from a document.
  Each chunk is embedded into a vector store (ChromaDB) for semantic
  search. The chunk text and its embedding ID are stored here.

Relationships
-------------
- A User has many Documents (one-to-many).
- A Document has many DocumentChunks (one-to-many, cascade delete).

Usage
-----
1. User uploads a document via ``POST /api/chat/documents/upload``
2. Backend extracts text, splits into chunks, generates embeddings
3. Chunks are stored in both SQLite (text) and ChromaDB (vectors)
4. When user asks a question, CRAG retrieves + grades + generates
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base


class Document(Base):
    """
    Represents an uploaded business document for CRAG-powered Q&A.

    Users upload documents (business plans, market reports, pitch decks)
    and can then ask natural-language questions about the content. The
    CRAG pipeline uses vector similarity search to find relevant sections
    and generates accurate, grounded answers.

    Attributes:
        id (int): Primary key, auto-incremented.
        user_id (int): Foreign key to ``users`` table. Documents are
            private to the uploading user.
        filename (str): Original filename as uploaded by the user.
        file_type (str): MIME type or extension (e.g., 'pdf', 'txt').
        file_size (int): Size in bytes of the original uploaded file.
        total_chunks (int): How many text chunks were extracted from
            this document after splitting.
        created_at (datetime): Upload timestamp.
        chunks (list[DocumentChunk]): All text chunks extracted from
            this document, accessible via SQLAlchemy relationship.
    """

    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    filename = Column(String(500), nullable=False)
    file_type = Column(String(20), nullable=False)  # 'pdf', 'txt', 'docx'
    file_size = Column(Integer, default=0)
    total_chunks = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    chunks = relationship(
        "DocumentChunk",
        back_populates="document",
        cascade="all, delete-orphan",
    )


class DocumentChunk(Base):
    """
    Represents a single text chunk extracted from a Document.

    During document processing, the full text is split into overlapping
    chunks (typically 500-1000 characters with 100-character overlap).
    Each chunk is:
    1. Stored as text in this table (for display and debugging)
    2. Embedded into a vector in ChromaDB (for semantic search)

    The ``chroma_id`` field links this chunk to its vector representation
    in ChromaDB, enabling efficient similarity search during CRAG retrieval.

    Attributes:
        id (int): Primary key, auto-incremented.
        document_id (int): Foreign key to ``documents`` table.
        chunk_index (int): Position of this chunk within the document
            (0-based). Used to maintain reading order.
        content (str): The actual text content of the chunk.
        chroma_id (str): The unique ID used to store/retrieve this
            chunk's embedding in ChromaDB.
        document (Document): Back-reference to the parent document.
    """

    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    document_id = Column(
        Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True
    )
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    chroma_id = Column(String(100), unique=True, nullable=False)

    document = relationship("Document", back_populates="chunks")
