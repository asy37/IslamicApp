/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D5016',
          light: '#4A7C59',
          lighter: '#8B9A46',
        },
        background: {
          DEFAULT: '#F5F5F5',
          dark: '#1A1A1A',
        },
        text: {
          DEFAULT: '#1A1A1A',
          secondary: '#666666',
          light: '#999999',
        },
        success: '#2F855A',
        error: '#C53030',
        warning: '#D69E2E',
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        arabicAlt: ['ScheherazadeNew', 'serif'],
      },
    },
  },
  plugins: [],
}

