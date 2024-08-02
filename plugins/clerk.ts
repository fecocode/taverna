import { clerkPlugin } from 'vue-clerk'
import { dark } from '@clerk/themes';

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  const isLive = parseInt(runtimeConfig.public.LIVE)

  if(!isLive) {
    return
  }

  nuxtApp.vueApp.use(clerkPlugin, {
    publishableKey: runtimeConfig.public.CLERK_PUBLISHABLE_KEY,
    appearance: {
      baseTheme: dark,
    }
  });
});
