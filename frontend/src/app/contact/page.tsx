"use client";
import React, { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("📬 Message sent successfully!");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div class="py-6">
      <div class="max-w-xl mx-auto glass-panel p-8 border border-white/5 bg-black/25">
        <h2 class="text-3xl font-bold text-white mb-2 font-display">Connect with Researchers</h2>
        <p class="text-sm text-gray-400 mb-6">Submit feedback or request dataset collaboration details.</p>
        
        <form onSubmit={handleSubmit} class="space-y-4 font-sans">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              class="w-full bg-obsidian/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyberCyan text-white"
              placeholder="Dr. Sarah Connor"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              class="w-full bg-obsidian/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyberCyan text-white"
              placeholder="sarah@university.edu"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Institution Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              class="w-full bg-obsidian/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyberCyan text-white h-32"
              placeholder="Message details..."
              required
            />
          </div>
          <button type="submit" class="btn-neon-cyan w-full justify-center">
            Send Inquiries
          </button>
        </form>
      </div>
    </div>
  );
}
