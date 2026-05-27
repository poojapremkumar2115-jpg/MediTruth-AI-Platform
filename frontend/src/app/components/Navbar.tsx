"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    // Sync local user session on mount
    const storedUser = localStorage.getItem("meditruth_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Set up storage update listener
    const handleStorageChange = () => {
      const u = localStorage.getItem("meditruth_user");
      setUser(u ? JSON.parse(u) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    // Interval check for single-page updates
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("meditruth_user");
    setUser(null);
    router.push("/");
  };

  const linkClass = (path: string) =>
    `text-sm font-medium tracking-wide transition-colors hover:text-cyberCyan ${
      pathname === path ? "text-cyberCyan drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" : "text-gray-400"
    }`;

  return (
    <header class="sticky top-0 z-50 w-full px-6 py-4">
      <nav class="max-w-7xl mx-auto glass-panel px-6 py-3 flex justify-between items-center border border-white/5 bg-black/40 backdrop-blur-md rounded-2xl">
        {/* Logo */}
        <Link href="/" class="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
          <span class="p-1.5 rounded-lg bg-gradient-to-tr from-cyberCyan to-cyberPurple flex items-center justify-center shadow-lg shadow-cyberCyan/25">
            <Shield className="w-5 h-5 text-black stroke-[2.5]" />
          </span>
          <span class="font-display">
            Medi<span class="text-gradient font-black">Truth AI</span>
          </span>
        </Link>

        {/* Navigation items */}
        <div class="hidden md:flex items-center gap-8">
          <Link href="/" class={linkClass("/")}>Home</Link>
          <Link href="/about" class={linkClass("/about")}>About</Link>
          <Link href="/contact" class={linkClass("/contact")}>Contact</Link>
          
          {user && (
            <>
              <Link href="/dashboard" class={linkClass("/dashboard")}>Scanner</Link>
              <Link href="/analytics" class={linkClass("/analytics")}>Analytics</Link>
              <Link href="/profile" class={linkClass("/profile")}>Profile</Link>
              <Link href="/admin" class={linkClass("/admin")}>Admin</Link>
            </>
          )}
        </div>

        {/* User state hooks */}
        <div class="flex items-center gap-4">
          {!user ? (
            <div class="flex items-center gap-3">
              <Link href="/login" class="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 text-gray-400 hover:text-white transition-colors">
                Log In
              </Link>
              <Link href="/register" class="btn-neon-cyan !px-4 !py-1.5 !text-xs rounded-lg">
                Sign Up
              </Link>
            </div>
          ) : (
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 px-3 py-1 rounded-full border border-cyberCyan/20 bg-cyberCyan/5">
                <span class="w-2 h-2 rounded-full bg-cyberGreen animate-ping"></span>
                <span class="text-xs font-bold text-gray-300">
                  {user.email.split("@")[0]}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                class="text-xs text-cyberRed hover:text-red-400 font-semibold uppercase tracking-wider pl-2 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
