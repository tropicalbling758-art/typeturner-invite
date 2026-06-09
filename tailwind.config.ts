import type { Config } from "tailwindcss";

export default {
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
        brand: {
          pink: "#FF4D8D",
          turquoise: "#17D8D1",
          orange: "#FF914D",
          gold: "#D4AF37",
          silver: "#C0C0C0",
        },
        navy: {
          900: "#0A1628",
          800: "#0F1F3D",
          700: "#162A52",
        },
        tropical: {
          cream: "#FFF8F0",
          sand: "#F5F0EB",
          teal: "#0D9488",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair-display)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        dmsans: ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
