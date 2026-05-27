"use client";
import React, { useEffect, useState } from "react";
import { User, Bell, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";

export default function Profile() {
  const [user, setUser] = useState<{ email: string; joinDate: string } | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("meditruth_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      loadHistory(parsed.email);
    } else {
      setLoading(false);
    }
  }, []);

  const loadHistory = async (email: string) => {
    try {
      const data = await api.getHistory(email);
      setHistory(data.history || []);
    } catch (e) {
      console.error("Error loading scan logs:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="py-6">
      <div class="grid md:grid-cols-3 gap-8">
        
        {/* Left: Preferences Card */}
        <div class="glass-panel p-6 border border-white/5 bg-black/25 flex flex-col gap-6 h-fit">
          <div class="text-center">
            <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-cyberCyan to-cyberPurple p-1 mx-auto mb-4">
              <div class="w-full h-full bg-obsidian rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <h4 class="text-base font-bold text-white truncate">
              {user?.email || "researcher@meditruth.ai"}
            </h4>
            <p class="text-xs text-gray-500 mt-1">
              Joined {user?.joinDate || "May 27, 2026"}
            </p>
          </div>

          <div class="space-y-4 pt-6 border-t border-white/5 font-sans">
            <h5 class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-cyberCyan" /> Notification Preferences
            </h5>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-300">Weekly Misinformation Alerts</span>
              <input type="checkbox" defaultChecked class="w-4 h-4 rounded accent-cyberCyan bg-black border-white/10" />
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-300">Automatic PDF Generation</span>
              <input type="checkbox" class="w-4 h-4 rounded accent-cyberCyan bg-black border-white/10" />
            </div>
          </div>
        </div>

        {/* Right: History */}
        <div class="md:col-span-2 glass-panel p-6 border border-white/5 bg-black/25">
          <h3 class="text-xl font-bold text-white mb-6 font-display flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyberCyan" /> Historical Audited Scans
          </h3>
          
          {loading ? (
            <div class="text-center text-xs text-gray-500 py-8 font-mono animate-pulse">
              Syncing credentials history matrix...
            </div>
          ) : history.length > 0 ? (
            <div class="space-y-3 max-h-[480px] overflow-y-auto pr-2">
              {history.map((item, idx) => (
                <div key={idx} class="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex justify-between items-center">
                  <div style={{ flex: 1, minWidth: 0 }} class="pr-4">
                    <p class="text-[10px] text-gray-500 font-mono mb-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                    <h5 class="text-sm font-semibold truncate text-gray-200">
                      "{item.text}"
                    </h5>
                  </div>
                  <div class="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.prediction === "REAL" ? "badge-real" : "badge-fake"
                    }`}>
                      {item.prediction}
                    </span>
                    <span class="text-xs text-cyberCyan font-mono font-bold">
                      {item.confidence.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div class="text-center text-xs text-gray-500 py-12">
              No previous scans found under this account. Try scanning now in the dashboard!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
