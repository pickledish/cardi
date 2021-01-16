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
    fontSize: {
      'xs': '.67rem',
      'sm': '.8rem',
      'base': '.9rem',
      'lg': '1rem',
      'xl': '1.25rem',
      '2xl': '1.75rem',
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
          100: "#f4f1ee",
          300: "#e4e2e0",
          500: "#888888",
          700: "#424140",
          900: "#141210",
        },
        sage: {
          100: "",
          300: "#aabeaa",
          500: "",
          700: "#415f41",
          900: "",
        },
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
      borderWidth: {
        '0.5rem': '0.5rem',
      },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
