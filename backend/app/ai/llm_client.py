import google.generativeai as genai
from app.core.config import settings
import json
import re


def get_gemini_model():
    """Initialize and return the Gemini model."""
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        generation_config={
            "temperature": 0.8,
            "top_p": 0.95,
            "max_output_tokens": 8192,
        },
    )
    return model


async def generate_text(prompt: str, temperature: float = 0.8) -> str:
    """
    Generate text using the Gemini model.
    Returns the raw text response from Gemini.
    """
    model = get_gemini_model()
    model._generation_config["temperature"] = temperature
    response = model.generate_content(prompt)
    return response.text


def extract_json_from_response(text: str) -> dict | list:
    """
    Extract JSON from Gemini's response text.
    Handles cases where Gemini wraps JSON in markdown code blocks.
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
