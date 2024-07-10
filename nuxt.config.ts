// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  telemetry: false,
  modules: ['@pinia/nuxt', '@nuxt/ui', '@nuxtjs/google-fonts'],

  runtimeConfig: {
    public: {
      PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY
    }
  },

  css: ['~/assets/styles/main.css'],

  googleFonts: {
    families: {
      Poppins: [400, 500, 600, 700],
    }
  }
})