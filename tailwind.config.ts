import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1E4FD8",
          "blue-light": "#4A7BFF",
          "blue-dark": "#173B97",
        },
        navy: {
          DEFAULT: "#060D1B",
          light: "#0A1628",
          medium: "#0F1D35",
        },
        ice: "#D5DFF7",
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E0C673",
          dark: "#A88A3A",
        },
        emerald: "#34D399",
        coral: "#F87171",
        pearl: "#F0F2F5",
        slate: {
          DEFAULT: "#7A8BA7",
          dark: "#4A5B73",
          light: "#A7B4C8",
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
          "linear-gradient(180deg, rgba(6,13,27,0.85) 0%, transparent 44%, rgba(6,13,27,0.92) 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(30,79,216,0.08), rgba(201,168,76,0.05))",
        "navy-gradient":
          "linear-gradient(180deg, #060D1B, #0A1628)",
      },
      borderRadius: {
        card: "2px",
        btn: "0px",
      },
    },
  },
  plugins: [],
};

export default config;
