/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#000000',
        'light-bg': '#FFFFFF',
        'light-card': 'rgba(240, 240, 240, 0.5)',
        'dark-card': 'rgba(25, 25, 25, 0.5)',
        'primary': '#111827',
        'secondary': '#6B7280',
        'primary-dark': '#FFFFFF',
        'secondary-dark': '#A0AEC0',
      },
      backdropBlur: {
        'xl': '20px',
      },
      boxShadow: {
        'glow': '0 0 15px 4px rgba(255, 255, 255, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'wave': 'wave 1s infinite ease-in-out',  // 🎵 Animation for sound bars
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        wave: { // 🎵 Music waveform animation
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1.0)' },
        },
      },
    },
  },
  plugins: [],
};
