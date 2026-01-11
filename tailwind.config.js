/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        lg: '1120px',
        xl: '1120px',
      },
    },
    extend: {
      colors: {
        primary: {
          50: '#eef9ff',
          100: '#e6f4ff',
          200: '#bfebff',
          500: '#083358',
          600: '#06385a',
          700: '#052d4a'
        },
        accent: {
          400: '#38bdf8',
          500: '#60a5fa',
          600: '#2563eb'
        },
        muted: {
          DEFAULT: '#4b6b84'
        }
      },
      borderRadius: {
        lg: '12px',
      },
      boxShadow: {
        smsoft: '0 6px 18px rgba(15,23,42,0.06)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}

