/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de Marca Oficial SETMIO PÁDEL (image_16.png)
        'setmio-dark': '#0B1A2D',       // Azul profundo: Fondo principal, base corporativa, modo oscuro
        'setmio-violet': '#8B5CF6',     // Violeta: Acento corporativo, SaaS, elementos activos, tecnología
        'setmio-lime': '#87F229',       // Verde lima: Acento deportivo, energía, botones de acción principal/CTAs
        'setmio-white': '#FFFFFF',      // Blanco: Textos principales, fondos de tarjetas claras
        'setmio-gray-light': '#E5E7EB', // Gris claro: Superficies secundarias
        'setmio-gray-text': '#64748B',  // Gris azulado: Texto muted/secundario
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'lime-glow': '0 0 25px -3px rgba(135, 242, 41, 0.4), 0 0 10px -2px rgba(135, 242, 41, 0.2)',
        'violet-glow': '0 0 25px -3px rgba(139, 92, 246, 0.4), 0 0 10px -2px rgba(139, 92, 246, 0.2)',
      },
    },
  },
  plugins: [],
};
