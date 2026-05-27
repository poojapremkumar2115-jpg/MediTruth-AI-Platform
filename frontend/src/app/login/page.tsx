"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { mockAuthService } from "@/lib/firebase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    // Mock Login trigger
    try {
      await mockAuthService.login(email);
      router.push("/dashboard");
    } catch (err) {
      alert("Login failed.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await mockAuthService.login("google.user@gmail.com");
      router.push("/dashboard");
    } catch (err) {
      alert("Google login failed.");
    }
  };

  return (
    <div class="py-12">
      <div class="max-w-md mx-auto glass-panel p-8 border border-white/5 bg-black/25">
        <h2 class="text-3xl font-bold text-white mb-2 font-display">Welcome Back</h2>
        <p class="text-sm text-gray-400 mb-6">Log in to unlock saved history and custom analytics.</p>
        
        <form onSubmit={handleLogin} class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Mail className="w-3 h-3" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              class="w-full bg-obsidian/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyberCyan text-white"
              placeholder="researcher@meditruth.ai"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              class="w-full bg-obsidian/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyberCyan text-white"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" class="btn-neon-cyan w-full justify-center mt-2">
            Access Dashboard
          </button>
        </form>

        <div class="mt-6 flex flex-col gap-3">
          <div class="text-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            OR LOGIN SECURELY WITH
          </div>
          <button
            onClick={handleGoogleSignIn}
            class="google-signin-mock w-full py-2.5 px-4 rounded-xl border border-white/10 hover:border-cyberCyan/30 bg-white/5 hover:bg-white/10 text-sm font-semibold flex items-center justify-center gap-2 transition-all text-gray-300 hover:text-white"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.64 5.64 0 0 1 8.35 12.96a5.64 5.64 0 0 1 5.64-5.64c2.455 0 4.464 1.555 5.177 3.737l3.868-3A11.9 11.9 0 0 0 13.99 2.4a11.9 11.9 0 0 0-11.64 9.6 11.9 11.9 0 0 0 11.64 9.6c6.127 0 10.455-4.3 10.455-10.4 0-.6-.054-1.2-.163-1.8H12.24z"
              />
            </svg>
            Google Firebase Auth
          </button>
        </div>

        <div class="text-center text-xs text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link href="/register" class="text-cyberCyan hover:underline">
            Register credentials
          </Link>
        </div>
      </div>
    </div>
  );
}
