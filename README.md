# 🌌 SkillGap Analytics

**An AI-Powered Skill-Gap Analytics Platform for HR Intelligence**

SkillGap Analytics is a modern full-stack web application designed to help HR departments map, track, and visualize their organization's skill landscape. It combines semantic search (RAG) capabilities with a 3D clustering visualization of employee skills, allowing strategic workforce planning and targeted upskilling.

![SkillGap Analytics 3D Visualization & RAG Chat](https://github.com/kurama-nue/SkillGap_Analytics/assets/placeholder_image) *(Placeholder for your screenshot)*

---

## 🚀 Key Features

*   **RAG-Powered HR Intelligence Chat:** Ask questions about your workforce using natural language (e.g., *"Which engineers have skill gaps in Kubernetes?"* or *"Who should I prioritize for leadership training?"*). Powered by LangChain, OpenAI embeddings, and pgvector.
*   **3D Skill Constellation Mapping:** A stunning, interactive React Three Fiber visualization that plots employees based on their skill vectors (UMAP coordinates mapping multi-dimensional skills into 3D space).
*   **Department Analytics Dashboard:** At-a-glance metrics on department skill coverage, average proficiency levels, and identified skill gaps.
*   **Dark Glassmorphism Interface:** A highly polished, modern UI built with Tailwind CSS, utilizing glassmorphic cards and dynamic typography.
*   **Secure Backend:** Built on FastAPI with strict Pydantic validation, connected to PostgreSQL.

---

## 🛠️ Technology Stack

**Frontend:**
*   **React 18** (Vite + TypeScript)
*   **Tailwind CSS v4** for styling
*   **Zustand** for state management
*   **React Three Fiber / Three.js** for the 3D employee galaxy
*   **React Router** for client-side navigation

**Backend:**
*   **FastAPI** (Python 3.12+)
*   **SQLAlchemy** & **asyncpg** for database ORM and driver
*   **LangChain** for RAG logic and LLM synthesis
*   **OpenAI API** (`text-embedding-3-small`, `gpt-4o-mini`)

**Database/Infra:**
*   **PostgreSQL 16** with **pgvector** extension
*   Docker Compose for local environment

---

## 💻 Local Development Setup

### Prerequisites
*   Node.js (v18+)
*   Python (3.11+)
*   Docker & Docker Compose (for the database)
*   An OpenAI API Key

### 1. Database Configuration
The application requires a PostgreSQL database with the `vector` extension. A `docker-compose.yml` is provided for easy local setup.

```bash
# Start Postgres via Docker
docker-compose up -d postgres
```

### 2. Backend Setup
Navigate to the `backend` directory, create your environment configuration, and install dependencies.

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it (Windows)
.\venv\Scripts\activate
# Activate it (macOS/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup Environment Variables
cp .env.example .env
# Open .env and add your OPENAI_API_KEY
```

**Start the FastAPI Server:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The API will be running at `http://localhost:8000`. You can view the swagger docs at `http://localhost:8000/docs`.

### 3. Frontend Setup
Navigate to the `frontend` directory and install the Node.js packages.

```bash
cd frontend

# Install packages
npm install

# Start the Vite development server
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

## 🗄️ Initializing the Database Structure
If you want to manually execute the schema and populate dummy data, inside the `database` folder there are SQL scripts:
1.  `001_schema.sql` - Base schema and `vector` extension.
2.  `002_rls_policies.sql` - Row level security rules (useful if migrating to Supabase).
3.  `003_seed_data.sql` - 20 mock employees, 30 skills, and knowledge base documents.

*(Note: The provided Docker setup runs these initialization scripts automatically upon container creation).*

---

## 🔐 Environment Variables (.env)
Your backend `.env` should look like this:

```ini
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8000
ALLOWED_ORIGINS=["http://localhost:5173","http://localhost:3000"]
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/skillgap
OPENAI_API_KEY=sk-your-openai-api-key
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536
LLM_MODEL=gpt-4o-mini
RAG_TOP_K=5
```

---

## ✨ Design Overview
The dashboard utilizes a dual-pane layout. 
*   **The Left Pane:** The "Skill Galaxy". High-performers and specific filtered skill gaps light up within the 3D space, showing proximity clusters.
*   **The Right Pane:** The HR Intelligence Chat. A robust RAG pipeline retrieves unstructured employee assessments and knowledge base documents to answer natural-language queries.

---
*Developed for strategic HR mapping and workforce analytics.*
