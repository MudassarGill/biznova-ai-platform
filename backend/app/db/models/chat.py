"""
BizNova AI — Chat Memory Database Models
==========================================

This module defines the SQLAlchemy ORM models that power the chatbot's
Long-Term Memory (LTM) system. These models persist all conversations
to a SQLite database so that:

1. **Chat history survives page refreshes** — users never lose context.
2. **Multiple conversation sessions** — users can organize separate chats.
3. **Conversation recall** — the LLM can reference earlier messages in the
   same session, giving it multi-turn conversational memory.
4. **Per-user isolation** — every session belongs to a specific user via
   ``user_id`` foreign key, so users only see their own data.

Models
------
- ``ChatSession``: Represents a single conversation thread (like a ChatGPT
  thread). Stores metadata such as title, creation time, and the owning user.
- ``ChatMessage``: Represents one message inside a session. Tracks the role
  (``user`` or ``assistant``), the text content, and a timestamp.

Relationships
-------------
- A User has many ChatSessions (one-to-many).
- A ChatSession has many ChatMessages (one-to-many, cascade delete).

Usage
-----
These models are automatically created by ``Base.metadata.create_all()``
in ``main.py`` at application startup. The chat routes use SQLAlchemy
queries against these tables to load/save conversation history.

Example::

    session = ChatSession(user_id=1, title="FinTech Ideas Discussion")
    db.add(session)
    db.commit()

    msg = ChatMessage(session_id=session.id, role="user", content="Hello!")
    db.add(msg)
    db.commit()
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base


class ChatSession(Base):
    """
    Represents a single conversation thread between a user and BizNova AI.

    Each session acts as an independent conversation context. When the LLM
    generates a response, it receives the recent messages from the active
    session as conversational memory (LTM).

    Attributes:
        id (int): Primary key, auto-incremented.
        user_id (int): Foreign key linking to the ``users`` table. Ensures
            each conversation belongs to exactly one authenticated user.
        title (str): Human-readable title for the session, auto-generated
            from the user's first message or set explicitly.
        created_at (datetime): When the session was first created.
        updated_at (datetime): Last time a message was added to this session.
            Used to sort sessions by "most recently active".
        messages (list[ChatMessage]): SQLAlchemy relationship providing
            access to all messages in this session, ordered by creation time.
    """

    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), default="New Chat")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship: session -> messages (cascade delete = deleting a session
    # also deletes all its messages)
    messages = relationship(
        "ChatMessage",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="ChatMessage.created_at",
    )


class ChatMessage(Base):
    """
    Represents a single message within a chat session.

    Messages alternate between ``role='user'`` (the human) and
    ``role='assistant'`` (BizNova AI). They are stored in chronological
    order and loaded as conversational context for the LLM.

    The LTM system works by querying the last N messages from the active
    session and injecting them into the LLM prompt, giving the model
    awareness of what was discussed earlier.

    Attributes:
        id (int): Primary key, auto-incremented.
        session_id (int): Foreign key linking to ``chat_sessions``.
        role (str): Either ``'user'`` or ``'assistant'`` — indicates who
            authored this message.
        content (str): The full text content of the message. For assistant
            messages, this is the complete streamed response.
        created_at (datetime): When the message was created/sent.
        session (ChatSession): Back-reference to the parent session.
    """

    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(
        Integer, ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False, index=True
    )
    role = Column(String(20), nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship: message -> session (back-reference)
    session = relationship("ChatSession", back_populates="messages")
