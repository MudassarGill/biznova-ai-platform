"""API routes for AI-powered business idea generation."""

from fastapi import APIRouter, HTTPException
from app.schemas.idea import IdeaGenerateRequest
from app.services.business_service import BusinessService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
business_service = BusinessService()


@router.post("/generate")
async def generate_ideas(request: IdeaGenerateRequest):
    """
    Generate 6 personalized business ideas using Gemini AI.
    
    Accepts user profile (budget, location, skills, interests, notes)
    and returns AI-generated business ideas tailored to the user.
    """
    try:
        ideas = await business_service.generate_ideas(
            budget=request.budget,
            location=request.location,
            skills=request.skills,
            interests=request.interests,
            notes=request.additionalNotes,
        )
        return {"ideas": ideas, "count": len(ideas)}
    except ValueError as e:
        logger.error(f"JSON parsing error: {e}")
        raise HTTPException(
            status_code=500,
            detail="AI response could not be parsed. Please try again."
        )
    except Exception as e:
        logger.error(f"Idea generation error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate ideas: {str(e)}"
        )
