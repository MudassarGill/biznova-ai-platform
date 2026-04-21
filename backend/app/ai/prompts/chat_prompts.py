"""Prompt template for the BizNova AI chat assistant."""


def build_chat_prompt(message: str, history: list = None, context: str = None) -> str:
    """
    Build a prompt for the AI chat assistant.
    
    Args:
        message: The user's current message
        history: List of previous messages [{"role": "user/assistant", "content": "..."}]
        context: Optional business context (current idea, analysis data, etc.)
    """
    history_text = ""
    if history:
        # Include last 10 messages for context
        recent = history[-10:]
        for msg in recent:
            role = "User" if msg.get("role") == "user" else "BizNova AI"
            history_text += f"{role}: {msg.get('content', '')}\n"

    context_text = ""
    if context:
        context_text = f"""
## Current Business Context:
{context}
"""

    return f"""You are BizNova AI — an expert business strategist, market analyst, and startup advisor integrated into the BizNova AI Business Intelligence Platform.

Your role is to help entrepreneurs:
- Discover and evaluate business ideas
- Analyze market trends and competition
- Create actionable business plans
- Provide data-driven strategic advice
- Answer questions about startups, funding, and growth

Guidelines:
1. Be professional yet approachable
2. Provide specific, actionable advice — avoid generic responses
3. When discussing markets, reference real-world trends and data
4. If discussing Pakistan or South Asian markets, show deep local knowledge
5. Keep responses concise but comprehensive (2-4 paragraphs max)
6. Use bullet points for lists
7. If you don't know something, say so honestly
{context_text}
## Conversation History:
{history_text}
User: {message}

BizNova AI:"""
