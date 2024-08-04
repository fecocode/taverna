import { ClerkClient, createClerkClient } from "@clerk/clerk-sdk-node"
import { RAW_USER_POST_RESPONSE_DATA } from "~/types/api-spec.types.js";
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

    const usersFavsCacheKey = `user:${userId}:favs`
    const existUserFavsCache = await redis.exists(usersFavsCacheKey)

    const userFavPosts: RAW_USER_POST_RESPONSE_DATA[] = []
    
    if (existUserFavsCache) {
      const rawCatchedFavs = await redis.lrange(usersFavsCacheKey, 0, 99)
      const catchedFavsPostsIds = rawCatchedFavs.map((rawCatchedFav) => {
        return rawCatchedFav.split(':')[1]
      })

      for (let catchedFavPostId of catchedFavsPostsIds) {
        const parsedPost = await getPostById(catchedFavPostId, clerk, redis)
        
        if (!parsedPost || parsedPost.deleted) {
          continue
        }

        userFavPosts.push(parsedPost)
      }
    } else {
      const userStoredFavPosts = await admin
        .firestore()
        .collection('fav-user-post-rel')
        .where('user_id', '==', userId)
        .limit(100)
        .get()
      
      for (let storedFavPostOnDatabase of userStoredFavPosts.docs) {
        const postId = storedFavPostOnDatabase.data().post_id

        if (!postId) {
          continue
        }

        const parsedPost = await getPostById(postId, clerk, redis)

        if (!parsedPost || parsedPost.deleted) {
          continue
        }

        userFavPosts.push(parsedPost)
      }
    }

    return userFavPosts

  } catch (error) {
    console.error(error)
    return {
      error: 'unexpected error'
    }
  }
})