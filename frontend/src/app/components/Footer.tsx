"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, X, Send } from "lucide-react";
import { api } from "@/lib/api";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "### 👋 Welcome to MediTruth AI Chatbot!\n\nI am ready to help you dissect medical news and fact-check suspicious clinical claims. Ask me questions like:\n1. *'Do mRNA vaccines alter human DNA?'*\n2. *'Can apricot seeds cure cancer?'*\n3. *'Does drinking alkaline water eliminate tumors?'*",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInputText("");
    setIsTyping(true);

    try {
      const data = await api.chat(userMsg);
      setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "### ⚠️ System connection lost\n\nUnable to reach the MediTruth API fact-checking server. Please check your Python FastAPI server status.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const parseMessageText = (text: string) => {
    return text
      .replace(/### (.*)/g, "<h4 class='text-cyberCyan font-bold mb-2'>$1</h4>")
      .replace(/\*\*Verdict:\*\* (.*)/g, "<p class='font-bold text-sm mb-2'>Verdict: $1</p>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/- (.*)/g, "<li class='ml-4 list-disc mb-1'>$1</li>");
  };

  return (
    <footer class="w-full px-6 py-6 border-t border-white/5 bg-black/40 backdrop-blur-md relative z-40">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
        <div>MediTruth AI Platform © 2026. Made with advanced clinical NLP.</div>
        <div class="flex gap-6">
          <Link href="/" class="hover:text-cyberCyan transition-colors">Home</Link>
          <Link href="/about" class="hover:text-cyberCyan transition-colors">Methodology</Link>
          <Link href="/contact" class="hover:text-cyberCyan transition-colors">Support</Link>
        </div>
      </div>

      {/* Floating Chatbot Widget */}
      <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat Drawer Panel */}
        {isOpen && (
          <div class="w-[340px] md:w-[385px] h-[480px] glass-panel border border-cyberPurple/25 bg-black/95 shadow-xl shadow-cyberPurple/10 rounded-2xl flex flex-col mb-4 overflow-hidden animate-float">
            {/* Header */}
            <div class="p-4 bg-gradient-to-r from-cyberPurple to-cyberCyan flex justify-between items-center text-white">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-cyberGreen animate-pulse"></span>
                <span class="font-bold font-display text-sm tracking-wide text-white uppercase">
                  MediTruth AI Assistant
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} class="text-white hover:text-gray-200 transition-colors">
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Messages */}
            <div class="flex-grow p-4 overflow-y-auto space-y-3 chat-messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 text-sm leading-relaxed max-w-[85%] rounded-xl ${
                    msg.sender === "user"
                      ? "bg-gradient-to-tr from-cyberPurple/20 to-cyberPurple/5 border border-cyberPurple/30 ml-auto text-purple-200"
                      : "bg-white/5 border border-white/10 mr-auto text-gray-200"
                  }`}
                  dangerouslySetInnerHTML={{ __html: parseMessageText(msg.text) }}
                />
              ))}

              {isTyping && (
                <div class="bg-white/5 border border-white/10 mr-auto text-gray-500 font-mono text-xs p-3.5 rounded-xl animate-pulse">
                  Consulting clinical literature...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} class="p-3 border-t border-white/5 bg-black/25 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                class="flex-grow bg-obsidian border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyberPurple text-white"
                placeholder="Ask about vaccines, cancer cures..."
              />
              <button type="submit" class="btn-neon-purple !px-3 !py-2 !text-xs rounded-xl flex items-center justify-center">
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        )}

        {/* Trigger FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          class="w-14 h-14 rounded-full bg-gradient-to-tr from-cyberPurple to-cyberCyan flex items-center justify-center shadow-lg shadow-cyberPurple/30 border border-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <MessageSquare className="w-6 h-6 text-black stroke-[2.2]" />
        </button>
      </div>
    </footer>
  );
}
