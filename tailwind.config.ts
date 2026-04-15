import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brand — Royal Blue Palette
        brand: {
          blue: "#1E4FD8",
          "blue-light": "#3B6EF0",
          "blue-dark": "#1640B0",
        },
        navy: {
          DEFAULT: "#0A1628",
          light: "#111D33",
          medium: "#152240",
        },
        ice: "#DBEAFE",
        gold: {
          DEFAULT: "#D4A853",
          light: "#E8C87A",
          dark: "#B8903D",
        },
        emerald: "#34D399",
        coral: "#F87171",
        pearl: "#F8FAFC",
        slate: {
          DEFAULT: "#94A3B8",
          dark: "#64748B",
          light: "#CBD5E1",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-in": "slideIn 0.5s ease-out forwards",
        "count-up": "countUp 2s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(180deg, #0A1628 0%, transparent 40%, rgba(10,22,40,0.6) 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(30,79,216,0.08), rgba(212,168,83,0.04))",
        "navy-gradient":
          "linear-gradient(180deg, #0A1628, #111D33)",
      },
      borderRadius: {
        card: "14px",
        btn: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
