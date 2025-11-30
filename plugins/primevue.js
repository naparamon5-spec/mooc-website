// plugins/primevue.js
import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    theme: {
      preset: Lara,
      options: {
        prefix: 'p',
        darkModeSelector: false,
        cssLayer: false
      }
    }
  })
})
