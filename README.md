# Sentinel AI 🛡️

A collaborative fraud detection platform combining ensemble machine learning with a natural language query interface. Built with a team to give merchants an intuitive way to investigate fraud signals without writing SQL.

**[Live Demo](https://your-demo-link.vercel.app)**

> **Collaboration note:** Sentinel AI was built as a collaborative project. My primary contributions were the Next.js frontend and dashboard, the conversational query interface (LangChain + LlamaIndex + pgvector pipeline), and the Supabase integration layer. The XGBoost modeling pipeline and Flask API were built collaboratively with my teammates.

---

## Overview

Sentinel AI gives merchants a two-layer fraud detection system: a machine learning backend that classifies transactions in real time, and a natural language interface that lets non-technical users investigate fraud patterns by asking plain English questions.

Instead of querying a database or reading raw model outputs, a merchant can ask *"Which high-risk transactions came from new accounts in the last 7 days?"* and get a structured, human-readable answer backed by semantic search over transaction embeddings.

---

## Features

### ML Risk Classification
- Three specialized XGBoost models handle multi-class risk classification (low / medium / high)
- Models are trained on transaction features including velocity, behavioral signals, and account history
- Flask API serves real-time predictions with risk scores and feature attribution

### Conversational Query Interface
- Natural language questions are converted to semantic search queries using OpenAI embeddings
- pgvector similarity search retrieves relevant transactions from Supabase
- LangChain orchestrates the retrieval-augmented generation (RAG) pipeline
- LlamaIndex structures the document context fed to the language model

### Merchant Dashboard
- Transaction feed with live risk score overlays
- Filter and drill into flagged transactions by risk tier, date, and merchant category
- Conversational query panel embedded directly in the review workflow

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Conversational AI | LangChain, LlamaIndex, OpenAI API |
| ML Models | XGBoost, Scikit-learn, Python |
| Model Serving | Flask REST API |
| Vector Search | pgvector (PostgreSQL extension via Supabase) |
| Database | PostgreSQL / Supabase |
| Embeddings | OpenAI `text-embedding-ada-002` |
| Deployment | Vercel (frontend), Railway (Flask API) |

---

## Architecture

```
sentinel-ai/
├── app/                        # Next.js dashboard (App Router)
│   ├── (users)/
│   │   ├── dashboard/          # Transaction feed + risk overlays
│   │   ├── transactions/       # Full transaction table
│   │   └── analytics/          # Historical risk trends
│   ├── components/
│   │   ├── users/              # Dashboard components
│   │   └── landing/            # Marketing page components
│   └── api/                    # Next.js route handlers
│       ├── webhook/stripe/     # Stripe webhook → ML inference pipeline
│       ├── transactions/       # Transaction data API
│       └── analytics/          # Analytics aggregation API
│
├── backend/                    # Python ML pipeline (collaborative)
│   ├── app.py                  # Flask prediction API
│   ├── transaction_processing.py  # Feature engineering
│   ├── inference/
│   │   └── predict.py          # Ensemble inference logic
│   ├── model/                  # XGBoost training scripts
│   └── langchain_llama/        # RAG pipeline (LangChain + LlamaIndex)
│
└── utils/
    └── supabase/               # Supabase client helpers
```

---

## Conversational Query Pipeline

The natural language interface uses a RAG architecture to answer merchant questions grounded in actual transaction data.

```
User question
     │
     ▼
OpenAI Embeddings (text-embedding-ada-002)
     │
     ▼
pgvector similarity search → top-k relevant transactions
     │
     ▼
LlamaIndex document structuring
     │
     ▼
LangChain prompt assembly + OpenAI completion
     │
     ▼
Structured answer with cited transactions
```

**Example queries the system handles:**
- *"Show me high-risk transactions from accounts created in the last 30 days"*
- *"Which merchants had the most fraud flags this week?"*
- *"What patterns do the declined transactions from yesterday share?"*

---

## ML Model Details

Three XGBoost models classify transaction risk across different fraud typologies:

| Model | Target | Key Features |
|---|---|---|
| Frequency Model | Rapid successive transactions | tx_count (5min / 10min / 30min / 1h), combined_frequency_risk |
| Amount Model | Anomalous transaction amounts | avg_amount, amount_risk_score |
| Address Model | Suspicious billing address signals | fake_address_score, addr_change_score, combined_address_risk, fake_component_count |

Final risk classification is an ensemble of all three model outputs, with rule-based post-processing to enforce business logic thresholds.

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Supabase project with pgvector enabled
- OpenAI API key

### Installation

```bash
git clone https://github.com/seung0708/sentinalAI.git
cd sentinel-ai
```

**Frontend:**
```bash
npm install
```

**ML API:**
```bash
cd backend
pip install -r requirements.txt
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
OPENAI_API_KEY=
CONNECTION_STRING_HOST=
CONNECTION_STRING_PORT=
CONNECTION_STRING_DB=
CONNECTION_STRING_USER=
CONNECTION_STRING_PASSWORD=
```

### Run Locally

```bash
# Terminal 1 — Flask ML API
cd backend && python app.py

# Terminal 2 — Next.js frontend
npm run dev
```

---

## Contributors

| Contributor | GitHub |
|---|---|
| Seung Kim | [@seung0708](https://github.com/seung0708) |
| Mario Gomez | [@magsz](https://github.com/magsz) |

---

## License

MIT
