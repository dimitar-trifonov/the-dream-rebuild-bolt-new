/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dream-bg': 'hsl(var(--dream-bg) / <alpha-value>)',
        'dream-zone-bg': 'hsl(var(--dream-zone-bg) / <alpha-value>)',
        'dream-primary': 'hsl(var(--dream-primary) / <alpha-value>)',
        'dream-primary-hover': 'hsl(var(--dream-primary-hover) / <alpha-value>)',
        'dream-secondary': 'hsl(var(--dream-secondary) / <alpha-value>)',
        'dream-contrast': 'hsl(var(--dream-contrast) / <alpha-value>)',
        'harmony-high': 'hsl(var(--harmony-high) / <alpha-value>)',
        'harmony-mid': 'hsl(var(--harmony-mid) / <alpha-value>)',
        'harmony-low': 'hsl(var(--harmony-low) / <alpha-value>)',
        'leaf': {
          100: 'hsl(144, 61%, 93%)',
          200: 'hsl(144, 61%, 83%)',
          300: 'hsl(144, 61%, 73%)',
          400: 'hsl(144, 61%, 63%)',
          500: 'hsl(144, 61%, 53%)',
          600: 'hsl(144, 61%, 43%)',
          700: 'hsl(144, 61%, 33%)',
          800: 'hsl(144, 61%, 23%)',
          900: 'hsl(144, 61%, 13%)',
        },
        'soil': {
          100: 'hsl(24, 15%, 95%)',
          200: 'hsl(24, 15%, 85%)',
          300: 'hsl(24, 15%, 75%)',
          400: 'hsl(24, 15%, 65%)',
          500: 'hsl(24, 15%, 55%)',
          600: 'hsl(24, 15%, 45%)',
          700: 'hsl(24, 15%, 35%)',
          800: 'hsl(24, 15%, 25%)',
          900: 'hsl(24, 15%, 15%)',
        },
      },
      fontFamily: {
        'interface': ['Interface', 'sans-serif'],
        'narrative': ['Narrative', 'serif'],
      },
      animation: {
        'sway': 'sway 3s ease-in-out infinite',
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}