import { Webhook, WebhookRequiredHeaders } from "svix";
import RedisSingleton from "~/classes/redis-singletone.class";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const userUpdateWebhookSecret = runtimeConfig.CLERK_UPDATE_USER_EVENT_SECRET
  
  if (!userUpdateWebhookSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: "Secret is not available",
    });
  }
  
  //@ts-ignore
  const headers = getHeaders(event) as WebhookRequiredHeaders
  const rawBody = await readRawBody(event)

  const redis = RedisSingleton.getInstance(runtimeConfig)

  try {
    const svix = new Webhook(userUpdateWebhookSecret)
        
    const payload = svix.verify(rawBody || '', headers) as { type: string, data: Record<string, any> }

    if (payload?.type === 'user.updated') {
      const userId = payload.data.id

      await redis.del(`author:${userId}`)
    }
  } catch (error) {
    console.error(`update-author (webhook): ${error}`)

    throw createError({
      statusCode: 400,
      statusMessage: "Signature error",
    });
  }
})
