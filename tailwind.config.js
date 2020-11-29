module.exports = {
  purge: {
    // TODO this is needed since otherwise is purges svelte CSS classes
    // but this is not good for prod bundle size!
    enabled: false,
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
          500: "",
          700: "#444240",
          900: "#141210",
        },
        teal: {
          100: "",
          300: "#7bdfd0",
          500: "",
          700: "#4ca497",
          900: "",
        },
        'peach': '#e4baa1',
        'peach-dark': '#cb997c',
      },
      padding: {
        '1-5': '0.33rem',
      },
      textColor: {
        'primary': '',
        'secondary': '#444444',
        'light': '',
        'tiffany': '#70dbc6',
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
