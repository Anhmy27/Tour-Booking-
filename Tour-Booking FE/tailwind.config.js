/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Đường dẫn tới các file React
  ],
  theme: {
    extend: {
      keyframes: {
        "spin-fast": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "spin-fast": "spin-fast 0.3s linear infinite",
      },
    },
  },
  plugins: [],
};
