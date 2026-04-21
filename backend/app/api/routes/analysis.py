"""API routes for market analysis, forecast, and business plan generation."""

from fastapi import APIRouter, HTTPException
from app.schemas.idea import MarketAnalysisRequest, ForecastRequest, BusinessPlanRequest
from app.services.business_service import BusinessService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
business_service = BusinessService()


@router.post("/market")
async def get_market_analysis(request: MarketAnalysisRequest):
    """
    Generate AI-powered market analysis for a business idea.
    
    Returns demand trends, city-wise demand comparison, and competitor analysis.
    """
    try:
        analysis = await business_service.generate_market_analysis(
            idea_title=request.idea_title,
            location=request.location,
            category=request.category,
        )
        return analysis
    except ValueError as e:
        logger.error(f"Market analysis JSON error: {e}")
        raise HTTPException(
            status_code=500,
            detail="AI response could not be parsed. Please try again."
        )
    except Exception as e:
        logger.error(f"Market analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate market analysis: {str(e)}"
        )


@router.post("/forecast")
async def get_forecast(request: ForecastRequest):
    """
    Generate AI-powered 12-month forecast with predictions and risk indicators.
    """
    try:
        forecast = await business_service.generate_forecast(
            idea_title=request.idea_title,
            location=request.location,
        )
        return forecast
    except ValueError as e:
        logger.error(f"Forecast JSON error: {e}")
        raise HTTPException(
            status_code=500,
            detail="AI response could not be parsed. Please try again."
        )
    except Exception as e:
        logger.error(f"Forecast error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate forecast: {str(e)}"
        )


@router.post("/plan")
async def get_business_plan(request: BusinessPlanRequest):
    """
    Generate a comprehensive AI-powered business plan.
    
    Returns overview, investment breakdown, marketing strategy, and roadmap.
    """
    try:
        plan = await business_service.generate_business_plan(
            idea_title=request.idea_title,
            budget=request.budget,
            location=request.location,
            skills=request.skills,
            category=request.category,
        )
        return plan
    except ValueError as e:
        logger.error(f"Business plan JSON error: {e}")
        raise HTTPException(
            status_code=500,
            detail="AI response could not be parsed. Please try again."
        )
    except Exception as e:
        logger.error(f"Business plan error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate business plan: {str(e)}"
        )
