/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Aptos', 'Inter', 'Helvetica Neue', 'Segoe UI', 'Arial', 'sans-serif'],
        display: ['Aptos Display', 'Aptos', 'Inter', 'Helvetica Neue', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        glass: '0 24px 80px rgba(10, 4, 1, 0.42)',
        glow: '0 0 48px rgba(191, 135, 74, 0.20)'
      },
      backgroundImage: {
        'fintech-mesh':
          'radial-gradient(ellipse at top left, rgba(191, 135, 74, 0.22), transparent 34%), radial-gradient(ellipse at top right, rgba(109, 65, 38, 0.30), transparent 36%), radial-gradient(ellipse at bottom, rgba(62, 36, 23, 0.42), transparent 42%), linear-gradient(135deg, #120b08 0%, #22140d 46%, #0f0a08 100%)'
      }
    }
  },
  plugins: []
};
