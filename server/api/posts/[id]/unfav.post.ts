import { createClerkClient } from "@clerk/clerk-sdk-node"
import { RAW_UNFAV_RESPONSE } from "~/types/api-spec.types.js";
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
    const postId = getRouterParam(event, 'id')
    const favId = `${userId}:${postId}`

    const firestore = admin.firestore()

    // Check if fav exist
    const existQuerySnapshot = await firestore.collection('fav-user-post-rel')
      .doc(favId)
      .get()

    if (!existQuerySnapshot.exists) {
      setResponseStatus(event, 400)

      return {
        message: 'Fav does not exist'
      }
    }

    // Remove from database 
    await firestore.collection('fav-user-post-rel')
      .doc(favId)
      .delete()

    // Update users fav cache
    await redis.lrem(`user:${userId}:favs`, 0,favId)

    // Update post favs cache
    const postFavKey = `post:${postId}:favs`
    const existPostFavCount = await redis.exists(postFavKey)
    let postFavsCount = 0
    if (existPostFavCount) {
      postFavsCount = await redis.decr(postFavKey)
    } else {
      const querySnapshot = await firestore.collection('fav-user-post-rel')
        .where('post_id', '==', postId)
        .get()
      
      postFavsCount = querySnapshot.size
      await redis.set(postFavKey, postFavsCount)
    }

    setResponseStatus(event, 201)

    const response: RAW_UNFAV_RESPONSE = {
      id: favId,
      fav_count: postFavsCount,
      post_id: postId!
    }

    return response

  } catch (error) {
    console.error(error)
    return {
      error: 'unexpected error'
    }
  }
})