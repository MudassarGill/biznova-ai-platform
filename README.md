<div align="center">
  <img src="frontend/public/logo.png" alt="BizNova Logo" width="120" height="auto" />
  <h1>🚀 BizNova AI — Business Intelligence Platform</h1>
  <p><strong>From Idea to Execution — Powered by Generative AI & MLOps</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Gemini_AI-FF9900?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  </p>

  <p>
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-features">Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-api-reference">API Reference</a> •
    <a href="#-roadmap">Roadmap</a>
  </p>
</div>

---

## 📖 Overview

**BizNova** is a full-stack AI-powered SaaS platform that helps entrepreneurs discover, evaluate, and execute profitable business ideas. It leverages **Google Gemini AI** for intelligent idea generation, market analysis, financial forecasting, and automated business plan creation — all through a stunning, modern dashboard interface.

Whether you're a first-time founder in Lahore or a serial entrepreneur in Silicon Valley, BizNova provides the data-driven intelligence you need to succeed.

### 🎯 What Makes BizNova Different?

- **🇵🇰 Pakistan-First**: Pre-loaded with 40+ Pakistani cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and many more) plus 20 international cities
- **✍️ Custom City Input**: Users can type any city name manually if it's not in the list
- **🤖 Real AI Responses**: Uses Google Gemini 2.0 Flash for all AI features — no hardcoded responses
- **📊 End-to-End Pipeline**: From idea generation → market analysis → forecasting → business plan → AI chat assistant
- **🔒 Secure Auth**: JWT-based authentication with bcrypt password hashing

---

## ✨ Features

| Feature | Description |
|---|---|
| **🧠 AI Idea Generation** | Get 6 personalized business ideas based on your budget, location, skills, and interests |
| **📈 Market Analysis** | Deep dive into demand trends, city-wise insights, and competitor landscape |
| **🔮 Future Forecasting** | 12-month predictive models with confidence intervals and risk indicators |
| **📋 Business Plan Builder** | Instant generation of comprehensive plans with investment breakdown, marketing strategy, and phased roadmap |
| **💬 AI Chat Assistant** | Context-aware chatbot that remembers your conversation and current business context |
| **🔐 Auth System** | Register, login, JWT tokens, protected routes, profile management |
| **🏙️ Pakistan Cities** | 40 Pakistani cities pre-loaded + any custom city via manual input |
| **🌙 Dark Mode UI** | Premium glassmorphism dark theme with smooth animations |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Landing  │ │   Auth   │ │  Input   │ │   Dashboard    │  │
│  │  Page    │ │   Page   │ │  Page    │ │  Layout (7pg)  │  │
│  └─────────┘ └──────────┘ └──────────┘ └────────────────┘  │
│                         │                                    │
│                   AppContext.jsx                              │
│               (State + API Client)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP (REST API)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   API Routes                          │   │
│  │  /api/auth/*  /api/ideas/*  /api/analysis/*  /api/chat│   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │              Services Layer                           │   │
│  │  AuthService    BusinessService (AI orchestrator)     │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────┐ ┌─────▼──────────┐ ┌──────────────────┐  │
│  │   Database   │ │   AI Engine    │ │  Prompt Library   │  │
│  │  (SQLite)    │ │ (Gemini 2.0)   │ │  (Templates)      │  │
│  └──────────────┘ └────────────────┘ └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
biznova-ai-platform/
│
├── frontend/                     # React + Vite Application
│   ├── public/                   # Static assets (logo, icons)
│   ├── src/
│   │   ├── components/           # Reusable UI (Toast, ChatBubble, Skeleton)
│   │   ├── context/
│   │   │   └── AppContext.jsx    # Global state + API client (real + mock fallback)
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx  # Sidebar + content wrapper
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Hero page with CTA
│   │   │   ├── AuthPage.jsx      # Login / Register split-screen
│   │   │   ├── InputPage.jsx     # User profile form (budget, city, skills)
│   │   │   ├── IdeasPage.jsx     # AI-generated ideas grid
│   │   │   ├── AnalysisPage.jsx  # Market analysis charts
│   │   │   ├── ForecastPage.jsx  # Predictive forecasting charts
│   │   │   ├── PlanPage.jsx      # Business plan viewer
│   │   │   ├── ChatPage.jsx      # AI chat assistant
│   │   │   └── UserDashboard.jsx # Saved ideas & profile
│   │   ├── index.css             # Tailwind + custom styles
│   │   ├── main.jsx              # React entry point
│   │   └── App.jsx               # Router configuration
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                      # FastAPI Application
│   ├── app/
│   │   ├── ai/                   # AI Engine
│   │   │   ├── llm_client.py     # Gemini API client + JSON extractor
│   │   │   └── prompts/
│   │   │       ├── idea_prompts.py      # Idea generation prompts
│   │   │       ├── analysis_prompts.py  # Market/forecast/plan prompts
│   │   │       └── chat_prompts.py      # Chat assistant prompts
│   │   ├── api/
│   │   │   ├── dependencies/
│   │   │   │   └── auth.py       # JWT token dependency
│   │   │   └── routes/
│   │   │       ├── auth.py       # POST /register, /login
│   │   │       ├── users.py      # GET/PUT /me
│   │   │       ├── ideas.py      # POST /generate
│   │   │       ├── analysis.py   # POST /market, /forecast, /plan
│   │   │       └── chat.py       # POST /chat
│   │   ├── core/
│   │   │   ├── config.py         # Settings (env vars)
│   │   │   └── security.py       # JWT + bcrypt utilities
│   │   ├── db/
│   │   │   ├── models/
│   │   │   │   └── user.py       # SQLAlchemy User model
│   │   │   ├── repositories/
│   │   │   └── session.py        # Database engine & session
│   │   ├── schemas/
│   │   │   ├── user.py           # User Pydantic schemas
│   │   │   └── idea.py           # Business/AI Pydantic schemas
│   │   ├── services/
│   │   │   ├── auth_service.py   # Auth business logic
│   │   │   └── business_service.py  # AI orchestration service
│   │   └── main.py               # FastAPI app + route registration
│   ├── tests/                    # Test suites
│   ├── .env                      # Environment variables (not committed)
│   └── requirements.txt          # Python dependencies
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Download |
|---|---|---|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org) |
| **Python** | 3.10+ | [python.org](https://python.org) |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |
| **Gemini API Key** | Free | [aistudio.google.com](https://aistudio.google.com) |

### Step 1: Clone the Repository

```bash
git clone https://github.com/MudassarGill/biznova-ai-platform.git
cd biznova-ai-platform
```

### Step 2: Setup Backend (FastAPI)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables

Create/edit the `.env` file in the `backend/` directory:

```env
# ─── BizNova Backend Configuration ───
SECRET_KEY=your_super_secret_key_change_me
DATABASE_URL=sqlite:///./biznova.db
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

> **💡 Get your free Gemini API key** at [aistudio.google.com](https://aistudio.google.com) → Create API Key

### Step 4: Start the Backend Server

```bash
# From the backend/ directory (with venv activated)
uvicorn app.main:app --reload
```

✅ Backend will be running at **http://localhost:8000**
📚 Swagger Docs available at **http://localhost:8000/docs**

### Step 5: Setup Frontend (React + Vite)

```bash
# Open a NEW terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend will be running at **http://localhost:5173**

### Step 6: Test the App! 🎉

1. Open **http://localhost:5173** in your browser
2. Click **"Get Started"** on the landing page
3. **Register** a new account (any email + 8-char password)
4. **Login** with your credentials
5. Fill in the **Input Form**:
   - Set your budget (e.g., 50,000)
   - Select a Pakistani city (e.g., Lahore) or type your own
   - Add your skills
   - Choose business interests
6. Click **"Generate Business Ideas"** → AI generates 6 personalized ideas
7. Click any idea to see **Market Analysis**, **Forecasting**, and **Business Plan**
8. Try the **AI Chat** to ask questions about your business

---

## 🌐 API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login → returns JWT token |
| `GET` | `/api/users/me` | Get current user profile |
| `PUT` | `/api/users/me` | Update profile |

### AI Business Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ideas/generate` | Generate 6 AI business ideas |
| `POST` | `/api/analysis/market` | Get market analysis data |
| `POST` | `/api/analysis/forecast` | Get 12-month forecast |
| `POST` | `/api/analysis/plan` | Generate full business plan |
| `POST` | `/api/chat` | Chat with AI assistant |

### Example: Generate Ideas

```bash
curl -X POST http://localhost:8000/api/ideas/generate \
  -H "Content-Type: application/json" \
  -d '{
    "budget": "50000",
    "location": "Lahore",
    "skills": ["Web Development", "Machine Learning"],
    "interests": ["Technology", "E-commerce"],
    "additionalNotes": "Looking for SaaS ideas"
  }'
```

---

## ⚙️ Environment Variables

| Variable | Description | Required | Default |
|---|---|---|---|
| `SECRET_KEY` | JWT signing key | Yes | `fallback_dev_key` |
| `DATABASE_URL` | Database connection string | No | `sqlite:///./biznova.db` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiry | No | `60` |
| `CORS_ORIGINS` | Allowed frontend origins | No | `http://localhost:5173` |
| `GEMINI_API_KEY` | Google Gemini API key | **Yes** | — |

---

## 🏙️ Supported Cities

### 🇵🇰 Pakistan (40 Cities)
Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, Gujranwala, Hyderabad, Bahawalpur, Sargodha, Abbottabad, Mardan, Sukkur, Larkana, Sahiwal, Jhang, Rahim Yar Khan, Sheikhupura, Gujrat, Kasur, Dera Ghazi Khan, Chiniot, Muzaffargarh, Mirpur Khas, Nawabshah, Mingora, Kohat, Okara, Kamoke, Jhelum, Sadiqabad, Burewala, Jacobabad, Khairpur, Khanewal, Hafizabad, Attock

### 🌍 International (20 Cities)
New York, San Francisco, Austin, Chicago, Seattle, Miami, Denver, Boston, Los Angeles, Atlanta, London, Berlin, Toronto, Singapore, Dubai, Riyadh, Doha, Istanbul, Kuala Lumpur, Sydney

### ✍️ Custom Input
Users can also type any city name manually by selecting **"Type my own city..."** at the bottom of the dropdown.

---

## 🛠️ Technology Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 18 | UI Component Library |
| Vite 5 | Build Tool with HMR |
| Tailwind CSS 3 | Utility-First Styling |
| React Router v6 | Client-Side Routing |
| Recharts | Data Visualization |
| Lucide React | Icon Library |
| Framer Motion | Animations |

### Backend
| Tech | Purpose |
|---|---|
| Python 3.10+ | Runtime |
| FastAPI | Async REST API Framework |
| Google Gemini 2.0 Flash | Generative AI Engine |
| SQLAlchemy | ORM (Database) |
| SQLite | Local Database |
| JWT (python-jose) | Authentication |
| Passlib + Bcrypt | Password Hashing |
| Pydantic v2 | Data Validation |

---

## 🗺️ Roadmap

### ✅ Phase 1: Local Development (Current)
- [x] Frontend UI (9 pages, dark theme)
- [x] Auth system (JWT, signup/login)
- [x] Pakistan cities + custom input
- [x] Gemini AI integration (ideas, analysis, forecast, plan, chat)
- [x] Mock fallback for offline development

### 🔜 Phase 2: End-to-End Production
- [ ] Dockerize frontend + backend
- [ ] PostgreSQL migration (replace SQLite)
- [ ] AWS deployment (ECS / EC2 + RDS + S3)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Environment-based configuration

### 🔮 Phase 3: MLOps & Scale
- [ ] ML model versioning (MLflow)
- [ ] Model monitoring & drift detection
- [ ] A/B testing framework
- [ ] Data pipeline (Airflow / Prefect)
- [ ] Feature store
- [ ] Automated retraining pipeline
- [ ] Load testing & auto-scaling
- [ ] Observability (Prometheus + Grafana)

---

## 👨‍💻 About the Creator

**Mudassar Hussain**
*Data Scientist | AI/ML Engineer | Deep Learning | MLOps | NLP | Gen AI & AI Agents*

Passionate about building scalable AI-driven solutions that solve real-world problems. With specialized expertise in Machine Learning, Generative AI, RAG architectures, and rigorous MLOps practices, BizNova was architected to empower entrepreneurs by turning abstract ideas into data-driven business intelligence.

- 🔗 **GitHub:** [@MudassarGill](https://github.com/MudassarGill)
- 💼 **LinkedIn:** [M. Mudassar Hussain](https://linkedin.com/in/m-mudassar-85)
- 📧 **Email:** mudassarjutt65030@gmail.com
- 🌐 **Portfolio:** [Mudassar Hussain](https://mudassar-ai-portfolio.onrender.com)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <i>© 2026 BizNova. AI-Powered Business Intelligence Platform. All rights reserved.</i>
  <br/>
  <strong>Built with ❤️ by Mudassar Hussain</strong>
</p>
