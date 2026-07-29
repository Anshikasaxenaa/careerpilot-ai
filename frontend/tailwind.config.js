module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          400: "#a78bfa",
          500: "#8b5cf6", // Violet primary
          600: "#7c3aed",
        },
        dark: {
          400: "#27272a",
          500: "#09090b", // Deep zinc
          600: "#000000",
        },
        light: {
          400: "#f4f4f5",
          500: "#fafafa", // Clean white
          600: "#ffffff",
        },
        accent: {
          yellow: "#fde047",
          purple: "#c084fc",
          pink: "#f472b6",
          cyan: "#22d3ee",
        }
      },
      boxShadow: {
        soft: "var(--shadow)",
        glow: "0 0 20px rgba(139, 92, 246, 0.4)",
        "glow-cyan": "0 0 20px rgba(34, 211, 238, 0.4)",
        premium: "0 10px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "blob": "blob 7s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "aurora": "aurora 15s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        shimmer: {
          "from": { backgroundPosition: "200% 0" },
          "to": { backgroundPosition: "-200% 0" },
        },
        aurora: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        }
      }
    },
  },
  plugins: [],
};
