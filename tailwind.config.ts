import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontVariantNumeric: {
        'tabular-nums': 'tabular-nums'
      }
    }
  },
  plugins: []
};

export default config;

