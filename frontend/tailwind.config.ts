import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { navy: { 900: "#0B1437", 800: "#111C4A", 700: "#1B2A63" } }, fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] } } },
  plugins: [],
} satisfies Config;
