import { createClerkClient } from "@clerk/clerk-sdk-node"
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import RedisSingleton from "~/classes/redis-singletone.class"
import { setFollowingRelationship } from "~/server/utils/authors.utils";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  if (!admin.apps.length) {  
    initializeApp({
      credential: admin.credential.cert(JSON.parse(runtimeConfig.FIREBASE_ADMIN_KEY)),
      databaseURL: runtimeConfig.FIREBASE_DATABASE_ID,
    })
  }

  const redis = RedisSingleton.getInstance(runtimeConfig)

  const request = toWebRequest(event);

  const clerk = createClerkClient({
    secretKey: runtimeConfig.CLERK_SECRET_KEY!,
    publishableKey: runtimeConfig.public.CLERK_PUBLISHABLE_KEY!,
  })

  const userIdToFollow = getRouterParam(event, 'id')

  if (!userIdToFollow) {
    setResponseStatus(event, 400)

    return {
      error: 'No user to follow'
    }
  }

  try {
    const verifiedSession = await clerk.authenticateRequest(request)

    if (!verifiedSession.isSignedIn) {
      setResponseStatus(event, 401)

      return {
        error: 'Unauthorized'
      }
    }

    const { userId } = verifiedSession.toAuth()

    await setFollowingRelationship(userId, userIdToFollow, redis)
  } catch(error) {
    console.error(error)
    setResponseStatus(event, 500)

    return {
      error: 'Unexpected error'
    }
  }
})
