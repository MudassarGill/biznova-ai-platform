<div align="center">
  <img src="frontend/public/logo.png" alt="BizNova Logo" width="120" height="auto" />
  <h1>🚀 BizNova AI — Business Intelligence Platform</h1>
  <p><strong>From Idea to Execution — Powered by Generative AI</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Google_Gemini_AI-FF9900?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  </p>
</div>

---

## 📖 What is BizNova?

**BizNova** is an AI-powered SaaS platform that helps entrepreneurs and business professionals discover, evaluate, and launch profitable business ideas. Simply enter your budget, city, and skills — and BizNova's AI engine generates personalized business ideas, performs deep market analysis, predicts future trends, creates full business plans, and provides an intelligent AI assistant to guide you every step of the way.

---

## ✨ Key Features

| Feature | What It Does |
|---|---|
| **🧠 AI Idea Generation** | Enter your budget, location, and skills → get 6 data-driven business ideas tailored to you |
| **📈 Market Analysis** | Interactive charts showing demand trends, city-wise market comparison, and competitive landscape |
| **🔮 Predictive Forecasting** | 12-month revenue predictions with confidence intervals and risk assessment indicators |
| **📋 Auto Business Plan** | Complete business plan with investment breakdown, marketing strategy, and phased execution roadmap |
| **💬 AI Chat Assistant** | Context-aware AI chatbot that remembers your conversation and gives strategic business advice |
| **🏙️ 40+ Pakistan Cities** | Pre-loaded with Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and 32 more Pakistani cities |
| **✍️ Custom City Input** | Don't see your city? Type any city name manually |
| **🌍 International Support** | 20 major global cities also included (New York, London, Dubai, Singapore, etc.) |
| **🔐 Secure Authentication** | Register, login, and manage your profile with JWT-based security |
| **🌙 Premium Dark UI** | Stunning glassmorphism dark theme with smooth animations and responsive design |

---

## 🔄 How It Works

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   1. INPUT   │────▶│  2. AI ANALYSIS  │────▶│   3. RESULTS     │
│              │     │                  │     │                  │
│ • Budget     │     │ • Gemini AI      │     │ • 6 Business     │
│ • City       │     │   processes your │     │   Ideas          │
│ • Skills     │     │   profile        │     │ • Market Charts  │
│ • Interests  │     │ • Analyzes local │     │ • Forecasts      │
│              │     │   markets        │     │ • Business Plan  │
└──────────────┘     └──────────────────┘     └──────────────────┘
```

1. **Tell Us About You** — Set your investment budget, select your city (40+ Pakistani cities or type any custom city), add your skills and business interests
2. **AI Generates Ideas** — Google Gemini AI analyzes your profile and local market conditions to generate 6 personalized business ideas
3. **Explore Deep Insights** — Click any idea to see market demand charts, competitor analysis, 12-month forecasts, and a complete business plan
4. **Get AI Guidance** — Use the built-in AI chat assistant anytime for strategic advice and answers to your business questions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Role |
|---|---|
| React 18 | UI Framework |
| Vite 5 | Build Tool (Fast HMR) |
| Tailwind CSS 3 | Styling (Custom Dark Theme) |
| React Router v6 | Page Navigation |
| Recharts | Data Visualization & Charts |
| Lucide React | Icons |
| Framer Motion | Animations |

### Backend
| Technology | Role |
|---|---|
| Python 3.10+ | Server Runtime |
| FastAPI | REST API Framework |
| Google Gemini 2.0 Flash | AI / Generative AI Engine |
| SQLAlchemy | Database ORM |
| SQLite | Database |
| JWT (python-jose) | Authentication Tokens |
| Passlib + Bcrypt | Password Security |
| Pydantic v2 | Request/Response Validation |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org)
- **Python** 3.10+ — [Download](https://python.org)
- **Gemini API Key** (Free) — [Get it here](https://aistudio.google.com)

### 1. Clone the Repository

```bash
git clone https://github.com/MudassarGill/biznova-ai-platform.git
cd biznova-ai-platform
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```env
SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///./biznova.db
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the server:

```bash
uvicorn app.main:app --reload
```

> Backend runs at **http://localhost:8000** — API docs at **http://localhost:8000/docs**

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs at **http://localhost:5173**

### 4. Open & Use

Visit **http://localhost:5173** → Register → Login → Start generating business ideas!

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Login & get JWT token |
| `GET` | `/api/users/me` | Get user profile |
| `PUT` | `/api/users/me` | Update profile |
| `POST` | `/api/ideas/generate` | Generate AI business ideas |
| `POST` | `/api/analysis/market` | Get market analysis data |
| `POST` | `/api/analysis/forecast` | Get 12-month forecast |
| `POST` | `/api/analysis/plan` | Generate business plan |
| `POST` | `/api/chat` | Chat with AI assistant |

---

## 🏙️ Supported Cities

### 🇵🇰 Pakistan (40 Cities)
Karachi • Lahore • Islamabad • Rawalpindi • Faisalabad • Multan • Peshawar • Quetta • Sialkot • Gujranwala • Hyderabad • Bahawalpur • Sargodha • Abbottabad • Mardan • Sukkur • Larkana • Sahiwal • Jhang • Rahim Yar Khan • Sheikhupura • Gujrat • Kasur • Dera Ghazi Khan • Chiniot • Muzaffargarh • Mirpur Khas • Nawabshah • Mingora • Kohat • Okara • Kamoke • Jhelum • Sadiqabad • Burewala • Jacobabad • Khairpur • Khanewal • Hafizabad • Attock

### 🌍 International (20 Cities)
New York • San Francisco • Austin • Chicago • Seattle • Miami • Denver • Boston • Los Angeles • Atlanta • London • Berlin • Toronto • Singapore • Dubai • Riyadh • Doha • Istanbul • Kuala Lumpur • Sydney

> **Custom Input**: Select "Type my own city..." to enter any city not listed above.

---

## 👨‍💻 Author

**Mudassar Hussain**

- 🔗 **GitHub:** [@MudassarGill](https://github.com/MudassarGill)
- 💼 **LinkedIn:** [M. Mudassar Hussain](https://linkedin.com/in/m-mudassar-85)
- 📧 **Email:** mudassarjutt65030@gmail.com
- 🌐 **Portfolio:** [mudassar-ai-portfolio.onrender.com](https://mudassar-ai-portfolio.onrender.com)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>⭐ Star this repo if you find it useful!</strong>
  <br/><br/>
  <i>© 2026 BizNova — AI-Powered Business Intelligence Platform</i>
</p>
