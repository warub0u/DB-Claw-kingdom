/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dusk-bg': '#0f0f1a',
        'dusk-bg-light': '#1a1a2e',
        'dusk-surface': '#252542',
        'neon-cyan': '#00f5ff',
        'neon-pink': '#ff006e',
        'neon-purple': '#8b5cf6',
        'neon-gold': '#fbbf24',
        'neon-green': '#00ff41',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}