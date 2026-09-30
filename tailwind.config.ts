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
          DEFAULT: "#FBF7F4",
          50: "#FFFFFF",
          100: "#FDFBF9",
          200: "#FBF7F4",
          300: "#F5ECE6",
          400: "#EFE2D9",
        },
        blush: {
          DEFAULT: "#F4D9D6",
          50: "#FCF5F4",
          100: "#F9ECE9",
          200: "#F4D9D6",
          300: "#E9BDB9",
          400: "#DD9E99",
          500: "#CE7F79",
        },
        sage: {
          DEFAULT: "#C9D6C3",
          50: "#F4F7F3",
          100: "#E5ECE3",
          200: "#C9D6C3",
          300: "#AABEA3",
          400: "#8CA583",
        },
        champagne: {
          DEFAULT: "#D9B99B",
          50: "#FAF5F0",
          100: "#F2E8DC",
          200: "#E8D3C0",
          300: "#D9B99B",
          400: "#C89D78",
        },
        plum: {
          DEFAULT: "#3B1F2B",
          50: "#F8F1F4",
          100: "#EEDEE6",
          200: "#DBBDCE",
          300: "#C093AE",
          400: "#8A4D71",
          500: "#602D4C",
          600: "#4D213B",
          700: "#3B1F2B",
          800: "#2B141F",
          900: "#1E0C15",
          950: "#14070E",
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
        'soft-luxury': '0 10px 30px -5px rgba(59, 31, 43, 0.05), 0 2px 8px -2px rgba(59, 31, 43, 0.03)',
        'luxury-hover': '0 20px 40px -10px rgba(59, 31, 43, 0.08), 0 4px 12px -2px rgba(59, 31, 43, 0.04)',
        'blush-glow': '0 0 35px -5px rgba(244, 217, 214, 0.6)',
        'plum-glow': '0 0 35px -5px rgba(59, 31, 43, 0.25)',
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
      animation: {
        float: 'float 6s ease-in-out infinite',
        'mesh-scan': 'meshScan 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
