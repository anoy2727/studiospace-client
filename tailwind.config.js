/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["\"Bricolage Grotesque\"", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["\"Instrument Sans\"", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    logs: false,
    themes: [
      {
        studiolight: {
          primary: "#2f3bff",
          "primary-content": "#ffffff",
          secondary: "#e8a317",
          "secondary-content": "#1a1300",
          accent: "#d6336c",
          neutral: "#15181d",
          "neutral-content": "#f2f3f5",
          "base-100": "#ffffff",
          "base-200": "#f1f2f4",
          "base-300": "#dfe2e6",
          "base-content": "#15181d",
          info: "#2f6bff", success: "#13a56b", warning: "#e8a317", error: "#d92d3a",
          "--rounded-box": "0.75rem", "--rounded-btn": "0.5rem", "--rounded-badge": "0.4rem",
        },
      },
      {
        studiodark: {
          primary: "#7b86ff",
          "primary-content": "#0b0d22",
          secondary: "#f0b429",
          "secondary-content": "#1a1300",
          accent: "#ff6b9b",
          neutral: "#0b0c0f",
          "neutral-content": "#e6e8ec",
          "base-100": "#14161b",
          "base-200": "#0f1115",
          "base-300": "#242830",
          "base-content": "#e6e8ec",
          info: "#6ea0ff", success: "#2ccf94", warning: "#f0b429", error: "#ff6b72",
          "--rounded-box": "0.75rem", "--rounded-btn": "0.5rem", "--rounded-badge": "0.4rem",
        },
      },
    ],
  },
};
