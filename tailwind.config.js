/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        textMain: 'var(--text-primary)',
        textMuted: 'var(--text-secondary)',
        accent: 'var(--accent-color)',
        accentHover: 'var(--accent-hover)',
        borderBase: 'var(--border-color)',
      }
    },
  },
  plugins: [],
}
