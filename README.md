# SentinelAI
SentinelAI is a transaction monitoring tool designed to identify potentially fraudulent activity using machine learning techniques. It provides a basic risk assessment for each transaction and displays results in a clean, responsive dashboard.

## Overview
This project demonstrates an approach to transaction risk scoring based on key indicators such as amount, address history, and frequency. It integrates a lightweight machine learning model with real-time data handling and user authentication.

## Features

- Basic real-time transaction scoring  
- Risk levels based on model thresholds  
- User authentication via Supabase  
- Responsive dashboard interface  
- Transaction data visualization  
- Explanations for risk classification  

## Tech Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts

**Backend**
- Python (Flask)
- XGBoost model for fraud classification
- API for model inference

**Database & Authentication**
- Supabase

## Risk Model

The system uses a classification model that assigns one of three fraud risk levels:
- Low
- Medium
- High

Model decisions are influenced by:
- Transaction amount anomalies
- Address reuse patterns
- Frequency of recent activity

## Architecture

- Frontend built with Next.js and Tailwind  
- Backend Flask API for model predictions  
- Supabase handles authentication and data storage  
- Stripe test mode used for simulating transaction data  


## Getting Started

First, run the development server:

```bash
git clone https://github.com/seung0708/sentinalAI.git

# Frontend
cd frontend
npm install

# Backend
cd backend
pip install -r requirements.txt

# Create .env.local with:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
OPENAI_API_KEY=your_openai_api_key
CONNECTION_STRING=your_connection_string

# Run frontend
npm run dev

# Run backend
python app.py

## 👥 Contributors

- [Seung Kim](https://github.com/seung0708)
- [Mario Gomez](https://github.com/magsz)