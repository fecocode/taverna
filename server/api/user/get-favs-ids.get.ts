import { ClerkClient, createClerkClient } from "@clerk/clerk-sdk-node"
import {  } from "~/types/api-spec.types.js";
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import RedisSingleton from "~/classes/redis-singletone.class"


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

  try {
    const verifiedSession = await clerk.authenticateRequest(request)

    if (!verifiedSession.isSignedIn) {
      setResponseStatus(event, 401)

      return {
        error: 'Unauthorized'
      }
    }

    const { userId } = verifiedSession.toAuth()

    const cachedUserFavs = await redis.lrange(`user:${userId}:favs`, 0, -1)

    let userFavs: string[] = []

    if (cachedUserFavs) {
      userFavs = [...cachedUserFavs]
    } else {
      const querySnapshot = await admin.firestore().collection('fav-user-post-rel')
        .where('user_id', '==', userId)
        .get()
      
      userFavs = querySnapshot.docs.map((doc) => doc.id)
    }

    return userFavs
  } catch(error) {
    console.error(error)
    setResponseStatus(event, 500)
    return {
      error: 'Unexpected error'
    }
  }
})