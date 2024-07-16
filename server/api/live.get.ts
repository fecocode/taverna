export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  return {
    live: parseInt(runtimeConfig.public.LIVE)
  }
})
