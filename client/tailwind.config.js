/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C3CE1',
        secondary: '#F59E0B',
        dark: '#0F0A1A',
        light: '#FFFFFF'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Outfit"', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Cormorant Garamond"', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        outfit: ['"Outfit"', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
