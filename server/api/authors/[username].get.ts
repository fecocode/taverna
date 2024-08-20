import { createClerkClient } from "@clerk/clerk-sdk-node"
import { RAW_AUTHOR_RESPONSE_DATA } from "~/types/api-spec.types.js";
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import RedisSingleton from "~/classes/redis-singletone.class"
import { getPostAuthorData, getLastAuthorPosts, getAuthorUserIdByUsername } from '~/server/utils/posts.utils'

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

  const authorUsername = getRouterParam(event, 'username')

  if (!authorUsername) {
    setResponseStatus(event, 400)

    return {
      error: 'No authorUsername'
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

    const authorId = await getAuthorUserIdByUsername(authorUsername, clerk, redis)
    
    if (!authorId) {
      setResponseStatus(event, 404)
      return {
        error: 'Author not found'
      }
    }

    const storedAuthorData = await getPostAuthorData(authorId, clerk, redis)

    const authorData: RAW_AUTHOR_RESPONSE_DATA = {
      id: authorId,
      username: storedAuthorData.username,
      avatar: storedAuthorData.avatar,
      posts: await getLastAuthorPosts(authorId, clerk, redis)
    }

    return authorData
  } catch(error) {
    console.error(error)
    setResponseStatus(event, 500)

    return {
      error: 'Unexpected error'
    }
  }
})