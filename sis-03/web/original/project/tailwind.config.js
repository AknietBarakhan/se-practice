/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F3F6FB',
          100: '#E3EAF5',
          600: '#2A4170',
          700: '#1E3660',
          800: '#172B4F',
          900: '#0F1F3D',
        },
        green: {
          50: '#EDF8F1',
          100: '#D3EFDE',
          700: '#1A7140',
          800: '#155C34',
        },
        danger: {
          50: '#FDF3F2',
          200: '#F5C6C2',
          700: '#B42318',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 31, 61, 0.06), 0 8px 24px rgba(15, 31, 61, 0.06)',
      },
    },
  },
  plugins: [],
};
