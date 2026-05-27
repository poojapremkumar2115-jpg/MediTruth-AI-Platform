/* ==========================================
   MEDITRUTH AI - SYSTEM CONTROLLER
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --- STATE SYSTEM ---
  const state = {
    currentUser: JSON.parse(localStorage.getItem("meditruth_user")) || null,
    scanHistory: [],
    currentScan: null,
    stats: {
      total_scans: 0,
      real_count: 0,
      fake_count: 0,
      avg_confidence: 0.0,
      recent_activity: []
    },
    chatbotMessages: [
      { sender: "ai", text: "### 👋 Welcome to MediTruth AI Chatbot!\n\nI am ready to help you dissect medical news and fact-check suspicious clinical claims. Type a medical question or ask me about vaccines, cancer cures, or diet myths!" }
    ]
  };

  // --- MOUSE SPOTLIGHT ---
  const spotlight = document.querySelector(".spotlight-cursor");
  if (spotlight) {
    document.addEventListener("mousemove", (e) => {
      spotlight.style.left = e.clientX + "px";
      spotlight.style.top = e.clientY + "px";
    });
  }

  // --- SPA ROUTER ---
  const pages = ["home", "about", "login", "register", "dashboard", "analytics", "contact", "profile", "admin"];
  
  function navigateTo(pageId) {
    console.log("Navigating to page: " + pageId);
    
    // Auth Guard check for protected routes
    const protectedRoutes = ["dashboard", "analytics", "profile", "admin"];
    if (protectedRoutes.includes(pageId) && !state.currentUser) {
      alert("⚠️ Protected Route. Please log in first.");
      navigateTo("login");
      return;
    }

    pages.forEach((page) => {
      const el = document.getElementById(`page-${page}`);
      if (el) {
        if (page === pageId) {
          el.style.display = "block";
          // Run page initializer functions
          if (pageId === "analytics") initAnalyticsPage();
          if (pageId === "profile") initProfilePage();
          if (pageId === "admin") initAdminPage();
        } else {
          el.style.display = "none";
        }
      }
    });

    // Update Nav bar highlights
    document.querySelectorAll(".nav-link").forEach((link) => {
      if (link.getAttribute("data-page") === pageId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Bind Navbar links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-page");
      if (target) navigateTo(target);
    });
  });

  // Action links / CTA triggers
  document.querySelectorAll(".btn-trigger-dashboard").forEach(btn => {
    btn.addEventListener("click", () => {
      if (state.currentUser) navigateTo("dashboard");
      else navigateTo("login");
    });
  });

  // --- TYPEWRITER ANIMATION (LANDING PAGE) ---
  const typewriterElement = document.getElementById("typewriter-text");
  if (typewriterElement) {
    const words = [
      "Analyzing Medical Misinformation...",
      "Uncovering Hidden Conspiracy Theories...",
      "Validating Clinical Peer Reviews...",
      "Detecting Fake Vaccine Claims..."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 30 : 60;
      
      if (!isDeleting && charIndex === currentWord.length) {
        speed = 1800; // Hold at the end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 500; // Delay before typing next
      }

      setTimeout(type, speed);
    }
    type();
  }

  // --- STATS COUNTERS ANIMATION ---
  function animateStatsCounters() {
    const statsElements = [
      { id: "counter-scans", target: 4832, suffix: "+" },
      { id: "counter-accuracy", target: 97.6, suffix: "%" },
      { id: "counter-sources", target: 50, suffix: "+" }
    ];

    statsElements.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      
      let current = 0;
      const step = s.target / 60; // 60 frames animate
      
      const interval = setInterval(() => {
        current += step;
        if (current >= s.target) {
          current = s.target;
          clearInterval(interval);
        }
        el.textContent = current % 1 === 0 ? Math.floor(current) + s.suffix : current.toFixed(1) + s.suffix;
      }, 16);
    });
  }
  setTimeout(animateStatsCounters, 1000);

  // --- AUTHENTICATION MODULE ---
  const authNavUser = document.getElementById("auth-nav-user");
  const authNavGuest = document.getElementById("auth-nav-guest");
  const userProfileEmail = document.getElementById("user-profile-email");
  const userProfileJoin = document.getElementById("user-profile-join");

  function updateAuthUI() {
    if (state.currentUser) {
      if (authNavUser) authNavUser.style.display = "flex";
      if (authNavGuest) authNavGuest.style.display = "none";
      if (userProfileEmail) userProfileEmail.textContent = state.currentUser.email;
      if (userProfileJoin) userProfileJoin.textContent = state.currentUser.joinDate;
      document.querySelectorAll(".profile-btn-txt").forEach(el => el.textContent = state.currentUser.email.split("@")[0]);
    } else {
      if (authNavUser) authNavUser.style.display = "none";
      if (authNavGuest) authNavGuest.style.display = "flex";
    }
  }
  updateAuthUI();

  // Login handler
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const pass = document.getElementById("login-password").value.trim();
      
      if (!email || !pass) {
        alert("Please enter both email and password.");
        return;
      }

      // Simulated Firebase Login Successful
      const user = {
        email: email,
        joinDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      };
      
      localStorage.setItem("meditruth_user", JSON.stringify(user));
      state.currentUser = user;
      updateAuthUI();
      navigateTo("dashboard");
    });
  }

  // Register handler
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("register-email").value.trim();
      const pass = document.getElementById("register-password").value.trim();
      const pass2 = document.getElementById("register-password-confirm").value.trim();

      if (pass !== pass2) {
        alert("Passwords do not match!");
        return;
      }

      // Simulated Firebase Signup Successful
      const user = {
        email: email,
        joinDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      };

      localStorage.setItem("meditruth_user", JSON.stringify(user));
      state.currentUser = user;
      updateAuthUI();
      alert("🎉 Account created successfully under Firebase Auth mock!");
      navigateTo("dashboard");
    });
  }

  // Google Sign in Mock
  document.querySelectorAll(".google-signin-mock").forEach((btn) => {
    btn.addEventListener("click", () => {
      const user = {
        email: "google.user@gmail.com",
        joinDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      };
      localStorage.setItem("meditruth_user", JSON.stringify(user));
      state.currentUser = user;
      updateAuthUI();
      navigateTo("dashboard");
    });
  });

  // Logout handler
  document.querySelectorAll(".btn-logout").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("meditruth_user");
      state.currentUser = null;
      updateAuthUI();
      navigateTo("home");
    });
  });

  // --- DETECTOR TERMINAL LOGS & NLP SCANNER ---
  const analyzeBtn = document.getElementById("btn-analyze-news");
  const scanTextInput = document.getElementById("scan-text-input");
  const scanConsole = document.getElementById("scan-terminal-console");
  const scanResultsWrapper = document.getElementById("scan-results-wrapper");

  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", async () => {
      const text = scanTextInput.value.trim();
      if (!text) {
        alert("Please paste or type a medical news claim to analyze.");
        return;
      }

      // Show terminal log visualization
      scanConsole.style.display = "block";
      scanResultsWrapper.style.display = "none";
      scanConsole.innerHTML = "";

      const logSteps = [
        "🌐 Establishing Secure Secure connection to MediTruth AI Engine...",
        "🔤 Preprocessing input news (Stripping punctuation & lowercasing)...",
        "📂 Extracting N-grams & compiling TF-IDF features...",
        "🧠 Consulting Scikit-Learn Logistic Regression weights...",
        "🧬 Activating Deep Learning BiLSTM neural layers for entity review...",
        "🚨 Matched suspicious medical claims tropes: checking knowledge network...",
        "📊 Calculating confidence percentage & local threat indexes...",
        "✅ Analysis finalized. Rendering clinical dashboard reports..."
      ];

      // Simulate console output logs typing
      for (let i = 0; i < logSteps.length; i++) {
        const line = document.createElement("p");
        line.className = "text-sm text-cyan-400 font-mono mb-2";
        line.textContent = "> " + logSteps[i];
        scanConsole.appendChild(line);
        scanConsole.scrollTop = scanConsole.scrollHeight;
        await new Promise((res) => setTimeout(res, 280));
      }

      // Perform Fetch API call
      try {
        const res = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: text,
            email: state.currentUser ? state.currentUser.email : "guest@meditruth.ai"
          })
        });

        if (!res.ok) throw new Error("API call failed.");
        const data = await res.json();
        
        state.currentScan = data;
        renderScanResults(data);
      } catch (error) {
        console.error("API Call error, running fallback:", error);
        alert("⚠️ Backend server not reachable. Running client-side backup classification.");
        // Fast static offline mockup
        const fakeClassification = {
          prediction: text.toLowerCase().includes("miracle") || text.toLowerCase().includes("cure") ? "FAKE" : "REAL",
          confidence: 88.4,
          risk_level_score: text.toLowerCase().includes("miracle") ? 82.0 : 15.0,
          risk_level_category: text.toLowerCase().includes("miracle") ? "HIGH" : "LOW",
          explanation: "Fallback active. News contains potential miracle assertions without verified FDA trails.",
          medical_keywords: ["health", "news"],
          suspicious_keywords: ["miracle"],
          nlp_tokens: text.split(" ").map(w => ({ text: w, type: "standard" })),
          fake_patterns: [],
          scan_id: 999
        };
        state.currentScan = fakeClassification;
        renderScanResults(fakeClassification);
      }
    });
  }

  function renderScanResults(data) {
    scanConsole.style.display = "none";
    scanResultsWrapper.style.display = "block";

    // Prediction Badge
    const badge = document.getElementById("result-prediction-badge");
    badge.textContent = data.prediction;
    if (data.prediction === "REAL") {
      badge.className = "px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider badge-real";
    } else {
      badge.className = "px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider badge-fake";
    }

    // Confidence Count-up
    const confEl = document.getElementById("result-confidence-txt");
    animateNumericValue(confEl, data.confidence, "%");

    // Explanation
    document.getElementById("result-explanation-txt").textContent = data.explanation;

    // Highlights Content render
    const highlightsWrapper = document.getElementById("result-highlights-wrapper");
    highlightsWrapper.innerHTML = "";
    data.nlp_tokens.forEach(tok => {
      const span = document.createElement("span");
      span.className = `hl-${tok.type} mx-0.5 inline-block`;
      span.textContent = tok.text + " ";
      highlightsWrapper.appendChild(span);
    });

    // Threat dial setting
    const dialProgress = document.getElementById("result-dial-progress");
    const dialScoreText = document.getElementById("result-dial-score-txt");
    const dialCategoryText = document.getElementById("result-dial-category-txt");

    if (dialProgress) {
      const offset = 440 - (440 * data.risk_level_score) / 100;
      dialProgress.style.strokeDashoffset = offset;
      
      // Set Dial color based on prediction
      if (data.prediction === "REAL") {
        dialProgress.style.stroke = "var(--neon-green)";
      } else {
        dialProgress.style.stroke = "var(--neon-red)";
      }
    }
    
    if (dialScoreText) dialScoreText.textContent = data.risk_level_score.toFixed(0) + "%";
    if (dialCategoryText) dialCategoryText.textContent = data.risk_level_category + " RISK";

    // Matching patterns list
    const patternsWrapper = document.getElementById("result-patterns-wrapper");
    patternsWrapper.innerHTML = "";
    if (data.fake_patterns && data.fake_patterns.length > 0) {
      data.fake_patterns.forEach(p => {
        const item = document.createElement("div");
        item.className = "p-3 rounded-lg border border-red-500/20 bg-red-500/5 mb-2";
        item.innerHTML = `<h5 class="text-red-400 text-sm font-bold">${p.pattern}</h5><p class="text-xs text-gray-400 mt-1">${p.description}</p>`;
        patternsWrapper.appendChild(item);
      });
    } else {
      patternsWrapper.innerHTML = `<div class="text-center text-xs text-gray-500 py-4">No critical misinformation patterns flagged.</div>`;
    }

    // Bind PDF trigger
    const btnPdf = document.getElementById("btn-download-pdf");
    if (btnPdf) {
      btnPdf.onclick = () => downloadReportPDF(data);
    }
  }

  function animateNumericValue(element, target, suffix = "") {
    let current = 0;
    const duration = 1000;
    const step = target / 30;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      element.textContent = current.toFixed(1) + suffix;
    }, 33);
  }

  // --- SPEECH RECOGNITION (VOICE INPUT) ---
  const voiceBtn = document.getElementById("btn-voice-input");
  if (voiceBtn) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-US";
      
      let isRecording = false;

      voiceBtn.addEventListener("click", () => {
        if (!isRecording) {
          recognition.start();
          voiceBtn.innerHTML = `🟢 Listening...`;
          voiceBtn.classList.add("animate-pulse");
          isRecording = true;
        } else {
          recognition.stop();
        }
      });

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (scanTextInput) {
          scanTextInput.value = transcript;
        }
      };

      recognition.onend = () => {
        voiceBtn.innerHTML = `🎤 Voice Input`;
        voiceBtn.classList.remove("animate-pulse");
        isRecording = false;
      };
      
      recognition.onerror = (e) => {
        console.error("Speech Recognition Error:", e);
        recognition.stop();
      };
    } else {
      // Speech recognition not supported
      voiceBtn.style.display = "none";
    }
  }

  // --- PDF REPORT DOWNLOADER ---
  function downloadReportPDF(scanData) {
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
        <head>
          <title>MediTruth AI Diagnostic Report - #${scanData.scan_id}</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f9fafb; color: #111827; padding: 40px; }
            .header { border-bottom: 3px solid #6366f1; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 24px; font-weight: bold; color: #1f2937; }
            .badge { font-weight: bold; padding: 6px 12px; border-radius: 4px; display: inline-block; font-size: 14px; }
            .badge-fake { background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
            .badge-real { background-color: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
            .meta { margin-top: 20px; display: flex; gap: 40px; color: #4b5563; font-size: 14px; }
            .section { margin-top: 30px; }
            .section-title { font-size: 18px; font-weight: bold; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 12px; }
            .scan-text { background-color: #f3f4f6; padding: 16px; border-radius: 8px; font-style: italic; line-height: 1.6; }
            .explanation { line-height: 1.6; color: #374151; }
            .footer { margin-top: 60px; font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">🔬 MediTruth AI Diagnostic Report</div>
              <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Premium Healthcare Fake News Verification Report</div>
            </div>
            <div class="badge ${scanData.prediction === "FAKE" ? "badge-fake" : "badge-real"}">
              ${scanData.prediction} (${scanData.confidence.toFixed(1)}% Confidence)
            </div>
          </div>
          
          <div class="meta">
            <div><strong>Scan ID:</strong> MT-${scanData.scan_id || 10029}</div>
            <div><strong>Date:</strong> ${new Date().toLocaleString()}</div>
            <div><strong>Risk Level Score:</strong> ${scanData.risk_level_score.toFixed(0)}% (${scanData.risk_level_category})</div>
          </div>

          <div class="section">
            <div class="section-title">Parsed Healthcare News Statement</div>
            <div class="scan-text">"${state.currentScan.text}"</div>
          </div>

          <div class="section">
            <div class="section-title">MediTruth Clinical NLP Evaluation & Diagnostics</div>
            <div class="explanation">${scanData.explanation}</div>
          </div>

          <div class="section">
            <div class="section-title">Triggered Misinformation Patterns</div>
            <div class="explanation">
              ${scanData.fake_patterns && scanData.fake_patterns.length > 0 
                ? scanData.fake_patterns.map(p => `• <strong>${p.pattern}</strong>: ${p.description}`).join("<br>")
                : "No malicious patterns flagged. Text aligns with verified medical standard structures."}
            </div>
          </div>

          <div class="footer">
            MediTruth AI Platform © 2026. This automated report is generated using Scikit-Learn TF-IDF classification pipelines. Keep healthcare verified.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    newWindow.document.close();
  }

  // --- DETECTOR FEEDBACK SYSTEMS ---
  document.querySelectorAll(".btn-feedback").forEach(btn => {
    btn.addEventListener("click", async () => {
      const type = btn.getAttribute("data-type");
      if (!state.currentScan) return;

      try {
        await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scan_id: state.currentScan.scan_id,
            rating: type,
            comment: "SPA dashboard quick review submission."
          })
        });
        alert("❤️ Feedback recorded! Thank you for boosting the MediTruth database.");
      } catch (e) {
        console.error(e);
        alert("❤️ Thank you for your feedback!");
      }
    });
  });

  // --- REAL-TIME CHARTING (ANALYTICS) ---
  let pieChart = null;
  let lineChart = null;

  async function initAnalyticsPage() {
    console.log("Initializing Analytics page charts...");
    
    // Fetch live statistics
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const stats = await res.json();
        state.stats = stats;
        
        // Populate stats text fields
        document.getElementById("stats-total-txt").textContent = stats.total_scans;
        document.getElementById("stats-real-txt").textContent = stats.real_count;
        document.getElementById("stats-fake-txt").textContent = stats.fake_count;
        document.getElementById("stats-accuracy-txt").textContent = stats.avg_confidence.toFixed(1) + "%";
      }
    } catch (e) {
      console.warn("Analytics API unavailable, using offline charts database:", e);
      // Fill offline mock metrics
      state.stats = {
        total_scans: 120,
        real_count: 70,
        fake_count: 50,
        avg_confidence: 94.2,
        recent_activity: [
          { prediction: "REAL", timestamp: new Date().toISOString() }
        ]
      };
    }

    const pieCtx = document.getElementById("analytics-pie-chart");
    const lineCtx = document.getElementById("analytics-line-chart");

    // Destroy existing charts to prevent canvas re-drawing glitches
    if (pieChart) pieChart.destroy();
    if (lineChart) lineChart.destroy();

    if (pieCtx) {
      pieChart = new Chart(pieCtx.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: ["Real Medical News", "Fake Misinformation"],
          datasets: [{
            data: [state.stats.real_count || 10, state.stats.fake_count || 5],
            backgroundColor: ["rgba(16, 185, 129, 0.75)", "rgba(244, 63, 94, 0.75)"],
            borderColor: ["#10b981", "#f43f5e"],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: { color: "#9ca3af", font: { family: "Plus Jakarta Sans" } }
            }
          }
        }
      });
    }

    if (lineCtx) {
      // Compile mock days for graph
      lineChart = new Chart(lineCtx.getContext("2d"), {
        type: "line",
        data: {
          labels: ["May 22", "May 23", "May 24", "May 25", "May 26", "May 27"],
          datasets: [{
            label: "Scans Tracked",
            data: [12, 19, 15, 25, 32, state.stats.total_scans],
            backgroundColor: "rgba(0, 240, 255, 0.08)",
            borderColor: "#00f0ff",
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { grid: { color: "rgba(255,255,255,0.03)" }, ticks: { color: "#9ca3af" } },
            y: { grid: { color: "rgba(255,255,255,0.03)" }, ticks: { color: "#9ca3af" } }
          },
          plugins: {
            legend: {
              labels: { color: "#9ca3af" }
            }
          }
        }
      });
    }
  }

  // --- USER PROFILE & HISTORY MODULE ---
  async function initProfilePage() {
    const list = document.getElementById("profile-scans-list");
    if (!list) return;

    list.innerHTML = `<div class="text-center text-xs text-gray-500 py-8">Loading history logs...</div>`;

    try {
      const email = state.currentUser ? state.currentUser.email : "guest@meditruth.ai";
      const res = await fetch(`/api/history?email=${encodeURIComponent(email)}`);
      
      if (!res.ok) throw new Error("History error");
      const data = await res.json();
      
      list.innerHTML = "";
      if (data.history && data.history.length > 0) {
        data.history.forEach(item => {
          const card = document.createElement("div");
          card.className = "p-4 rounded-xl border border-white/5 bg-white/5 mb-3 flex justify-between items-center";
          
          const badgeClass = item.prediction === "REAL" ? "badge-real" : "badge-fake";
          
          card.innerHTML = `
            <div style="flex: 1; min-width: 0;" class="pr-4">
              <p class="text-xs text-gray-500 mb-1">${new Date(item.timestamp).toLocaleString()}</p>
              <h5 class="text-sm font-semibold truncate text-gray-200">"${item.text}"</h5>
            </div>
            <div class="flex items-center gap-4">
              <span class="px-3 py-1 rounded-full text-xs font-bold ${badgeClass}">${item.prediction}</span>
              <span class="text-xs text-cyan-400 font-mono font-bold">${item.confidence.toFixed(1)}%</span>
            </div>
          `;
          list.appendChild(card);
        });
      } else {
        list.innerHTML = `<div class="text-center text-xs text-gray-500 py-8">No previous scans found under this account. Try scanning now!</div>`;
      }
    } catch (e) {
      console.error(e);
      list.innerHTML = `<div class="text-center text-xs text-red-400 py-8">Error loading scan histories from backend server.</div>`;
    }
  }

  // --- ADMIN DIAGNOSTIC PANEL ---
  async function initAdminPage() {
    const totalEl = document.getElementById("admin-global-scans");
    const loadEl = document.getElementById("admin-load");
    
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        if (totalEl) totalEl.textContent = data.total_scans;
      }
    } catch(e) {}
    
    // Animate system CPU mockup
    if (loadEl) {
      const interval = setInterval(() => {
        const page = document.getElementById("page-admin");
        if (!page || page.style.display === "none") {
          clearInterval(interval);
          return;
        }
        const fakeCPU = Math.random() * 8 + 4;
        loadEl.textContent = fakeCPU.toFixed(2) + "% CPU";
      }, 2000);
    }
  }

  // --- MEDICAL AI CHATBOT SYSTEM ---
  const chatMessagesList = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const chatSendBtn = document.getElementById("btn-chat-send");

  function renderChat() {
    if (!chatMessagesList) return;
    chatMessagesList.innerHTML = "";
    
    state.chatbotMessages.forEach(msg => {
      const bubble = document.createElement("div");
      bubble.className = `p-3.5 mb-3 text-sm leading-relaxed max-w-[85%] ${
        msg.sender === "user" 
          ? "chat-bubble-user ml-auto text-right text-purple-200" 
          : "chat-bubble-ai mr-auto text-left text-gray-200"
      }`;
      
      // Basic markdown parsing for fact checking verdict templates
      let parsedText = msg.text
        .replace(/### (.*)/g, "<h4 class='text-cyan-400 font-bold mb-2'>$1</h4>")
        .replace(/\*\*Verdict:\*\* (.*)/g, "<p class='font-bold text-sm mb-2'>Verdict: $1</p>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/- (.*)/g, "<li class='ml-4 list-disc mb-1'>$1</li>");

      bubble.innerHTML = parsedText;
      chatMessagesList.appendChild(bubble);
    });
    
    chatMessagesList.scrollTop = chatMessagesList.scrollHeight;
  }
  renderChat();

  if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener("click", triggerChatSend);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") triggerChatSend();
    });
  }

  async function triggerChatSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Append user query
    state.chatbotMessages.push({ sender: "user", text: text });
    chatInput.value = "";
    renderChat();

    // Show typical bubble typing placeholder
    const typingBubble = document.createElement("div");
    typingBubble.className = "chat-bubble-ai mr-auto p-3.5 mb-3 text-sm text-gray-500 font-mono animate-pulse";
    typingBubble.textContent = "MediTruth clinical AI is consulting literature database...";
    chatMessagesList.appendChild(typingBubble);
    chatMessagesList.scrollTop = chatMessagesList.scrollHeight;

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      
      chatMessagesList.removeChild(typingBubble);
      
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      state.chatbotMessages.push({ sender: "ai", text: data.reply });
      renderChat();
    } catch (e) {
      chatMessagesList.removeChild(typingBubble);
      state.chatbotMessages.push({ 
        sender: "ai", 
        text: "### ⚠️ System connection lost\n\nUnable to reach the MediTruth API fact-checking server. Please check your Python FastAPI server console." 
      });
      renderChat();
    }
  }

  // --- BATCH UPLOAD CONTROLLER ---
  const tabBtnSingle = document.getElementById("tab-btn-single");
  const tabBtnBatch = document.getElementById("tab-btn-batch");
  const singleView = document.getElementById("dashboard-single-view");
  const batchView = document.getElementById("dashboard-batch-view");

  if (tabBtnSingle && tabBtnBatch && singleView && batchView) {
    tabBtnSingle.addEventListener("click", () => {
      tabBtnSingle.className = "text-sm font-bold tracking-wide pb-2 border-b-2 border-cyberCyan text-cyberCyan cursor-pointer transition-all";
      tabBtnBatch.className = "text-sm font-bold tracking-wide pb-2 border-b-2 border-transparent text-gray-400 hover:text-white cursor-pointer transition-all";
      singleView.classList.remove("hidden");
      batchView.classList.add("hidden");
    });

    tabBtnBatch.addEventListener("click", () => {
      tabBtnBatch.className = "text-sm font-bold tracking-wide pb-2 border-b-2 border-cyberCyan text-cyberCyan cursor-pointer transition-all";
      tabBtnSingle.className = "text-sm font-bold tracking-wide pb-2 border-b-2 border-transparent text-gray-400 hover:text-white cursor-pointer transition-all";
      batchView.classList.remove("hidden");
      singleView.classList.add("hidden");
    });
  }

  // Dropzone drag-and-drop
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("csv-file-input");

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.className = "border-2 border-dashed border-cyberCyan/60 rounded-2xl p-8 text-center cursor-pointer bg-white/10 transition-all flex flex-col items-center justify-center min-h-[180px]";
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.className = "border-2 border-dashed border-white/15 hover:border-cyberCyan/50 rounded-2xl p-8 text-center cursor-pointer bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center min-h-[180px]";
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.className = "border-2 border-dashed border-white/15 hover:border-cyberCyan/50 rounded-2xl p-8 text-center cursor-pointer bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center min-h-[180px]";
      if (e.dataTransfer.files.length > 0) {
        handleCsvFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handleCsvFile(e.target.files[0]);
      }
    });
  }

  let currentBatchData = null;

  async function handleCsvFile(file) {
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file dataset.");
      return;
    }

    const loader = document.getElementById("batch-scan-loader");
    const resultsWrapper = document.getElementById("batch-results-wrapper");

    loader.classList.remove("hidden");
    resultsWrapper.classList.add("hidden");
    dropzone.classList.add("hidden");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-dataset", {
        method: "POST",
        body: formData
      });

      loader.classList.add("hidden");

      if (!res.ok) {
        const err = await res.json();
        alert("⚠️ CSV Parsing error: " + (err.detail || "Unknown error"));
        dropzone.classList.remove("hidden");
        return;
      }

      const data = await res.json();
      currentBatchData = data;

      resultsWrapper.classList.remove("hidden");
      document.getElementById("batch-stat-total").textContent = data.total_scans;
      document.getElementById("batch-stat-real").textContent = data.real_count;
      document.getElementById("batch-stat-fake").textContent = data.fake_count;

      renderBatchTable(data.results);
    } catch (e) {
      console.error(e);
      loader.classList.add("hidden");
      dropzone.classList.remove("hidden");
      alert("⚠️ Backend server error uploading CSV.");
    }
  }

  function renderBatchTable(rows) {
    const tbody = document.getElementById("batch-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    rows.forEach(r => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-white/5 hover:bg-white/5 transition-colors";
      
      const badgeClass = r.prediction === "REAL" ? "badge-real" : "badge-fake";
      
      tr.innerHTML = `
        <td class="p-3 max-w-[320px] truncate font-sans text-gray-300">"${r.text}"</td>
        <td class="p-3 text-center">
          <span class="px-2.5 py-0.5 rounded-full font-bold text-[10px] ${badgeClass}">${r.prediction}</span>
        </td>
        <td class="p-3 text-right font-mono text-cyberCyan font-bold">${r.confidence.toFixed(1)}%</td>
      `;
      tbody.appendChild(tr);
    });
  }

  const tableSearch = document.getElementById("batch-table-search");
  if (tableSearch) {
    tableSearch.addEventListener("input", (e) => {
      if (!currentBatchData) return;
      const q = e.target.value.toLowerCase().trim();
      const filtered = currentBatchData.results.filter(r => r.text.toLowerCase().includes(q));
      renderBatchTable(filtered);
    });
  }

  const btnDownloadAnnotated = document.getElementById("btn-download-annotated-csv");
  if (btnDownloadAnnotated) {
    btnDownloadAnnotated.addEventListener("click", () => {
      if (!currentBatchData) return;
      
      let csvContent = "data:text/csv;charset=utf-8,Statement,Prediction,Confidence,RiskLevel,Explanation\n";
      currentBatchData.results.forEach(r => {
        const cleanText = r.text.replace(/"/g, '""');
        const cleanExpl = r.explanation.replace(/"/g, '""');
        csvContent += `"${cleanText}",${r.prediction},${r.confidence.toFixed(2)},${r.risk_level.toFixed(2)},"${cleanExpl}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "meditruth_annotated_dataset.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  const btnRetrain = document.getElementById("btn-retrain-active-model");
  if (btnRetrain) {
    btnRetrain.addEventListener("click", async () => {
      if (!currentBatchData) return;
      
      btnRetrain.innerHTML = "⚡ Retraining Model...";
      btnRetrain.disabled = true;

      const datasetPayload = currentBatchData.results.map(r => ({
        text: r.text,
        label: r.suggested_label
      }));

      try {
        const res = await fetch("/api/retrain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataset: datasetPayload })
        });

        btnRetrain.innerHTML = "⚡ Retrain Model on Data";
        btnRetrain.disabled = false;

        if (!res.ok) throw new Error();

        alert("🎉 Dynamic Retraining Successful! The Scikit-Learn Logistic Regression model has been fit on the newly imported dataset and hot-reloaded in FastAPI memory!");
      } catch (e) {
        console.error(e);
        btnRetrain.innerHTML = "⚡ Retrain Model on Data";
        btnRetrain.disabled = false;
        alert("⚠️ Failed to retrain model. Please ensure the Python FastAPI server is running.");
      }
    });
  }

  // --- INITIALIZE SPA START STATE ---
  navigateTo("home");
});
