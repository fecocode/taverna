// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  telemetry: false,
  modules: ['@pinia/nuxt', '@nuxt/ui', '@nuxtjs/google-fonts'],

  app: {
    head: {
      title: 'Hackgento | Innovación criolla'
    }
  },

  runtimeConfig: {
    public: {
      CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY!,
      LIVE: process.env.LIVE!,
      SITE_DOMAIN: process.env.SITE_DOMAIN!,
    },
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
    FIREBASE_ADMIN_KEY: process.env.FIREBASE_ADMIN_KEY!,
    FIREBASE_DATABASE_ID: process.env.FIREBASE_DATABASE_ID!,
    REDIS_URL: process.env.REDIS_URL!,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
  },

  css: ['~/assets/styles/main.css'],

  googleFonts: {
    families: {
      Poppins: [400, 500, 600, 700],
    }
  },

  colorMode: {
    preference: 'dark',
  },
  devServer: {
    port: 3030,
  }
})