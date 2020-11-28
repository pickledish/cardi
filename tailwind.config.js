module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'display': ['Courier', 'sans-serif'],
      'body': ['Nunito', 'sans-serif']
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      'desk': '#f4f2f0',
      'desk-dark': '#e4e2e0',
      'peach': '#e4baa1',
      'peach-dark': '#cb997c',
      'tealish': '#7bdfd0',
      'tealish-dark': '#eeeeee',
    }),
    extend: {
      padding: {
        '1-5': '0.33rem',
      },
      textColor: {
        'primary': '#444444',
        'secondary': '#444444',
        'light': '#777777',
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
