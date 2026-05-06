<div align="center">
  <img src="frontend/public/logo.png" alt="BizNova Logo" width="120" height="auto" />
  <h1>🚀 BizNova AI — Business Intelligence Platform</h1>
  <p><strong>From Idea to Execution — Powered by Generative AI & Corrective RAG</strong></p>

  <p>
    <a href="https://github.com/MudssarGill"><img src="https://img.shields.io/badge/Developer-Mudassar_Gill-009688?style=for-the-badge&logo=github&logoColor=white" alt="Developer" /></a>
    <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Google_Gemini-FF9900?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/ChromaDB-Vector_Store-4B0082?style=for-the-badge" alt="ChromaDB" />
  </p>
</div>

---

## 📖 What is BizNova?

**BizNova** is an advanced AI-powered SaaS platform that helps entrepreneurs and business professionals discover, evaluate, and launch profitable business ideas. 

By integrating state-of-the-art **Generative AI (Google Gemini 1.5 Flash)** and **Corrective RAG (CRAG)** via **ChromaDB**, BizNova offers real-time streaming chatbot features, long-term conversation memory, deep market analysis, predictive forecasting, and interactive document Q&A.

---

## ✨ Key Features

| Feature | What It Does |
|---|---|
| **🧠 AI Idea Generation** | Enter your budget, location, and skills → get 6 data-driven business ideas tailored to you. |
| **📈 Market Analysis** | Interactive charts showing demand trends, city-wise market comparison, and competitive landscape. |
| **🔮 Predictive Forecasting** | 12-month revenue predictions with confidence intervals and risk assessment indicators. |
| **📋 Auto Business Plan** | Complete business plan with investment breakdown, marketing strategy, and phased execution roadmap. |
| **💬 Streaming AI Chat (LTM)**| Real-time, typewriter-effect AI chatbot with **Long-Term Memory** (saves and recalls past chat sessions). |
| **📄 Corrective RAG (CRAG)** | Upload business documents (PDFs, TXT) and ask the AI questions grounded in your specific documents. |
| **🏙️ 40+ Pakistan Cities** | Pre-loaded with major Pakistani cities like Lahore, Karachi, and Islamabad, plus custom input support. |
| **🌍 International Support** | 20 major global cities also included (New York, London, Dubai, Singapore, etc.). |
| **🔐 Secure Authentication** | Register, login, and Google OAuth support with JWT-based security. |
| **🌙 Premium Dark UI** | Stunning glassmorphism dark theme with smooth animations, responsive design, and markdown rendering. |

---

## 🚀 One-Command Quick Start

You can start the entire platform (Frontend + Backend) with a single click!

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org)
- **Python** 3.10+ — [Download](https://python.org)
- **Gemini API Key** (Free) — [Get it here](https://aistudio.google.com)

### Clone the Repository

```bash
git clone https://github.com/MudssarGill/biznova-ai-platform.git
cd biznova-ai-platform
```

### Setup the Environment

1. Create a `.env` file in the `backend/` folder:

```env
SECRET_KEY=your_secure_secret_key_here
DATABASE_URL=sqlite:///./biznova.db
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

2. Install dependencies:
```bash
# Backend
cd backend
pip install -r requirements.txt
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### ▶️ Run Everything Together (Windows)

Just double-click the `start.bat` file, or run it in your terminal:

```cmd
start.bat
```

This will automatically launch the **FastAPI backend** on `http://localhost:8000` and the **React frontend** on `http://localhost:5173` in two separate terminal windows.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **React 18 & Vite 5** for lightning-fast HMR and building.
- **Tailwind CSS 3** for a customized, premium glassmorphism dark theme.
- **Recharts** for interactive data visualization.
- **Server-Sent Events (SSE)** for real-time streaming AI responses.

### Backend
- **FastAPI (Python 3.10+)** for high-performance, asynchronous REST APIs.
- **Google Gemini 1.5 Flash** for idea generation, planning, and chat.
- **ChromaDB** as the local vector database for document embeddings (CRAG).
- **SQLAlchemy (SQLite)** for persisting User profiles, Chat Sessions (LTM), and Document metadata.
- **JWT (python-jose)** + **Passlib (Bcrypt)** for strict authentication protocols.

---

## 👨‍💻 Developer & Creator

**Mudassar Gill**

- 🔗 **GitHub:** [@MudssarGill](https://github.com/MudssarGill)
- 💼 **LinkedIn:** [M. Mudassar Hussain](https://linkedin.com/in/m-mudassar-85)
- 📧 **Email:** mudassarjutt65030@gmail.com
- 🌐 **Portfolio:** [mudassar-ai-portfolio.onrender.com](https://mudassar-ai-portfolio.onrender.com)

> *Mudassar is a Full-Stack AI/ML Developer specializing in Generative AI, LangGraph, custom RAG systems, and MLOps deployments.*

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>⭐ If you find this project useful, please give it a Star! ⭐</strong>
  <br/><br/>
  <i>© 2026 BizNova — AI-Powered Business Intelligence Platform</i>
</p>
