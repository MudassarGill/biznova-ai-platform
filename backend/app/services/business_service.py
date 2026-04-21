"""
Core business logic service — orchestrates Gemini AI calls for all business features.
"""

from app.ai.llm_client import generate_text, extract_json_from_response
from app.ai.prompts.idea_prompts import build_idea_generation_prompt
from app.ai.prompts.analysis_prompts import (
    build_market_analysis_prompt,
    build_forecast_prompt,
    build_business_plan_prompt,
)
from app.ai.prompts.chat_prompts import build_chat_prompt
import logging

logger = logging.getLogger(__name__)


class BusinessService:
    """Service layer for all AI-powered business features."""

    # ─── Idea Generation ─────────────────────────────────

    async def generate_ideas(
        self,
        budget: str,
        location: str,
        skills: list,
        interests: list,
        notes: str = "",
    ) -> list:
        """
        Generate 6 personalized business ideas using Gemini AI.
        Returns a list of business idea dicts.
        """
        prompt = build_idea_generation_prompt(budget, location, skills, interests, notes)
        logger.info(f"Generating ideas for location={location}, budget={budget}")

        raw_response = await generate_text(prompt, temperature=0.85)
        ideas = extract_json_from_response(raw_response)

        # Ensure it's a list
        if isinstance(ideas, dict):
            ideas = [ideas]

        # Ensure all ideas have sequential IDs
        for i, idea in enumerate(ideas):
            idea["id"] = i + 1

        logger.info(f"Generated {len(ideas)} business ideas")
        return ideas

    # ─── Market Analysis ─────────────────────────────────

    async def generate_market_analysis(
        self,
        idea_title: str,
        location: str,
        category: str = "",
    ) -> dict:
        """
        Generate market analysis data (demand trends, city comparison, competitors).
        """
        prompt = build_market_analysis_prompt(idea_title, location, category)
        logger.info(f"Generating market analysis for: {idea_title}")

        raw_response = await generate_text(prompt, temperature=0.7)
        analysis = extract_json_from_response(raw_response)
        return analysis

    # ─── Forecast ────────────────────────────────────────

    async def generate_forecast(
        self,
        idea_title: str,
        location: str,
    ) -> dict:
        """
        Generate 12-month forecast with predictions and risk indicators.
        """
        prompt = build_forecast_prompt(idea_title, location)
        logger.info(f"Generating forecast for: {idea_title}")

        raw_response = await generate_text(prompt, temperature=0.6)
        forecast = extract_json_from_response(raw_response)
        return forecast

    # ─── Business Plan ───────────────────────────────────

    async def generate_business_plan(
        self,
        idea_title: str,
        budget: str,
        location: str,
        skills: list,
        category: str = "",
    ) -> dict:
        """
        Generate a full business plan with overview, investment, marketing, and roadmap.
        """
        prompt = build_business_plan_prompt(idea_title, budget, location, skills, category)
        logger.info(f"Generating business plan for: {idea_title}")

        raw_response = await generate_text(prompt, temperature=0.7)
        plan = extract_json_from_response(raw_response)
        return plan

    # ─── Chat ────────────────────────────────────────────

    async def chat_response(
        self,
        message: str,
        history: list = None,
        context: str = None,
    ) -> str:
        """
        Generate an AI chat response using conversation history.
        """
        prompt = build_chat_prompt(message, history, context)
        logger.info(f"Chat request: {message[:50]}...")

        response = await generate_text(prompt, temperature=0.8)
        return response.strip()
