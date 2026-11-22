/** @type {import('tailwindcss').Config} */
module.exports = {
  // S02-H2.1: tema claro único; las variantes dark: solo se activan con la clase "dark" (nunca) y no con el modo oscuro del sistema.
  darkMode: "class",
  content: ["./src/**/*.{html,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}