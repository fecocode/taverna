import { createClerkClient } from "@clerk/clerk-sdk-node"
import { RAW_CREATE_USER_POST_REQUEST_BODY, RAW_USER_POST_RESPONSE_DATA } from "~/types/api-spec.types.js";
import { STOREABLE_POST } from "~/types/entities.types.js";
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import RedisSingleton from "~/classes/redis-singletone.class"
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

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

  const requestBody:RAW_CREATE_USER_POST_REQUEST_BODY = await readBody(event)

  if (!requestBody.text?.length) {
    setResponseStatus(event, 400)
    return { error: 'No text' }
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

    let author = null
    const catchedAuthor = await redis.get(`author:${userId}`)

    if (catchedAuthor){
      author = JSON.parse(catchedAuthor)
    } else {
      author = await clerk.users.getUser(userId)

      const authorDataToSaveOnCache = {
        username: author.username!,
        imageUrl: author.imageUrl
      }

      await redis.set(`author:${userId}`, JSON.stringify(authorDataToSaveOnCache), 'EX', 60*60)
    }

    const firestore = admin.firestore()

    const newPostId = crypto.randomUUID()
    const createdAt = new Date()

    const window = new JSDOM('').window
    const purify = DOMPurify(window)

    const sanitizedContent = purify.sanitize(requestBody.text, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target'],
    });

    const newPost: STOREABLE_POST = {
      id: newPostId,
      text: sanitizedContent,
      created_at: createdAt,
      updated_at: null,
      deleted_at: null,
      user_id: userId,
      deleted: false,
    }

    // Save on Database
    await firestore.collection('user-posts').doc(newPostId).set(newPost)

    // Save on cache
    await redis.set(`post:${newPostId}`, JSON.stringify(newPost), 'EX', 60*60*24) // One day of expiration on cache
    await redis.lpush('recent_posts', newPostId)
    await redis.ltrim('recent_posts', 0, 99)

    const response: RAW_USER_POST_RESPONSE_DATA = {
      id: newPostId,
      text: requestBody.text,
      created_at: createdAt,
      user_id: userId,
      fav_count: 0,
      author: {
        username: author.username!,
        avatar: author.imageUrl,
      }
    }
  
    setResponseStatus(event, 201)

    return response
  } catch(error) {
    console.error(error)
    setResponseStatus(event, 500)
    return {
      error: 'unexpected error'
    }
  }
})
