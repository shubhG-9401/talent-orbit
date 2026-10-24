/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
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
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
          muted: "var(--surface-muted)",
          border: "var(--surface-border)",
        },
        brand: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          glow: "#3B82F6",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Inter",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          "SFMono-Regular",
          "Consolas",
          '"Liberation Mono"',
          "Menlo",
          "monospace",
        ],
      },
      borderColor: {
        subtle: "var(--border-subtle)",
        zinc850: "var(--border-strong)",
      },
      boxShadow: {
        'subtle-light': '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 25px -5px rgba(0, 0, 0, 0.03)',
        'elevated-light': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.05)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'glow-primary': '0 0 25px -4px rgba(37, 99, 235, 0.35)',
      }
    },
  },
  plugins: [],
};
