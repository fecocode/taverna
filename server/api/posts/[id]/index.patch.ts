import { createClerkClient } from "@clerk/clerk-sdk-node"
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import RedisSingleton from "~/classes/redis-singletone.class"
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { PARTIAL_RAW_USER_POST_UPDATED_DATA } from "~/types/api-spec.types";


export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  
  const requestFormData = await readMultipartFormData(event)

  const postText = requestFormData?.find((f) => f.name === 'text')?.data.toString('utf-8') || ''
  const pictureFile = requestFormData?.find((f) => f.name === 'picture')?.data
  const pictureFileName = requestFormData?.find((f) => f.name === 'picture')?.filename
  const emptyImageField = requestFormData?.find((f) => f.name === 'empty_image_field')?.data

  if (!postText?.length) {
    setResponseStatus(event, 400)
    return { error: 'No text' }
  }

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

    const window = new JSDOM('').window
    const purify = DOMPurify(window)

    let pictureUrl = null

    if (pictureFile && pictureFileName) {
      const pictureExtension = pictureFileName.split('.').pop()

      if (!pictureExtension) return

      if (pictureExtension.toLowerCase() ===  'gif') {
        pictureUrl = await uploadStaticImage(runtimeConfig, pictureFile, `posts/${postId}`, 'gif')
      } else {
        pictureUrl = await uploadStaticImage(runtimeConfig, pictureFile, `posts/${postId}`, 'webp')
      }
    }

    const sanitizedContent = purify.sanitize(postText, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target'],
    });
  
    const updateObject: PARTIAL_RAW_USER_POST_UPDATED_DATA = {
      text: sanitizedContent,
      picture_url: pictureUrl ? pictureUrl : emptyImageField ? '' : undefined,
      updated_at: new Date(),
    }

    await documentReference.update(updateObject)

    await redis.del(`post:${postId}`)

    return updateObject
    
  } catch (error) {
    console.error(error)
    return {
      error: 'unexpected error'
    }
  }
})