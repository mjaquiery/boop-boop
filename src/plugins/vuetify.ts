/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#2185d0',
          secondary: '#FFFFFF',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#FFFFFF',
          secondary: '#2185d0',
        },
      },
    },
  },
})
