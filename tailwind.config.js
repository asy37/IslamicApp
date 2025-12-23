/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // =========================
        // PRIMARY GREEN PALETTE
        // =========================
        primary: {
          50: "#E9F6F0",
          100: "#CFEBDD",
          200: "#9FD7BC",
          300: "#6FC39A",
          400: "#3FAF79",
          500: "#1F8F5F", // Main brand green
          600: "#18724C",
          700: "#125539",
          800: "#0C3826",
          900: "#061B13",
        },

        // =========================
        // BACKGROUND COLORS
        // =========================
        background: {
          light: "#F8FAF9",
          dark: "#0F1F1A",
          cardLight: "#FFFFFF",
          cardDark: "#162925",
        },

        // =========================
        // TEXT COLORS
        // =========================
        text: {
          primaryLight: "#1C2A26",
          secondaryLight: "#6B7F78",
          primaryDark: "#EAF3F0",
          secondaryDark: "#8FA6A0",
          muted: "#A8BDB6",
        },

        // =========================
        // BORDER & DIVIDER
        // =========================
        border: {
          light: "#E2ECE8",
          dark: "#223833",
        },

        // =========================
        // STATUS COLORS
        // =========================
        success: "#4CAF84",
        warning: "#E6B566",
        error: "#D96C6C",
        info: "#5FA8D3",
      },
    },
  },
  plugins: [],
};
