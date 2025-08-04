import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-brand': '#A47864',         // Mocha Mousse
        'secondary-accent': '#4caf50',        // Verdant Green
        'third-highlight': '#ffdd44',     // Soft Yellow
        'text-primary': '#1f2937' // Soft Black (note the kebab-case)
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
