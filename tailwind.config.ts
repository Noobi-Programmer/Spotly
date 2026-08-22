import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Lush Intelligence Monochromatic Deep Forest Palette
        surface: "#0d1604",
        "surface-dim": "#0d1604",
        "surface-bright": "#323c26",
        "surface-container-lowest": "#081102",
        "surface-container-low": "#151e0a",
        "surface-container": "#19220e",
        "surface-container-high": "#232d18",
        "surface-container-highest": "#2e3822",
        "on-surface": "#dbe7c6",
        "on-surface-variant": "#c2c9bc",
        "inverse-surface": "#dbe7c6",
        "inverse-on-surface": "#2a341d",
        outline: "#8c9387",
        "outline-variant": "#42493f",
        "surface-tint": "#a6d29b",
        "surface-variant": "#2e3822",

        primary: "#a6d29b",
        "on-primary": "#123811",
        "primary-container": "#31572c",
        "on-primary-container": "#a0cc95",
        "inverse-primary": "#41683b",
        "primary-fixed": "#c2efb6",
        "primary-fixed-dim": "#a6d29b",
        "on-primary-fixed": "#002202",
        "on-primary-fixed-variant": "#2a4f25",

        secondary: "#a6d47e",
        "on-secondary": "#1a3700",
        "secondary-container": "#2d520a",
        "on-secondary-container": "#99c571",
        "secondary-fixed": "#c2f198",
        "secondary-fixed-dim": "#a6d47e",
        "on-secondary-fixed": "#0c2000",
        "on-secondary-fixed-variant": "#2b5008",

        // Signal / High Priority Action Color
        tertiary: "#c5cc7b",
        "on-tertiary": "#2f3300",
        "tertiary-container": "#4c520d",
        "on-tertiary-container": "#bec575",
        "tertiary-fixed": "#e2e995",
        "tertiary-fixed-dim": "#c5cc7b",
        "on-tertiary-fixed": "#1b1d00",
        "on-tertiary-fixed-variant": "#454a05",

        error: "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      spacing: {
        unit: "4px",
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
        xxl: "64px",
        "container-max": "1440px",
        "margin-mobile": "16px",
        "margin-desktop": "48px",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        beacon: "beacon 2s ease-out infinite",
      },
      keyframes: {
        beacon: {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
