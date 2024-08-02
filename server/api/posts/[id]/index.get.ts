import RedisSingleton from "~/classes/redis-singletone.class"

import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { createClerkClient } from "@clerk/clerk-sdk-node"
import { getPostById, populatePostReplies } from "~/server/utils/posts.utils";


export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const redis = RedisSingleton.getInstance(runtimeConfig)

  if (!admin.apps.length) {  
    initializeApp({
      credential: admin.credential.cert(JSON.parse(runtimeConfig.FIREBASE_ADMIN_KEY)),
      databaseURL: runtimeConfig.FIREBASE_DATABASE_ID,
    })
  }

  const clerk = createClerkClient({
    secretKey: runtimeConfig.CLERK_SECRET_KEY!,
    publishableKey: runtimeConfig.public.CLERK_PUBLISHABLE_KEY!,
  })

  try {
    const requestedPostId = getRouterParam(event, 'id')

    if (!requestedPostId) {
      setResponseStatus(event, 400)
      return {
        error: 'bad request'
      }
    }

    const requestedPost = await getPostById(requestedPostId, clerk, redis)

    if (!requestedPost) {
      setResponseStatus(event, 404)
      return {
        error: 'Not found'
      }
    } else if (requestedPost.deleted) {
      return requestedPost
    }

    const postWithReplies = await populatePostReplies(requestedPost, clerk, redis)

    return postWithReplies
  } catch(error) {
    setResponseStatus(event, 500)
    return {
      error
    }
  }
})
