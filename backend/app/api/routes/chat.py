"""API route for the AI chat assistant."""

from fastapi import APIRouter, HTTPException
from app.schemas.idea import ChatRequest
from app.services.business_service import BusinessService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
business_service = BusinessService()


@router.post("")
async def chat(request: ChatRequest):
    """
    Send a message to the BizNova AI assistant.
    
    Supports conversation history for context-aware responses.
    Returns the AI's response text.
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
