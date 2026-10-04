import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ivory: {
          DEFAULT: "#F7F6F0",
          50: "#FFFFFF",
          100: "#FBFCF8",
          200: "#F7F6F0",
          300: "#F0F0E8",
          400: "#E6E8DD",
        },
        moss: {
          DEFAULT: "#D4E2D2",
          50: "#F3F6F0",
          100: "#E9EDE4",
          200: "#D4E2D2",
          300: "#B7CAB5",
          400: "#8FA58C",
          500: "#B86A4B",
        },
        sage: {
          DEFAULT: "#D4E2D2",
          50: "#F4F7F3",
          100: "#E5ECE3",
          200: "#D4E2D2",
          300: "#AABEA3",
          400: "#71896C",
        },
        champagne: {
          DEFAULT: "#C7A77A",
          50: "#F7F6F0",
          100: "#F2E8DC",
          200: "#DCDACD",
          300: "#C7A77A",
          400: "#C89D78",
        },
        forest: {
          DEFAULT: "#213A30",
          50: "#F1F4EE",
          100: "#E5EBE2",
          200: "#C7D6C4",
          300: "#91AA94",
          400: "#54715C",
          500: "#365443",
          600: "#294639",
          700: "#213A30",
          800: "#14271F",
          900: "#111B15",
          950: "#0E1711",
        },
        card: {
          DEFAULT: "var(--card-bg)",
          foreground: "var(--foreground)",
          border: "var(--border-color)",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Playfair Display", "serif"],
        serif: ["var(--font-fraunces)", "Playfair Display", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem',  // 24px
        '4xl': '1.75rem', // 28px
      },
      boxShadow: {
        'soft-luxury': '0 10px 30px -5px rgba(33, 58, 48, 0.06), 0 2px 8px -2px rgba(33, 58, 48, 0.03)',
        'luxury-hover': '0 20px 40px -10px rgba(33, 58, 48, 0.1), 0 4px 12px -2px rgba(33, 58, 48, 0.04)',
        'moss-glow': '0 0 35px -5px rgba(212, 226, 210, 0.55)',
        'forest-glow': '0 0 35px -5px rgba(33, 58, 48, 0.25)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        meshScan: {
          '0%': { opacity: '0.3', transform: 'scale(0.98)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
          '100%': { opacity: '0.3', transform: 'scale(0.98)' },
        },
      },
      zIndex: {
        'bg': 'var(--z-background, 0)',
        'content': 'var(--z-content, 10)',
        'nav': 'var(--z-sticky-nav, 50)',
        'modal': 'var(--z-modal, 100)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'mesh-scan': 'meshScan 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
