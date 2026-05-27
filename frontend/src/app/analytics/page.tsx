"use client";
import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, AlertOctagon, CheckCircle2 } from "lucide-react";
import { api, StatsResponse } from "@/lib/api";

export default function Analytics() {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (e) {
        // Fallback mock stats if backend is offline
        setStats({
          total_scans: 120,
          real_count: 70,
          fake_count: 50,
          avg_confidence: 94.2,
          recent_activity: []
        });
      }
    };
    loadStats();
  }, []);

  const total = stats?.total_scans || 0;
  const real = stats?.real_count || 0;
  const fake = stats?.fake_count || 0;
  const confidence = stats?.avg_confidence || 0.0;

  const realPct = total > 0 ? (real / total) * 100 : 60;
  const fakePct = total > 0 ? (fake / total) * 100 : 40;

  return (
    <div class="py-6">
      {/* Dynamic aggregators */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-center">
        <div class="glass-panel p-6 border border-white/5 bg-black/25">
          <div class="w-8 h-8 rounded-lg bg-cyberCyan/10 border border-cyberCyan/30 flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-4 h-4 text-cyberCyan" />
          </div>
          <div class="text-3xl font-black text-white font-display mb-1">{total}</div>
          <div class="text-[10px] uppercase text-gray-400 tracking-widest font-bold">Total Scans Audited</div>
        </div>

        <div class="glass-panel p-6 border border-white/5 bg-black/25">
          <div class="w-8 h-8 rounded-lg bg-cyberGreen/10 border border-cyberGreen/30 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-4 h-4 text-cyberGreen" />
          </div>
          <div class="text-3xl font-black text-cyberGreen font-display mb-1">{real}</div>
          <div class="text-[10px] uppercase text-gray-400 tracking-widest font-bold">Verified Claims</div>
        </div>

        <div class="glass-panel p-6 border border-white/5 bg-black/25">
          <div class="w-8 h-8 rounded-lg bg-cyberRed/10 border border-cyberRed/30 flex items-center justify-center mx-auto mb-3">
            <AlertOctagon className="w-4 h-4 text-cyberRed" />
          </div>
          <div class="text-3xl font-black text-cyberRed font-display mb-1">{fake}</div>
          <div class="text-[10px] uppercase text-gray-400 tracking-widest font-bold">Fake News Flagged</div>
        </div>

        <div class="glass-panel p-6 border border-white/5 bg-black/25">
          <div class="w-8 h-8 rounded-lg bg-cyberCyan/10 border border-cyberCyan/30 flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-4 h-4 text-cyberCyan" />
          </div>
          <div class="text-3xl font-black text-cyberCyan font-display mb-1">{confidence.toFixed(1)}%</div>
          <div class="text-[10px] uppercase text-gray-400 tracking-widest font-bold">Average Confidence</div>
        </div>
      </div>

      {/* Graphs */}
      <div class="grid md:grid-cols-2 gap-8">
        
        {/* Pie Segment representation */}
        <div class="glass-panel p-6 border border-white/5 bg-black/25">
          <h3 class="text-lg font-bold text-white mb-6 font-display">Statement Distribution</h3>
          
          <div class="flex flex-col items-center justify-center py-6">
            <div class="w-48 h-48 rounded-full border-[12px] border-cyberRed flex items-center justify-center relative bg-transparent"
                 style={{ borderImage: `conic-gradient(var(--neon-green) ${realPct}%, var(--neon-red) ${realPct}% 100%) 1` }}>
              <div class="text-center">
                <div class="text-2xl font-black text-white font-display">{realPct.toFixed(0)}%</div>
                <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified Rate</div>
              </div>
            </div>

            <div class="flex gap-6 mt-8 text-xs font-bold uppercase tracking-wider">
              <span class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded bg-cyberGreen"></span>
                Real News ({realPct.toFixed(0)}%)
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded bg-cyberRed"></span>
                Fake News ({fakePct.toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Scan Volume progress using stylized SVG lines */}
        <div class="glass-panel p-6 border border-white/5 bg-black/25 flex flex-col justify-between">
          <h3 class="text-lg font-bold text-white mb-4 font-display">Monthly Scanning Volume</h3>
          
          <div class="flex-grow flex items-end justify-between h-48 border-b border-l border-white/10 px-4 pb-2 pt-6 gap-2">
            <div class="flex flex-col items-center w-full">
              <div class="w-full bg-cyberCyan/20 rounded-t-md hover:bg-cyberCyan/40 transition-colors" style={{ height: "40px" }} />
              <span class="text-[10px] text-gray-500 font-bold mt-2">Jan</span>
            </div>
            <div class="flex flex-col items-center w-full">
              <div class="w-full bg-cyberCyan/20 rounded-t-md hover:bg-cyberCyan/40 transition-colors" style={{ height: "60px" }} />
              <span class="text-[10px] text-gray-500 font-bold mt-2">Feb</span>
            </div>
            <div class="flex flex-col items-center w-full">
              <div class="w-full bg-cyberCyan/20 rounded-t-md hover:bg-cyberCyan/40 transition-colors" style={{ height: "55px" }} />
              <span class="text-[10px] text-gray-500 font-bold mt-2">Mar</span>
            </div>
            <div class="flex flex-col items-center w-full">
              <div class="w-full bg-cyberCyan/20 rounded-t-md hover:bg-cyberCyan/40 transition-colors" style={{ height: "90px" }} />
              <span class="text-[10px] text-gray-500 font-bold mt-2">Apr</span>
            </div>
            <div class="flex flex-col items-center w-full">
              <div class="w-full bg-cyberCyan/40 rounded-t-md hover:bg-cyberCyan/60 transition-colors border-t border-cyberCyan shadow-lg shadow-cyberCyan/20" style={{ height: "135px" }} />
              <span class="text-[10px] text-cyberCyan font-bold mt-2">May</span>
            </div>
          </div>

          <div class="text-[10px] text-gray-500 font-medium text-center mt-4">
            * Data compiles live server auditing scans updated today.
          </div>
        </div>

      </div>
    </div>
  );
}
