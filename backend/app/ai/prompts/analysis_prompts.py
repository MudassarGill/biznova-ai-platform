"""Prompt templates for market analysis, forecast, and business plan generation."""


def build_market_analysis_prompt(idea_title: str, location: str, category: str = "") -> str:
    """Build prompt for market analysis data."""
    return f"""You are BizNova AI — an expert market analyst with deep knowledge of business trends.

Analyze the market for this business idea:
- **Business Idea**: {idea_title}
- **Target Location**: {location}
- **Category**: {category or "General"}

Generate comprehensive market analysis data. Return ONLY valid JSON with this exact structure:

{{
  "demandTrends": [
    {{"month": "Jan", "demand": 65, "growth": 12}},
    {{"month": "Feb", "demand": 72, "growth": 15}},
    {{"month": "Mar", "demand": 68, "growth": 14}},
    {{"month": "Apr", "demand": 85, "growth": 22}},
    {{"month": "May", "demand": 90, "growth": 25}},
    {{"month": "Jun", "demand": 88, "growth": 24}},
    {{"month": "Jul", "demand": 95, "growth": 28}},
    {{"month": "Aug", "demand": 102, "growth": 32}},
    {{"month": "Sep", "demand": 98, "growth": 30}},
    {{"month": "Oct", "demand": 110, "growth": 35}},
    {{"month": "Nov", "demand": 115, "growth": 38}},
    {{"month": "Dec", "demand": 120, "growth": 42}}
  ],
  "cityDemand": [
    {{"city": "CityName", "demand": 95, "competition": 82, "score": 78}}
  ],
  "competitors": [
    {{"name": "Competitor Name", "marketShare": 28, "growth": 12, "threat": "High"}}
  ]
}}

Requirements:
1. demandTrends: 12 months (Jan-Dec) with realistic demand (50-150) and growth (5-50) values based on the business type
2. cityDemand: 8 cities relevant to {location}. If location is in Pakistan, include Pakistani cities (Karachi, Lahore, Islamabad, etc.). Mix with some international cities for comparison. Each with demand (60-100), competition (30-95), and score (60-95)
3. competitors: 5 entries with realistic names for the {category or idea_title} space, marketShare (5-35), growth (3-25), threat (Low/Medium/High)
4. All values should be realistic for the specific business and location

Return ONLY the JSON object. No additional text or markdown."""


def build_forecast_prompt(idea_title: str, location: str) -> str:
    """Build prompt for forecast predictions."""
    return f"""You are BizNova AI — an expert business forecasting analyst.

Generate a 12-month forecast for this business:
- **Business Idea**: {idea_title}
- **Target Location**: {location}

Return ONLY valid JSON with this exact structure:

{{
  "predictions": [
    {{"month": "Jan 25", "actual": 120, "predicted": 118, "lower": 110, "upper": 126}},
    {{"month": "Feb 25", "actual": 125, "predicted": 122, "lower": 114, "upper": 130}},
    {{"month": "Mar 25", "actual": 130, "predicted": 128, "lower": 120, "upper": 136}},
    {{"month": "Apr 25", "actual": null, "predicted": 135, "lower": 125, "upper": 145}},
    {{"month": "May 25", "actual": null, "predicted": 142, "lower": 130, "upper": 154}},
    {{"month": "Jun 25", "actual": null, "predicted": 148, "lower": 134, "upper": 162}},
    {{"month": "Jul 25", "actual": null, "predicted": 155, "lower": 138, "upper": 172}},
    {{"month": "Aug 25", "actual": null, "predicted": 162, "lower": 142, "upper": 182}},
    {{"month": "Sep 25", "actual": null, "predicted": 168, "lower": 146, "upper": 190}},
    {{"month": "Oct 25", "actual": null, "predicted": 175, "lower": 150, "upper": 200}},
    {{"month": "Nov 25", "actual": null, "predicted": 182, "lower": 155, "upper": 209}},
    {{"month": "Dec 25", "actual": null, "predicted": 190, "lower": 160, "upper": 220}}
  ],
  "riskIndicators": [
    {{"label": "Market Volatility", "value": 35, "status": "low"}},
    {{"label": "Regulatory Risk", "value": 22, "status": "low"}},
    {{"label": "Competition Growth", "value": 65, "status": "medium"}},
    {{"label": "Tech Disruption", "value": 48, "status": "medium"}}
  ]
}}

Requirements:
1. predictions: 12 months. First 3 months have actual values, rest have null for actual (future predictions). Values should show a realistic growth trajectory. lower/upper are confidence bounds.
2. riskIndicators: Exactly 4 risk factors with value (0-100) and status (low: 0-40, medium: 41-70, high: 71-100). Make them realistic for {idea_title} in {location}.
3. All numbers should be realistic for the business type

Return ONLY the JSON object. No additional text or markdown."""


def build_business_plan_prompt(idea_title: str, budget: str, location: str, skills: list, category: str = "") -> str:
    """Build prompt for full business plan generation."""
    skills_str = ", ".join(skills) if skills else "General"
    return f"""You are BizNova AI — an expert business consultant and strategist.

Generate a comprehensive business plan for:
- **Business Idea**: {idea_title}
- **Budget**: ${budget} USD
- **Location**: {location}
- **Skills**: {skills_str}
- **Category**: {category or "General"}

Return ONLY valid JSON with this EXACT structure:

{{
  "overview": {{
    "title": "{idea_title}",
    "mission": "A compelling mission statement (1-2 sentences)",
    "vision": "An ambitious vision statement (1-2 sentences)",
    "targetMarket": "Detailed target market description",
    "uniqueValue": "Clear unique value proposition"
  }},
  "investment": {{
    "totalRequired": "${budget}",
    "breakdown": [
      {{"category": "Development", "amount": 35000, "percentage": 41}},
      {{"category": "Marketing", "amount": 20000, "percentage": 24}},
      {{"category": "Operations", "amount": 12000, "percentage": 14}},
      {{"category": "Legal & Compliance", "amount": 8000, "percentage": 9}},
      {{"category": "Reserve Fund", "amount": 10000, "percentage": 12}}
    ],
    "revenueProjection": [
      {{"quarter": "Q1", "revenue": 5000, "users": 500}},
      {{"quarter": "Q2", "revenue": 18000, "users": 2200}},
      {{"quarter": "Q3", "revenue": 45000, "users": 5800}},
      {{"quarter": "Q4", "revenue": 85000, "users": 12000}}
    ]
  }},
  "marketing": {{
    "channels": [
      {{"name": "Channel Name", "budget": "$8,000", "roi": "320%", "priority": "High"}},
      {{"name": "Channel Name", "budget": "$5,000", "roi": "450%", "priority": "High"}},
      {{"name": "Channel Name", "budget": "$4,000", "roi": "280%", "priority": "Medium"}},
      {{"name": "Channel Name", "budget": "$3,000", "roi": "200%", "priority": "Medium"}}
    ],
    "strategy": "A detailed marketing strategy paragraph"
  }},
  "roadmap": [
    {{"phase": "Phase 1: MVP", "duration": "0-3 months", "tasks": ["Task 1", "Task 2", "Task 3", "Task 4"], "status": "current"}},
    {{"phase": "Phase 2: Growth", "duration": "3-6 months", "tasks": ["Task 1", "Task 2", "Task 3", "Task 4"], "status": "upcoming"}},
    {{"phase": "Phase 3: Scale", "duration": "6-12 months", "tasks": ["Task 1", "Task 2", "Task 3", "Task 4"], "status": "future"}},
    {{"phase": "Phase 4: Dominate", "duration": "12-18 months", "tasks": ["Task 1", "Task 2", "Task 3", "Task 4"], "status": "future"}}
  ]
}}

Requirements:
1. Investment breakdown amounts must sum to approximately ${budget}
2. Revenue projections should be realistic for {location} market
3. Marketing channels should be relevant to {category or idea_title} in {location}
4. Roadmap tasks should be specific and actionable
5. All content should be tailored to {location} and the user's skills: {skills_str}

Return ONLY the JSON object. No additional text or markdown."""
