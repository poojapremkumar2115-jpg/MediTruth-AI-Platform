import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#030712",
          card: "rgba(17, 24, 39, 0.7)",
          border: "rgba(255, 255, 255, 0.08)",
        },
        cyberCyan: {
          DEFAULT: "#00f0ff",
          glow: "rgba(0, 240, 255, 0.15)",
        },
        cyberPurple: {
          DEFAULT: "#bd00ff",
          glow: "rgba(189, 0, 255, 0.15)",
        },
        cyberGreen: {
          DEFAULT: "#10b981",
        },
        cyberRed: {
          DEFAULT: "#f43f5e",
        }
      },
      fontFamily: {
        display: ["var(--font-outfit)", "sans-serif"],
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      animation: {
        "float-slow": "float 6s infinite ease-in-out",
        "spin-slow": "spin 20s linear infinite",
        "pulse-glow": "pulseGlow 2s infinite ease-in-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(-10px) scale(1.02)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
