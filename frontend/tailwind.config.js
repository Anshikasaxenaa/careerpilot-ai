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
          400: "#ffb070",
          500: "#ff9b50", // New primary orange
          600: "#e88035",
        },
        dark: {
          400: "#1e293b",
          500: "#0f172a", // Slate 900
          600: "#020617", // Slate 950
        },
        light: {
          400: "#f8fafc",
          500: "#fffdf8", // Warm white
          600: "#f1f5f9",
        },
        accent: {
          yellow: "#fcd34d",
          purple: "#c084fc",
          pink: "#f472b6",
        }
      },
      boxShadow: {
        soft: "var(--shadow)",
        glow: "0 0 20px rgba(255, 155, 80, 0.4)",
        "glow-cyan": "0 0 20px rgba(34, 211, 238, 0.4)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "blob": "blob 7s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
        }
      }
    },
  },
  plugins: [],
};
