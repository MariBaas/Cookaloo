/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Linne Light Theme
        bg: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface2)",
        line: "var(--line)",
        line2: "var(--line2)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        acc: "var(--acc)",
        "acc-ink": "var(--accInk)",
        "acc-soft": "var(--accSoft)",
        "acc-text": "var(--accText)",
        herb: "var(--herb)",
        "herb-soft": "var(--herbSoft)",
        "herb-text": "var(--herbText)",
        "warn-soft": "var(--warnSoft)",
        "warn-text": "var(--warnText)",
      },
      fontFamily: {
        newsreader: ["Newsreader", "serif"],
        figtree: ["Figtree", "sans-serif"],
        bricolage: ["BricolageGrotesque", "sans-serif"],
      },
      borderRadius: {
        card: "22px",
      },
      aspectRatio: {
        "16/10": "16 / 10",
      },
    },
  },
  plugins: [],
};
