/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'background-gray': '#191919',
        'selected-blue': '#1e6bde'
      },
    }
  },
  plugins: [],
}

