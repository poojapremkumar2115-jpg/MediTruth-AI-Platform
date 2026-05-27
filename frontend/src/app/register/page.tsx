"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { mockAuthService } from "@/lib/firebase";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await mockAuthService.login(email);
      alert("🎉 Account created successfully under Firebase Auth mock!");
      router.push("/dashboard");
    } catch (err) {
      alert("Registration failed.");
    }
  };

  return (
    <div class="py-12">
      <div class="max-w-md mx-auto glass-panel p-8 border border-white/5 bg-black/25">
        <h2 class="text-3xl font-bold text-white mb-2 font-display">Create Credentials</h2>
        <p class="text-sm text-gray-400 mb-6">Register a new profile to track clinical audits.</p>
        
        <form onSubmit={handleRegister} class="space-y-4">
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
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              class="w-full bg-obsidian/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyberCyan text-white"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" class="btn-neon-purple w-full justify-center mt-2">
            Create Firebase Account
          </button>
        </form>

        <div class="text-center text-xs text-gray-500 mt-6">
          Already registered?{" "}
          <Link href="/login" class="text-cyberCyan hover:underline">
            Access profile
          </Link>
        </div>
      </div>
    </div>
  );
}
