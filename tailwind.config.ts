import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#05070b",
          900: "#080d14",
          850: "#0b121c",
          800: "#0f1825"
        },
        steel: {
          300: "#c8d4e3",
          500: "#7f8da3",
          700: "#344154"
        },
        electric: {
          400: "#43d5ff",
          500: "#1b9dff",
          600: "#0a67c8"
        }
      },
      boxShadow: {
        glow: "0 0 60px rgba(27,157,255,0.28)",
        "card-glow": "0 24px 80px rgba(0, 0, 0, 0.34)"
      },
      backgroundImage: {
        "radial-blue": "radial-gradient(circle at 50% 0%, rgba(67, 213, 255, 0.22), transparent 32rem)",
        "steel-line": "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02))"
      }
    }
  },
  plugins: []
};

export default config;
