"use client";

import { useState } from "react";
import { HapticChart } from "./components/HapticChart";
import { ThemeToggle } from "./components/ThemeToggle";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <main
      className={`min-h-screen flex flex-col px-4 py-8 sm:py-12 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#0a0a0a] text-[#ededed]"
          : "bg-white text-[#171717]"
      }`}
    >
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-5xl font-bold tracking-tight mb-3">
            Haptic Chart
          </h1>
          <p
            className={`text-base sm:text-lg ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Real-time price chart with haptic feedback
          </p>
        </header>

        {/* Chart */}
        <div className="flex-1 flex flex-col justify-center">
          <HapticChart theme={theme} />

          {/* Mobile haptics note */}
          <p
            className={`text-center text-xs sm:text-sm mt-4 ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Haptic feedback works on supported mobile devices
          </p>
        </div>

        {/* Footer with theme toggle */}
        <footer className="mt-8 sm:mt-12 flex justify-center">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </footer>
      </div>
    </main>
  );
}
