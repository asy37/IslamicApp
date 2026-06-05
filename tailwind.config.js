/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // =========================
        // PRIMARY TURQUOISE PALETTE
        // =========================
        primary: {
          50: "#E0F2F1",
          100: "#B2DFDB", // Primary Light (passive states, bg touches)
          200: "#80CBC4",
          300: "#4DB6AC",
          400: "#39BDB1",
          500: "#26A69A", // Primary (main action, highlights)
          600: "#00897B",
          700: "#00796B", // Primary Dark (headers, strong text highlights)
          800: "#00695C",
          900: "#004D40",
        },

        // =========================
        // SECONDARY NAN & DOĞA
        // =========================
        secondary: {
          DEFAULT: "#4DB6AC", // Soft turquoise green (secondary buttons, icons)
          light: "#DCEFE3",   // Mint white (light theme main background)
        },

        // =========================
        // BACKGROUND COLORS
        // =========================
        background: {
          light: "#DCEFE3",      // Mint white main background
          dark: "#121B17",       // Deep anthracite green dark background
          cardLight: "#FFFFFF",  // Pure white card background
          cardDark: "#1D2923",   // Slightly lighter dark green card background
        },

        // =========================
        // TEXT COLORS
        // =========================
        text: {
          primaryLight: "#1A2E26",   // Deep forest green/black for high contrast light mode
          secondaryLight: "#5F7D73", // Gray green for helper text/dates light mode
          primaryDark: "#E0EAE5",    // Soft white for dark mode text
          secondaryDark: "#8EA39B",  // Gray green for helper text/dates dark mode
          muted: "#A3BAB1",
        },

        // =========================
        // BORDER & DIVIDER
        // =========================
        border: {
          light: "#E5EFEA",
          dark: "#26352E",
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
