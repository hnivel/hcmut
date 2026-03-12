import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        primary: ({ theme }) => theme('colors.blue.500'),
      },
      screens: {
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};

export default config;
