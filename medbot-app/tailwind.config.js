/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90A4',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#E8D5E8',
          foreground: '#2A5A6B',
        },
        accent: {
          DEFAULT: '#4CAF50',
          foreground: '#ffffff',
        },
        background: '#2A5A6B',
        foreground: '#ffffff',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#2A5A6B',
        },
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#6c757d',
        },
        border: '#e9ecef',
        input: '#ffffff',
        ring: '#4A90A4',
        destructive: {
          DEFAULT: '#dc3545',
          foreground: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} 