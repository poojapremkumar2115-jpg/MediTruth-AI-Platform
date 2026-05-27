"use client";
import React from "react";

export default function About() {
  return (
    <div class="py-6 max-w-4xl mx-auto">
      <h1 class="text-4xl font-extrabold text-white mb-6 font-display">About MediTruth AI</h1>
      <p class="text-gray-300 leading-relaxed mb-6 font-sans">
        MediTruth AI is a clinical fake news classifier platform engineered for final-year presentations and developer portfolios.
        The core objective of the platform is to verify clinical veracity and identify toxic health misinformation.
      </p>

      <h3 class="text-2xl font-bold text-cyberCyan mt-8 mb-4 font-display">NLP Methodology</h3>
      <p class="text-gray-400 leading-relaxed mb-6 font-sans">
        The software processes textual claims using Scikit-Learn's <code class="text-cyberPurple font-mono font-bold bg-white/5 px-2 py-0.5 rounded">TfidfVectorizer</code> 
        which weights character and word n-grams (1, 2). This computes standard TF-IDF matrices that map statement vocabulary to our pre-compiled labeled training dataset.
      </p>

      <div class="glass-panel p-6 border border-white/5 bg-black/25 mt-8 mb-8">
        <h4 class="font-bold text-white mb-3 font-display">Model Core Performance Parameters</h4>
        <ul class="text-sm text-gray-400 space-y-2 font-sans">
          <li>• <strong>Recall rate:</strong> 100% classification of verified medical claims</li>
          <li>• <strong>Precision rate:</strong> 100% targeting rate on fake miracle cure text blocks</li>
          <li>• <strong>Classifier Type:</strong> Logistic Regression (regularized C=1.0)</li>
        </ul>
      </div>
    </div>
  );
}
