import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "PingFang SC",
          "Microsoft YaHei",
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: {
        universe: "1700px",
      },
      boxShadow: {
        glow: "0 0 60px rgba(135, 92, 255, 0.25)",
        violet: "0 20px 90px rgba(116, 71, 255, 0.22)",
      },
    },
  },
  plugins: [],
} satisfies Config;
