"""
BizNova AI — Business Service Layer
=====================================

This is the core service module that orchestrates all AI-powered business
features in the BizNova platform. It acts as the "brain" of the application,
sitting between the API routes (which handle HTTP) and the AI layer (which
talks to Gemini).

Architecture Role
-----------------
::

    API Routes (HTTP) → Business Service (Logic) → AI Layer (Gemini/ChromaDB)
                       ↕
                   Database (SQLAlchemy)

The service layer handles:
1. **Prompt construction** — Building the right prompt for each feature
2. **Response parsing** — Extracting JSON from Gemini's text output
3. **Error handling** — Graceful fallbacks when AI calls fail
4. **Memory management** — Loading conversation history for LTM
5. **CRAG orchestration** — Document-based Q&A with corrective retrieval

Available Features
------------------
1. **Idea Generation** — Generate 6 personalized business ideas
2. **Market Analysis** — Analyze demand trends, competitors, city data
3. **Forecasting** — 12-month revenue/growth predictions
4. **Business Plan** — Complete plan with investment, marketing, roadmap
5. **Chat (Standard)** — Conversational AI with LTM
6. **Chat (Streaming)** — Real-time streaming chat with typewriter effect
7. **Chat (CRAG)** — Document-based Q&A using Corrective RAG

Dependencies
------------
- ``app.ai.llm_client``: Gemini API wrapper (standard + streaming)
- ``app.ai.rag_pipeline``: CRAG pipeline for document Q&A
- ``app.ai.prompts.*``: Prompt templates for each feature

Usage
-----
::

    service = BusinessService()

    # Generate ideas
    ideas = await service.generate_ideas(budget="50000", location="Lahore", ...)

    # Streaming chat with LTM
    async for chunk in service.chat_response_stream(
        message="Tell me more",
        history=[{"role": "user", "content": "I want to start..."}],
        context="Exploring: Coffee Shop",
    ):
        print(chunk, end="")
"""

from app.ai.llm_client import generate_text, generate_text_stream, extract_json_from_response
from app.ai.prompts.idea_prompts import build_idea_generation_prompt
from app.ai.prompts.analysis_prompts import (
    build_market_analysis_prompt,
    build_forecast_prompt,
    build_business_plan_prompt,
)
from app.ai.prompts.chat_prompts import build_chat_prompt
from app.ai.rag_pipeline import crag_pipeline
import logging

logger = logging.getLogger(__name__)


class BusinessService:
    """
    Service layer for all AI-powered business features.

    This class provides a clean interface for the API routes to call.
    Each method corresponds to one feature of the BizNova platform.
    The service handles prompt building, AI calling, response parsing,
    and error logging.

    All methods are async because they make network calls to the Gemini
    API. The streaming methods are async generators that yield chunks.
    """

    # ─── Idea Generation ─────────────────────────────────────

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

        Builds a structured prompt from the user's profile (budget,
        location, skills, interests) and asks Gemini to return a JSON
        array of 6 business ideas, each with metadata like success
        score, investment required, time to market, etc.

        Args:
            budget (str): Investment budget in USD (e.g., "50000").
            location (str): Target city/region (e.g., "Lahore, Pakistan").
            skills (list[str]): User's skills (e.g., ["Python", "Marketing"]).
            interests (list[str]): Business interests (e.g., ["FinTech"]).
            notes (str, optional): Additional context from the user.

        Returns:
            list[dict]: List of 6 business idea dictionaries, each with:
                - id, title, description, category, successScore
                - investmentRequired, timeToMarket, marketDemand
                - competition, growthRate, tags

        Raises:
            ValueError: If Gemini's response can't be parsed as JSON.
            Exception: If the Gemini API call fails entirely.
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

    # ─── Market Analysis ─────────────────────────────────────

    async def generate_market_analysis(
        self,
        idea_title: str,
        location: str,
        category: str = "",
    ) -> dict:
        """
        Generate market analysis data (demand trends, city comparison, competitors).

        Asks Gemini to produce a structured JSON object with:
        - 12-month demand trends (monthly demand + growth values)
        - City-wise demand comparison (8 cities with scores)
        - Competitor analysis (5 competitors with market share)

        Args:
            idea_title (str): The business idea being analyzed.
            location (str): Target market location.
            category (str, optional): Business category for context.

        Returns:
            dict: Market analysis data with keys: demandTrends,
                cityDemand, competitors.
        """
        prompt = build_market_analysis_prompt(idea_title, location, category)
        logger.info(f"Generating market analysis for: {idea_title}")

        raw_response = await generate_text(prompt, temperature=0.7)
        analysis = extract_json_from_response(raw_response)
        return analysis

    # ─── Forecast ────────────────────────────────────────────

    async def generate_forecast(
        self,
        idea_title: str,
        location: str,
    ) -> dict:
        """
        Generate 12-month forecast with predictions and risk indicators.

        Produces a structured forecast including:
        - Monthly predictions with actual vs predicted values
        - Confidence intervals (upper/lower bounds)
        - Risk indicators (market volatility, regulatory, competition, tech)

        Args:
            idea_title (str): The business idea to forecast.
            location (str): Target market for region-specific predictions.

        Returns:
            dict: Forecast data with keys: predictions, riskIndicators.
        """
        prompt = build_forecast_prompt(idea_title, location)
        logger.info(f"Generating forecast for: {idea_title}")

        raw_response = await generate_text(prompt, temperature=0.6)
        forecast = extract_json_from_response(raw_response)
        return forecast

    # ─── Business Plan ───────────────────────────────────────

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

        Produces a comprehensive plan including:
        - Executive overview (mission, vision, target market, USP)
        - Investment breakdown (categories with amounts and percentages)
        - Revenue projections (quarterly)
        - Marketing strategy (channels, budgets, ROI estimates)
        - Implementation roadmap (4 phases with tasks)

        Args:
            idea_title (str): The business idea to plan for.
            budget (str): Total investment budget in USD.
            location (str): Target market location.
            skills (list[str]): User's skills for tailored recommendations.
            category (str, optional): Business category.

        Returns:
            dict: Business plan with keys: overview, investment,
                marketing, roadmap.
        """
        prompt = build_business_plan_prompt(idea_title, budget, location, skills, category)
        logger.info(f"Generating business plan for: {idea_title}")

        raw_response = await generate_text(prompt, temperature=0.7)
        plan = extract_json_from_response(raw_response)
        return plan

    # ─── Chat (Standard, Non-Streaming) ──────────────────────

    async def chat_response(
        self,
        message: str,
        history: list = None,
        context: str = None,
    ) -> str:
        """
        Generate an AI chat response using conversation history (non-streaming).

        This is the fallback method used when streaming is not needed
        (e.g., the ChatBubble popup). It sends the full prompt with
        LTM history to Gemini and returns the complete response.

        Args:
            message (str): The user's current message.
            history (list, optional): Recent conversation messages for LTM.
            context (str, optional): Current business context.

        Returns:
            str: The complete AI response text.
        """
        prompt = build_chat_prompt(message, history, context)
        logger.info(f"Chat request: {message[:50]}...")

        response = await generate_text(prompt, temperature=0.8)
        return response.strip()

    # ─── Chat (Streaming with LTM) ──────────────────────────

    async def chat_response_stream(
        self,
        message: str,
        history: list = None,
        context: str = None,
    ):
        """
        Generate a streaming AI chat response with LTM context.

        This is the primary chat method used by the SSE endpoint. It:
        1. Builds a prompt with conversation history (LTM)
        2. Calls Gemini with streaming enabled
        3. Yields text chunks as they arrive
        4. The SSE endpoint forwards chunks to the frontend in real-time

        The ``history`` parameter is loaded from the database by the chat
        route, providing true Long-Term Memory — the LLM sees previous
        messages from the same session even across page refreshes.

        Args:
            message (str): The user's current message.
            history (list, optional): Messages from the DB (LTM). Each
                item: ``{"role": "user/assistant", "content": "..."}``
            context (str, optional): Business context string.

        Yields:
            str: Text chunks as they arrive from Gemini. Each chunk is
                typically 1-50 characters.

        Example::

            async for chunk in service.chat_response_stream(
                message="What's the best marketing strategy?",
                history=db_messages,
                context="Exploring: Coffee Shop (FoodTech)",
            ):
                # Send chunk via SSE to frontend
                yield f"data: {chunk}\\n\\n"
        """
        prompt = build_chat_prompt(message, history, context)
        logger.info(f"Streaming chat request: {message[:50]}...")

        async for chunk in generate_text_stream(prompt, temperature=0.8):
            yield chunk

    # ─── Chat (CRAG — Document-Based Q&A, Streaming) ─────────

    async def chat_crag_stream(
        self,
        message: str,
        user_id: int,
    ):
        """
        Generate a streaming CRAG response for document-based Q&A.

        Routes the user's question through the Corrective RAG pipeline:
        1. Retrieve relevant chunks from the user's uploaded documents
        2. Grade each chunk for relevance (CRAG core)
        3. Decide: use documents (CORRECT), rewrite query (AMBIGUOUS),
           or use general knowledge (INCORRECT)
        4. Stream the generated answer

        This method is called when ``use_rag=True`` in the chat request,
        indicating the user wants to ask about their uploaded documents.

        Args:
            message (str): The user's question about their documents.
            user_id (int): The user whose documents to search.

        Yields:
            str: Text chunks of the CRAG-generated answer.
        """
        logger.info(f"CRAG chat request from user {user_id}: {message[:50]}...")

        async for chunk in crag_pipeline.query_stream(message, user_id):
            yield chunk
