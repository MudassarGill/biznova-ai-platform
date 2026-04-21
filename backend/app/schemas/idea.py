"""Pydantic schemas for all AI business endpoints."""

from pydantic import BaseModel, Field
from typing import List, Optional


# ─── Ideas ───────────────────────────────────────────

class IdeaGenerateRequest(BaseModel):
    """Request body for generating business ideas."""
    budget: str = Field(..., description="Investment budget in USD")
    location: str = Field(..., description="Target city / location")
    skills: List[str] = Field(..., min_length=1, description="User skills")
    interests: List[str] = Field(default=[], description="Business interests")
    additionalNotes: str = Field(default="", description="Extra context")


class BusinessIdea(BaseModel):
    """Single business idea returned by the AI."""
    id: int
    title: str
    description: str
    category: str
    successScore: int
    investmentRequired: str
    timeToMarket: str
    marketDemand: str
    competition: str
    growthRate: str
    tags: List[str]


# ─── Market Analysis ────────────────────────────────

class MarketAnalysisRequest(BaseModel):
    """Request body for market analysis."""
    idea_title: str = Field(..., description="Business idea title")
    location: str = Field(..., description="Target location")
    category: str = Field(default="", description="Business category")


# ─── Forecast ───────────────────────────────────────

class ForecastRequest(BaseModel):
    """Request body for forecast generation."""
    idea_title: str = Field(..., description="Business idea title")
    location: str = Field(..., description="Target location")


# ─── Business Plan ──────────────────────────────────

class BusinessPlanRequest(BaseModel):
    """Request body for business plan generation."""
    idea_title: str = Field(..., description="Business idea title")
    budget: str = Field(..., description="Investment budget")
    location: str = Field(..., description="Target location")
    skills: List[str] = Field(default=[], description="User skills")
    category: str = Field(default="", description="Business category")


# ─── Chat ───────────────────────────────────────────

class ChatMessage(BaseModel):
    """A single chat message."""
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    """Request body for chat AI."""
    message: str = Field(..., description="User message")
    history: List[ChatMessage] = Field(default=[], description="Conversation history")
    context: Optional[str] = Field(default=None, description="Current business context")
