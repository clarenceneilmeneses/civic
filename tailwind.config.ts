import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F0DA",
        sand: "#F3E3B8",
        marigold: "#F6B93B",
        orange: "#E8762C",
        sky: "#A8D5EE",
        azure: "#4D9FD6",
        royal: "#2B6CB0",
        navy: "#14477D",
        brick: "#C0392B",
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Narrow", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(20,71,125,0.08), 0 4px 16px rgba(20,71,125,0.07)",
        lift: "0 4px 8px rgba(20,71,125,0.10), 0 12px 32px rgba(20,71,125,0.12)",
      },
      typography: {},
    },
  },
  plugins: [],
};
export default config;
