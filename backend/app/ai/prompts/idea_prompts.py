"""Prompt templates for business idea generation."""


def build_idea_generation_prompt(budget: str, location: str, skills: list, interests: list, notes: str = "") -> str:
    """
    Build a structured prompt for Gemini to generate business ideas.
    """
    skills_str = ", ".join(skills) if skills else "General skills"
    interests_str = ", ".join(interests) if interests else "Open to all industries"

    prompt = f"""You are BizNova AI — an expert business strategist and market analyst.

A user wants you to generate 6 personalized, data-driven business ideas.

## User Profile:
- **Investment Budget**: ${budget} USD
- **Target Location**: {location}
- **Skills & Expertise**: {skills_str}
- **Business Interests**: {interests_str}
{f'- **Additional Notes**: {notes}' if notes else ''}

## Requirements:
1. Generate exactly 6 unique, realistic business ideas tailored to this user's profile.
2. Each idea must be practical and achievable with the given budget and skills.
3. Consider the local market conditions of {location}.
4. Provide a mix of low-risk and high-potential ideas.
5. Each idea must have a calculated "successScore" between 60-95.

## Output Format — Return ONLY valid JSON (no markdown, no explanation):
[
  {{
    "id": 1,
    "title": "Business Name",
    "description": "A detailed 2-3 sentence description of the business idea explaining what it does and why it's a good fit.",
    "category": "Industry Category (e.g., FinTech, SaaS, FoodTech, HealthTech, EdTech, etc.)",
    "successScore": 85,
    "investmentRequired": "$X,000 - $Y,000",
    "timeToMarket": "X-Y months",
    "marketDemand": "Very High | High | Medium",
    "competition": "Low | Medium | High",
    "growthRate": "+XX%",
    "tags": ["Tag1", "Tag2", "Tag3"]
  }}
]

Return ONLY the JSON array. No additional text, explanation, or markdown code blocks."""
    return prompt
