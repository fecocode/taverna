import { createClerkClient } from "@clerk/clerk-sdk-node"
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import RedisSingleton from "~/classes/redis-singletone.class"


export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const body = await readBody(event)
  

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

    const documentReference = admin.firestore()
      .collection('user-posts')
      .doc(postId!)

    const postStoredOnDatabase = await documentReference.get()

    const postData = postStoredOnDatabase.data()
    if (!postData) {
      setResponseStatus(event, 400)
      return {
        error: 'invalid post id'
      }
    }

    const storedPostUserId = postData.user_id

    if (!storedPostUserId) {
      console.error(`post: ${postId} does not have an user_id data`)
      setResponseStatus(event, 500)
      return {
        error: 'unexpected error'
      }
    }

    if (storedPostUserId !== userId) {
      setResponseStatus(event, 401)

      return {
        error: 'Unauthorized'
      }
    }
    
    await documentReference.update({
      text: body.text,
      updated_at: new Date(),
    })

    await redis.del(`post:${postId}`)

    return { ok: true }
    
  } catch (error) {
    console.error(error)
    return {
      error: 'unexpected error'
    }
  }
})