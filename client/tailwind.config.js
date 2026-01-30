

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {fontFamily: {
        bangla: ['Hind Siliguri', 'system-ui', 'sans-serif'],
      },},
  },
  plugins: [],
}
