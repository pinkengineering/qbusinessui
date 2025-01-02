/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '300px',
      'sm': '640px',
      'md': '800px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {      
      colors: {        
        brown: {
          50: '#FAF6F3',   // Lightest brown, for backgrounds
          100: '#F2EAE5',  // Very light brown
          200: '#E6D5C8',  // Light brown
          300: '#D9BFB0',  // Medium-light brown
          400: '#CCAA98',  // Medium brown
          500: '#BF9580',  // Primary brown
          600: '#A67B66',  // Medium-dark brown
          700: '#8C614D',  // Dark brown
          800: '#734D3A',  // Very dark brown
          900: '#593826',  // Darkest brown
        },
        'blue-gray': {
          50: '#F8FAFC',   // Lightest blue-gray
          100: '#F1F5F9',  // Very light blue-gray
          200: '#E2E8F0',  // Light blue-gray
          300: '#CBD5E1',  // Medium-light blue-gray
          400: '#94A3B8',  // Medium blue-gray
          500: '#64748B',  // Primary blue-gray
          600: '#475569',  // Medium-dark blue-gray
          700: '#334155',  // Dark blue-gray
          800: '#1E293B',  // Very dark blue-gray
          900: '#0F172A',  // Darkest blue-gray
        },
        'pastel-brown':{
          50: '#987070'
        }
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      const newUtilities = {
        '.custom-scrollbar': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'rgba(156, 163, 175, 0.2) transparent',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            'background-color': 'rgba(0, 0, 0, 0.2)',
            'border-radius': '10px',
            border: 'transparent',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background-color': 'rgba(0, 0, 0, 0.3)',
          },
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    }),
    function ({ addUtilities }) {
      addUtilities({
        '.line-clamp-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
      });
    },
    require('@tailwindcss/typography')
  ]
}
