const production = !process.env.ROLLUP_WATCH;

module.exports = {
  purge: {
    content: [
      "./src/**/*.svelte",
      "./public/**/*.html"
    ],
    css: ["./public/**/*.css"],
    enabled: production // disable purge in dev
  },
  darkMode: "media", // false or 'media' or 'class'
  theme: {
    fontFamily: {
      'display': ['Courier', 'sans-serif'],
      'body': ['Nunito', 'sans-serif']
    },
    extend: {
      colors: {
        grey: {
          100: "#eeeeee",
          300: "#d8d8d8",
          500: "#787878",
          700: "#444444",
          900: "#222222",
        },
        desk: {
          100: "#f4f2f0",
          300: "#e4e2e0",
          500: "#888888",
          700: "#444240",
          900: "#141210",
        },
        sage: {
          100: "",
          300: "#aabeaa",
          500: "",
          700: "#3c503c",
          900: "",
        },
      },
      padding: {
        '1-5': '0.33rem',
      },
      height: {
        '1.5': '0.33rem',
      },
      textColor: {
        'primary': '',
        'secondary': '#444444',
        'light': '',
      },
      minWidth: {
        '0': '0',
        '14rem': '14rem',
      },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
