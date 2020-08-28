module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  theme: {
    fontFamily: {
      'display': ['Courier', 'sans-serif'],
      'body': ['Nunito', 'sans-serif']
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
    backgroundColor: theme => ({
      ...theme('colors'),
      'desk': '#f4f2f0',
      'desk-dark': '#e4e2e0',
      'peach': '#e4baa1',
      'peach-dark': '#cb997c',
      'tealish': '#7bdfd0',
      'tealish-dark': '#eeeeee',
    }),
    extend: {}
  },
  variants: {},
  plugins: []
}
