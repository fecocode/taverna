import RedisSingleton from "~/classes/redis-singletone.class";

export default defineNuxtPlugin(nuxtApp => {
  const runtimeConfig = useRuntimeConfig()
  const redis = RedisSingleton.getInstance(runtimeConfig)
  nuxtApp.provide('redis', redis);
});