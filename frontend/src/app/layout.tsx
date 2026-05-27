import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "MediTruth AI - Futuristic Healthcare Fake News Detection",
  description: "Advanced machine learning and NLP platform to detect medical misinformation, conspiracy theories, and healthcare fake news.",
  keywords: ["fake news detection", "healthcare news", "clinical NLP", "medical misinformation", "BiLSTM", "TF-IDF"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body class="bg-[#030712] text-gray-100 min-h-screen flex flex-col justify-between overflow-x-hidden antialiased">
        <!-- Interactive spotlight cursor target -->
        <div class="spotlight-cursor hidden md:block" id="layout-spotlight"></div>
        
        <!-- Glowing Grid overlays -->
        <div class="fixed inset-0 pointer-events-none opacity-30 mix-blend-overlay bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] z-0"></div>
        <div class="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-cyberCyan-glow to-transparent filter blur-[80px] pointer-events-none z-0"></div>
        <div class="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-cyberPurple-glow to-transparent filter blur-[80px] pointer-events-none z-0"></div>
        
        <div class="relative z-10 flex flex-col min-h-screen justify-between">
          <Navbar />
          <main class="max-w-7xl w-full mx-auto px-6 py-6 flex-grow">
            {children}
          </main>
          <Footer />
        </div>

        <!-- Mouse follow cursor script injection -->
        <script dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('mousemove', function(e) {
            const spot = document.getElementById('layout-spotlight');
            if (spot) {
              spot.style.left = e.clientX + 'px';
              spot.style.top = e.clientY + 'px';
            }
          });
        `}} />
      </body>
    </html>
  );
}
