# 🚨 Responza AI

**From Human Distress → Instant Life-Saving Response**

Responza AI is a Gemini-powered intelligent system that transforms messy, real-world human input into structured, verified, and immediate life-saving actions.

## 🚀 Features

- **Zero-Interaction Emergency Mode**: A single input triggers a complete chain of decisions.
- **Gemini-Powered Analysis**: Detects severity, intent, and provides localized protocols.
- **Maps Integration**: Recommends nearby emergency services (Hospitals, Fire Stations).
- **Admin Dashboard**: Real-time monitoring of all reported incidents.
- **Glassmorphic UI**: Fast, accessible, and high-contrast design for emergency scenarios.

---

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- Gemini API Key ([Get it here](https://aistudio.google.com/))
- Google Maps API Key
- Firebase Project (Optional, for storage)

### 2. Environment Variables
Create a `.env` file from the example:
```bash
cp .env.example .env
```
Fill in your API keys in the `.env` file.

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Locally
```bash
# Start the server
npm start

# For development (auto-restart)
npm run dev
```
Visit `http://localhost:3000` to report an emergency.
Visit `http://localhost:3000/dashboard.html` for the Admin Dashboard.

---

## 🏗️ Architecture

- **Backend**: Node.js + Express
- **AI**: Google Gemini Pro (Text Analysis & Reasoning)
- **Maps**: Google Places API
- **Storage**: Firebase Firestore (Real-time alerting)
- **Frontend**: Vanilla HTML/CSS/JS (Modern aesthetics)

---

## 📦 Deployment

This project is Docker-ready. To build the image:
```bash
docker build -t responza-ai .
```

---

## ⚖️ Disclaimer
Responza AI provides advisory guidance based on AI reasoning. It is designed to complement, not replace, official emergency services. **Always contact your local emergency number (e.g., 911) during a real crisis.**
