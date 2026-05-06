"""
BizNova AI — LLM Client (Google Gemini Integration)
=====================================================

This module is the central interface between the BizNova backend and
Google's Gemini generative AI model. It provides two modes of operation:

1. **Standard Generation** (``generate_text``):
   Sends a prompt to Gemini and waits for the complete response. Used by
   the idea generation, market analysis, forecast, and business plan
   features where the entire JSON response is needed before parsing.

2. **Streaming Generation** (``generate_text_stream``):
   Sends a prompt to Gemini with ``stream=True`` and yields text chunks
   as they arrive. Used by the chat assistant to provide a real-time
   "typewriter" effect — the user sees words appearing as the model
   generates them, dramatically improving perceived responsiveness.

Architecture Notes
------------------
- The Gemini model is initialized lazily via ``get_gemini_model()``.
- Temperature controls randomness: lower = more deterministic, higher = more
  creative. Business analysis uses 0.6-0.7, chat uses 0.8.
- ``extract_json_from_response()`` handles Gemini's tendency to wrap JSON
  in markdown code blocks (```json ... ```), which would break JSON parsing.
- The streaming function catches exceptions per-chunk to ensure partial
  responses are still delivered even if the stream is interrupted.

Dependencies
------------
- ``google-generativeai>=0.8.0``: Google's official Python SDK for Gemini.

Environment Variables
---------------------
- ``GEMINI_API_KEY``: Required. Your Google AI Studio API key.

Usage Examples
--------------
Standard::

    response = await generate_text("Explain AI in business", temperature=0.7)
    print(response)  # Full text string

Streaming::

    async for chunk in generate_text_stream("Tell me about startups"):
        print(chunk, end="", flush=True)  # Prints character by character
"""

import google.generativeai as genai
from app.core.config import settings
import json
import re
import logging

logger = logging.getLogger(__name__)


def get_gemini_model():
    """
    Initialize and return the Gemini generative model instance.

    Configures the API key from environment settings and creates a
    ``GenerativeModel`` with default generation parameters. The model
    name ``gemini-1.5-flash`` is chosen for its balance of speed and
    quality — fast enough for real-time streaming, capable enough for
    business analysis.

    Returns:
        genai.GenerativeModel: Configured Gemini model ready for use.
    """
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={
            "temperature": 0.8,
            "top_p": 0.95,
            "max_output_tokens": 8192,
        },
    )
    return model


async def generate_text(prompt: str, temperature: float = 0.8) -> str:
    """
    Generate text using the Gemini model (non-streaming).

    Sends the full prompt to Gemini and blocks until the complete response
    is received. This is used for structured outputs (JSON) where partial
    responses are not useful.

    Args:
        prompt (str): The complete prompt string to send to Gemini.
        temperature (float): Controls randomness. 0.0 = deterministic,
            1.0 = maximum creativity. Default 0.8 for conversational use.

    Returns:
        str: The raw text response from Gemini. May contain markdown
            formatting or JSON wrapped in code blocks.

    Raises:
        Exception: If the Gemini API call fails (network error, quota
            exceeded, invalid API key, etc.).
    """
    model = get_gemini_model()
    model._generation_config["temperature"] = temperature
    response = model.generate_content(prompt)
    return response.text


async def generate_text_stream(prompt: str, temperature: float = 0.8):
    """
    Generate text using the Gemini model with real-time streaming.

    This is an async generator that yields text chunks as Gemini produces
    them. Each chunk is a small piece of the response (typically a few
    words or a sentence fragment). The chat endpoint uses this to send
    Server-Sent Events (SSE) to the frontend, creating a typewriter effect.

    How streaming works internally:
    1. We call ``model.generate_content(prompt, stream=True)``
    2. Gemini returns an iterator of ``GenerateContentResponse`` objects
    3. Each response object has a ``.text`` attribute with the new chunk
    4. We ``yield`` each chunk to the caller immediately
    5. The caller (SSE endpoint) sends it to the frontend in real-time

    Args:
        prompt (str): The complete prompt string to send to Gemini.
        temperature (float): Controls randomness. Default 0.8 for chat.

    Yields:
        str: Individual text chunks as they arrive from the Gemini API.
            Chunks are typically 1-50 characters each.

    Raises:
        Exception: Logged but not re-raised for individual chunks. The
            stream will end gracefully if an error occurs mid-stream.

    Example::

        async for chunk in generate_text_stream("Hello, tell me a joke"):
            print(chunk, end="")  # "Why did the chicken..."
    """
    model = get_gemini_model()
    model._generation_config["temperature"] = temperature

    try:
        response = model.generate_content(prompt, stream=True)
        for chunk in response:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        logger.error(f"Streaming generation error: {e}")
        yield f"\n\n⚠️ Error during generation: {str(e)}"


def extract_json_from_response(text: str) -> dict | list:
    """
    Extract and parse JSON from Gemini's response text.

    Gemini often wraps JSON output in markdown code blocks like:
    ```json
    {"key": "value"}
    ```

    This function handles multiple formats:
    1. JSON inside ```json ... ``` code blocks
    2. JSON inside ``` ... ``` code blocks (no language tag)
    3. Raw JSON string (no wrapping)
    4. JSON embedded in surrounding text (finds first { or [)

    Args:
        text (str): Raw response text from Gemini that should contain JSON.

    Returns:
        dict | list: Parsed JSON object or array.

    Raises:
        ValueError: If no valid JSON could be extracted from the response.
            Includes the first 200 characters of the response for debugging.
    """
    # Try to find JSON in code block
    json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
    if json_match:
        json_str = json_match.group(1)
    else:
        # Try the full text as JSON
        json_str = text.strip()

    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        # Last attempt: find first [ or { and extract
        for i, char in enumerate(json_str):
            if char in '[{':
                # Find matching closing bracket
                bracket_count = 0
                for j in range(i, len(json_str)):
                    if json_str[j] in '[{':
                        bracket_count += 1
                    elif json_str[j] in ']}':
                        bracket_count -= 1
                    if bracket_count == 0:
                        try:
                            return json.loads(json_str[i:j+1])
                        except json.JSONDecodeError:
                            break
                break
        raise ValueError(f"Could not extract valid JSON from response: {text[:200]}...")
