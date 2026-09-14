import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14181F",
        paper: "#FFFFFF",
        muted: "#6B7280",
        line: "#E5E7EB",
        accent: "#1F5D4C",
        "accent-soft": "#EAF3F0"
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"]
      },
      maxWidth: {
        content: "72rem"
      }
    }
  },
  plugins: []
};

export default config;
