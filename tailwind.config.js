// tailwind.config.js
export default {
  content: ["./views/**/*.html", "./public/src/**/*.css", "./routes/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        patrick: ['"Patrick Hand SC"', "cursive"],
      },
    },
  },
  plugins: [],
};
