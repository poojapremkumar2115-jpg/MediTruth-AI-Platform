# MediTruth AI - Futuristic Healthcare Fake News Detection

MediTruth AI is a premium, state-of-the-art AI-powered full-stack web application engineered to identify healthcare misinformation, alternative medicine scams, clickbait claims, and pharmaceutical conspiracy theories. Designed with futuristic dark-mode aesthetics resembling OpenAI and Vercel interfaces, it serves as a highly robust showcase for final-year projects and developer portfolios.

The platform utilizes advanced Natural Language Processing (NLP) and Machine Learning (TF-IDF + Scikit-Learn Logistic Regression) coupled with a fallback Deep Learning (PyTorch BiLSTM) architecture blueprint, SQLite history synchronization, and a custom medical-reasoning fact-checking chatbot agent.

---

## 🌟 Core Features

1. **High-Fidelity UI/UX**:
   - **Glassmorphism Theme**: Translucent panels, dark obsidian backgrounds (`#030712`), and glowing neon cyan and purple ambient overlays.
   - **Neural network canvas particles**: Interactive background nodes that bend towards and connect with your mouse cursor.
   - **Mouse Spotlight**: Light spotlight mask overlay tracking the screen cursor.
   - **Typewriter alerts**: Dynamic headers rotating through clinical scanning steps on the landing screen.
   - **Stats tickers**: Fluid counting tickers measuring database sizes and model precision.

2. **Healthcare News Analyzer**:
   - **Speech Recognition Dictator**: Speak news headlines out loud to automatically transcribe text using the browser's Web Speech API.
   - **Simulated Terminal Diagnostics**: Animates real-time token, vector, and tensor compilation logs inside a dark terminal console before displaying final results.
   - **Risk Assessment Dial**: Custom glowing radial gauge mapping news severity indices (Low, Moderate, High, Critical Risk).
   - **NLP Highlighter Tokens**: Tokenizes news statements and highlights matched *medical entities* in neon cyan and *misinformation patterns* in neon red.
   - **Download PDF Report**: Generates professional, high-resolution diagnostic reports in print layout formats ready for direct PDF saving.

3. **Medical AI Chatbot**:
   - Floating chat bubble assistant capable of answering medical questions, verifying treatments, and debunking alternative vaccine myths using static literature guidelines.

4. **Auditor Dashboards**:
   - **Analytics Screens**: Doughnut charts for real-world vs. fake news scan percentages and Progressive Volume bar-area progression columns.
   - **Profile Center**: Saved personal scan records, join dates, and account alert switches.
   - **Admin Diagnostic Panel**: Visual gauges monitoring sqlite files, system load averages, and active ML model dimensions.

---

## 🚀 Dual-Mode Running Strategy

To make running this application completely painless on systems where Node.js/npm is not yet installed in the path (but Python is available), we provide a **Dual-Mode Execution Strategy**:

### Mode A: Zero-Config Standalone Mode (Runs Instantly via Python!)
The FastAPI backend server mounts the static client directly from `/static` and hosts a fully functional standalone single-page version of the entire premium web application. 

1. **Launch the FastAPI Server**:
   Open a terminal in the project root directory and execute:
   ```bash
   python -m backend.app.main
   ```
2. **Access the Web App**:
   Open your browser and navigate to:
   ```
   http://127.0.0.1:8000
   ```
   *You can immediately sign up, log in, dictation-speak claims, analyze news, check risk dials, chat with the AI helper, print PDFs, and plot charts using just Python!*

---

### Mode B: Full-Stack React & Next.js Build Mode
Once you have Node.js and npm installed on your system, you can compile and deploy the advanced Next.js App Router codebase.

1. **Set Up the Next.js Frontend**:
   Navigate to the `frontend/` directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. **Launch the Next.js Dev Server**:
   Start the local React compile server:
   ```bash
   npm run dev
   ```
3. **Review App Nodes**:
   Open the browser at `http://localhost:3000`. The Next.js client automatically integrates with your active FastAPI backend port at `http://127.0.0.1:8000` via `.env.local` bindings!

---

## 🔬 Machine Learning Backend Pipelines

- **Training Script (`backend/train_model.py`)**:
  Compiles a custom balanced corpus of 150+ authentic medical releases and fabricated clickbait headlines.
  - Preprocesses tokens (stopwords cleaning, lowercase normalization).
  - Trains a Scikit-Learn `TfidfVectorizer` mapping character and word n-grams (1, 2) to capture syntactic semantic contexts.
  - Fits a regularized `LogisticRegression` classifier (hyperparameter C=1.0) and prints precision, recall, and f1-score matrices before serializing files to `backend/models/`.
- **Deep Learning BiLSTM Model**:
  Includes a modular, complete PyTorch bidirectional LSTM recurrent architecture mockup showing embedded vocabulary structures suitable for academic presentations.

---

## 📄 REST API Contracts

### 1. Run News Analysis
- **Route**: `POST /api/predict`
- **Request Body**:
  ```json
  {
    "text": "Apricot seeds cure stage 4 cancer naturally in days, doctors hide this vitamin B17 miracle.",
    "email": "researcher@meditruth.ai"
  }
  ```
- **Response Payload**:
  ```json
  {
    "prediction": "FAKE",
    "confidence": 98.42,
    "explanation": "MediTruth AI has flagged this text with high suspicion (98.4% confidence). The analysis detected critical tropes of: Miracle Cure Fallacy, Conspiracy Rhetoric. Specifically, terms like 'apricot', 'seed', 'cancer' are associated with unverified alternative treatments rather than clinical settings.",
    "risk_level_score": 87.50,
    "risk_level_category": "CRITICAL",
    "medical_keywords": ["cancer"],
    "suspicious_keywords": ["apricot", "seed", "cure", "miracle", "doctors", "hide"],
    "fake_patterns": [
      {
        "pattern": "Miracle Cure Fallacy",
        "description": "Promising 100% cure rates for severe diseases like cancer or diabetes without side effects."
      }
    ],
    "nlp_tokens": [
      { "text": "Apricot", "type": "suspicious" },
      { "text": "seeds", "type": "suspicious" },
      { "text": "cure", "type": "suspicious" },
      { "text": "cancer", "type": "medical" }
    ],
    "scan_id": 1,
    "email": "researcher@meditruth.ai"
  }
  ```

### 2. Fetch Account Scan Logs
- **Route**: `GET /api/history?email=researcher@meditruth.ai`
- **Response**:
  ```json
  {
    "email": "researcher@meditruth.ai",
    "history": [
      {
        "id": 1,
        "user_email": "researcher@meditruth.ai",
        "text": "Apricot seeds cure stage 4 cancer naturally...",
        "prediction": "FAKE",
        "confidence": 98.42,
        "risk_level": 87.5,
        "timestamp": "2026-05-27T11:45:00.00000"
      }
    ]
  }
  ```

---

## 📁 Repository Directory Structure

```
d:\fake-news-detection\PROJECT\
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI server, endpoints, and static file mounting
│   │   ├── auth.py              # Firebase JWT and mock Auth verification
│   │   ├── db.py                # Database connection helper (Firestore / SQLite fallback)
│   │   ├── model.py             # ML prediction pipeline and NLP keywords extractor
│   │   └── chatbot.py           # Medical AI chatbot agent logic
│   ├── models/
│   │   ├── tfidf_vectorizer.joblib
│   │   └── classifier.joblib
│   ├── static/
│   │   ├── css/
│   │   │   └── custom.css       # Premium custom animations, glows, and page templates
│   │   ├── js/
│   │   │   ├── app.js           # Core SPA router, charts, voice input, and chat widgets
│   │   │   └── particles.js     # Responsive canvas-based neural network nodes
│   │   └── index.html           # Master landing page and dashboard frame
│   ├── train_model.py           # Python training script compiling ML parameters
│   └── requirements.txt         # FastAPI, Uvicorn, Scikit-learn dependencies
│
├── frontend/ (Next.js TypeScript App Router Source)
│   ├── package.json             # Dependencylist (Next, Tailwind, Framer Motion, Recharts)
│   ├── tailwind.config.ts       # Themes, keyframe triggers, and layout definitions
│   ├── tsconfig.json
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Standard layouts, global custom cursors, font headers
│   │   │   ├── page.tsx         # Home (Landing Page)
│   │   │   ├── login/           # Animated Sign-In
│   │   │   ├── register/        # Account Sign-Up
│   │   │   ├── dashboard/       # Scanner console, NLP tokens, gauges
│   │   │   ├── analytics/       # Bar-Area monthly scan progressions
│   │   │   ├── profile/         # Histograms of previous scanned logs
│   │   │   ├── admin/           # Model parameters gauges list
│   │   │   ├── about/           # Methodology
│   │   │   ├── contact/         # Collaborative inquiries form
│   │   │   └── components/      # Shared components (Navbar, Footer, Chatbot)
│   │   └── lib/
│   │       ├── firebase.ts      # Firebase Auth SDK client
│   │       └── api.ts           # REST endpoint client mappings
│   └── .env.local               # Target server URLs configuration
│
└── README.md                    # System architecture and setup handbook
```

---

*Keep healthcare verified. Keep information true. Powered by MediTruth AI.*
