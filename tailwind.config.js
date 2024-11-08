/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      keyframes: {
        blinkingBg: {
          '0%, 100%': { backgroundColor: '#ef4444' },
          '50%': { backgroundColor: '#fee2e2' },
        },
        marquee: {
          '0%': { transform: 'translateX(-200%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      animation: {
        blinkingBg: 'blinkingBg 5s ease-in-out 4 alternate',
        marqueertl: 'marquee 70s linear infinite',
        marquee: 'marquee 70s linear reverse infinite',
      },
    },
  },
  plugins: [],
};
