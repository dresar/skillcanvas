/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1a1a1a',
        },
        'surface-raised': {
          DEFAULT: '#f5f5f5',
          dark: '#222222',
        },
        border: {
          DEFAULT: '#e5e5e5',
          dark: '#333333',
        },
        'text-primary': {
          DEFAULT: '#0a0a0a',
          dark: '#f5f5f5',
        },
        'text-secondary': {
          DEFAULT: '#555555',
          dark: '#aaaaaa',
        },
        'text-muted': {
          DEFAULT: '#888888',
          dark: '#777777',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
