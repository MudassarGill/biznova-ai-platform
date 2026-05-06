"""
BizNova AI — Chat Prompt Templates (LTM-Aware)
=================================================

This module builds the system prompt for the BizNova AI chat assistant.
The prompt is carefully engineered to make the LLM behave as an expert
business advisor while maintaining natural conversational flow.

Long-Term Memory (LTM) Integration
------------------------------------
The key innovation here is how we inject conversation history into the
prompt. Instead of just sending the user's latest message, we include
the last N messages from the database (the "memory window"). This gives
the LLM awareness of what was discussed earlier in the conversation,
enabling multi-turn dialogue like:

    User: "I want to start a coffee shop in Lahore"
    AI:   "Great! Here's what to consider for a coffee shop in Lahore..."
    User: "What about the competition?"
    AI:   "In Lahore's coffee market, your main competitors would be..."
               ↑ The LLM knows "the competition" refers to coffee shops
                 in Lahore because it has the conversation history.

Without LTM, the second message ("What about the competition?") would
be meaningless — the LLM wouldn't know what competition the user means.

Prompt Structure
-----------------
The final prompt has this structure:

1. **System Identity** — Who the LLM is (BizNova AI business strategist)
2. **Role Definition** — What it should help with (ideas, analysis, etc.)
3. **Guidelines** — How to behave (professional, specific, concise)
4. **Business Context** (optional) — Current idea being explored
5. **Conversation History** (LTM) — Recent messages from the session
6. **Current Message** — The user's latest question

Dependencies
------------
This module has no external dependencies — it's pure string formatting.
The generated prompt string is passed to ``generate_text_stream()`` in
``llm_client.py`` for streaming generation.
"""


def build_chat_prompt(
    message: str,
    history: list = None,
    context: str = None,
) -> str:
    """
    Build the complete LLM prompt for the chat assistant with LTM context.

    This function assembles all components into a single prompt string
    that will be sent to Gemini for response generation. The prompt
    includes conversation history (Long-Term Memory), optional business
    context, and the user's current message.

    Args:
        message (str): The user's current message / question.
        history (list, optional): List of previous messages from the
            database (LTM). Each item is a dict with keys:
            - ``role`` (str): ``'user'`` or ``'assistant'``
            - ``content`` (str): The message text
            The last 20 messages are typically included to stay within
            token limits while providing rich context.
        context (str, optional): Business context string injected when
            the user is currently exploring a specific idea. Example:
            ``"Currently exploring: AI Finance App (FinTech)"``

    Returns:
        str: Complete prompt string ready for Gemini. Typically 500-3000
            characters depending on history length.

    Example::

        prompt = build_chat_prompt(
            message="What about the competition?",
            history=[
                {"role": "user", "content": "I want to start a coffee shop"},
                {"role": "assistant", "content": "Great idea! Here's..."},
            ],
            context="Currently exploring: Coffee Shop (FoodTech)",
        )
        # Result includes system prompt + history + current message
    """
    # ─── Format conversation history (LTM) ───
    history_text = ""
    if history:
        # Include up to 20 messages for context window management.
        # More messages = better context but more tokens consumed.
        # 20 is a good balance for Gemini's 1M token context window.
        recent = history[-20:]
        for msg in recent:
            role = "User" if msg.get("role") == "user" else "BizNova AI"
            history_text += f"{role}: {msg.get('content', '')}\n"

    # ─── Format business context (if user is exploring an idea) ───
    context_text = ""
    if context:
        context_text = f"""
## Current Business Context:
{context}
Use this context to make your responses more relevant and specific.
"""

    # ─── Build the complete prompt ───
    return f"""You are BizNova AI — an expert business strategist, market analyst, and startup advisor integrated into the BizNova AI Business Intelligence Platform.

Your role is to help entrepreneurs:
- Discover and evaluate business ideas
- Analyze market trends and competition
- Create actionable business plans
- Provide data-driven strategic advice
- Answer questions about startups, funding, and growth
- Help users understand their uploaded business documents

## Long-Term Memory Notice:
You have access to the conversation history below. Use it to maintain context
and refer to previously discussed topics naturally. If the user references
something discussed earlier, use the history to provide consistent, contextual
responses. Do NOT say "I don't have memory" — you DO have conversation history.

## Platform Knowledge (Always Available):
- **Project Name**: BizNova AI — Business Intelligence Platform
- **Creator / Developer**: **Mudassar Gill** (GitHub: MudssarGill)
- **Tech Stack**: FastAPI (Python) backend, React 18 + Vite + Tailwind CSS frontend
- **AI Engine**: Google Gemini 1.5 Flash for all AI features
- **Features**: AI Idea Generation, Market Analysis, Forecasting, Business Plan, Streaming Chat with LTM, CRAG Document Q&A
- **Architecture**: Full-stack with JWT auth, SQLite database, ChromaDB vector store, SSE streaming
- If anyone asks "who created this project", "who is the developer", or "who made BizNova", answer:
  "BizNova AI was created by **Mudassar Gill** (GitHub: MudssarGill). He is a Full-Stack AI/ML Developer specializing in Generative AI, LangGraph, RAG systems, and MLOps."

Guidelines:
1. Be professional yet approachable
2. Provide specific, actionable advice — avoid generic responses
3. When discussing markets, reference real-world trends and data
4. If discussing Pakistan or South Asian markets, show deep local knowledge
5. Keep responses concise but comprehensive (2-4 paragraphs max)
6. Use bullet points for lists and **bold** for key terms
7. If you don't know something, say so honestly
8. Use markdown formatting for better readability
9. When the user refers to "my document" or "the uploaded file", acknowledge that you can search their documents using the CRAG system
{context_text}
## Conversation History (Long-Term Memory):
{history_text}
User: {message}

BizNova AI:"""
