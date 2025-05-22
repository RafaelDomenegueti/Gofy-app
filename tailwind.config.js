const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./App/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        'border-dark': 'hsl(var(--border-dark))',
        input: 'hsl(var(--input))',
        'input-dark': 'hsl(var(--input-dark))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        'background-dark': 'hsl(var(--background-dark))',
        foreground: 'hsl(var(--foreground))',
        'foreground-dark': 'hsl(var(--foreground-dark))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        'primary-dark': {
          DEFAULT: 'hsl(var(--primary-dark))',
          foreground: 'hsl(var(--primary-dark-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        'secondary-dark': {
          DEFAULT: 'hsl(var(--secondary-dark))',
          foreground: 'hsl(var(--secondary-dark-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        'destructive-dark': {
          DEFAULT: 'hsl(var(--destructive-dark))',
          foreground: 'hsl(var(--destructive-dark-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        'muted-dark': {
          DEFAULT: 'hsl(var(--muted-dark))',
          foreground: 'hsl(var(--muted-dark-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        'accent-dark': {
          DEFAULT: 'hsl(var(--accent-dark))',
          foreground: 'hsl(var(--accent-dark-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        'popover-dark': {
          DEFAULT: 'hsl(var(--popover-dark))',
          foreground: 'hsl(var(--popover-dark-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'card-dark': {
          DEFAULT: 'hsl(var(--card-dark))',
          foreground: 'hsl(var(--card-dark-foreground))',
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
