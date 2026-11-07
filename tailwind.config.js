/** @type {import('tailwindcss').Config} */
// ─────────────────────────────────────────────────────────────
//  BoW WoW Pet Services – Tailwind config
//  Brand colours live here. Change them once and rebuild:
//    npm install   (first time only)
//    npm run build
// ─────────────────────────────────────────────────────────────
module.exports = {
  content: ['./*.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        // Ink – the near-black of the logo and the dark tones in their Facebook banner (#171b24)
        ink: {
          DEFAULT: '#171b24',
          900: '#171b24',
          800: '#232836',
          700: '#343a4a',
          600: '#4a4f5e',
        },
        // Pink – the bright pink in their banner (#eb3474). 500 = brand pink for graphics and
        // large text; 600/700 are darker shades so white or small text stays readable.
        pink: {
          50: '#fdeef4',
          100: '#fbd9e6',
          200: '#f7b3cc',
          300: '#f283ab',
          400: '#ee5b8e',
          500: '#eb3474',
          600: '#d61f63',
          700: '#c8195a',
        },
        // Sand – the warm beige and brown tones from the banner (#cab9a4, #a58c75, #6c523c)
        sand: {
          50: '#fbf8f3',
          100: '#f5eee4',
          200: '#ebdfd0',
          300: '#cab9a4',
          400: '#a58c75',
          500: '#8a7059',
          600: '#6c523c',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(23,27,36,.05), 0 10px 30px -12px rgba(23,27,36,.16)',
        lift: '0 2px 4px rgba(23,27,36,.06), 0 22px 44px -18px rgba(23,27,36,.32)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
