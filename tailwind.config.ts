import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#151C29",
        paper: "#F6F4EF",
        navy: "#0F1B2D",
        steel: "#3E5C76",
        brass: "#B08D57",
        brassLight: "#D9BE8F",
      },
      fontFamily: {
        newsreader: ["var(--font-newsreader)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      boxShadow: {
        paper: "0 2px 8px -2px rgba(21, 28, 41, 0.06), 0 1px 4px -1px rgba(21, 28, 41, 0.04)",
        card: "0 4px 14px -3px rgba(15, 27, 45, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
