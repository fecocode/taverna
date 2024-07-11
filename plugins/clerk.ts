import { clerkPlugin } from 'vue-clerk'
import { esES } from '@clerk/localizations';
import { dark } from '@clerk/themes';

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  const extendedSpanishLocales = { ...esES }


  if (extendedSpanishLocales.userProfile?.start?.profileSection) {
    extendedSpanishLocales.userProfile.start.profileSection.primaryButton = 'Cambiar foto de perfil'
  }

  nuxtApp.vueApp.use(clerkPlugin, {
    publishableKey: runtimeConfig.public.CLERK_PUBLISHABLE_KEY,
    localization: extendedSpanishLocales,
    appearance: {
      baseTheme: dark,
    }
  });
});
