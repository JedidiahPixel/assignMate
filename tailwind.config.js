/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Matcha green accent palette, used across light & dark mode
        matcha: {
          50: '#f3f7ee',
          100: '#e3edd6',
          200: '#c9deb1',
          300: '#aacd86',
          400: '#8fbb63',
          500: '#74a346', // primary accent
          600: '#5b8336',
          700: '#46652c',
          800: '#3a5226',
          900: '#324522',
          950: '#192510',
        },
        priority: {
          high: '#e0584a',
          medium: '#e2932f',
          low: '#3f7fd1',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(25, 37, 16, 0.06), 0 1px 2px rgba(25, 37, 16, 0.04)',
        soft: '0 4px 16px rgba(25, 37, 16, 0.08)',
        nav: '0 -2px 20px rgba(25, 37, 16, 0.08)',
        fab: '0 8px 20px rgba(116, 163, 70, 0.45)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0, transform: 'translateY(4px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
