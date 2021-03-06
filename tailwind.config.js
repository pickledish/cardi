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
      'body': ['Nunito', 'sans-serif'],
      'mono': ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace']
    },
    fontSize: {
      'xs': '.7rem',
      'sm': '.8rem',
      'base': '.9rem',
      'lg': '1rem',
      'xl': '1.25rem',
      '2xl': '1.75rem',
    },
    opacity: {
      '0': '0',
      '15': '.15',
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
          700: "#303234",
          900: "#101214",
        },
        sage: {
          100: "",
          300: "#aabeaa",
          500: "",
          700: "#415f41",
          900: "",
        },
      },
      padding: {
        '0.75': '0.15rem',
        '1.75': '0.425rem',
      },
      margin: {
        '0.75': '0.15rem',
      },
      height: {
        '1.5': '0.33rem',
      },
      maxHeight: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
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
      top: {
        '-9': '-2.25rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
