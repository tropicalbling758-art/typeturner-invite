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
        primary: {
          pink: "#FF4D8D",
          turquoise: "#17D8D1",
          orange: "#FF914D",
        },
        accent: {
          gold: "#D4AF37",
          silver: "#C0C0C0",
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
