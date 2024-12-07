import { createClerkClient } from "@clerk/clerk-sdk-node"
import { RAW_CREATE_USER_POST_REQUEST_BODY, RAW_USER_POST_RESPONSE_DATA } from "~/types/api-spec.types.js";
import { STOREABLE_POST } from "~/types/entities.types.js";
import admin, { auth } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import RedisSingleton from "~/classes/redis-singletone.class"
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { uploadStaticImage } from "~/server/utils/statics.utils";
import supportedPostCategoriesConstants from "~/constants/supported-post-categories.constants";
import { createNewNotification } from "~/server/utils/notifications.utils";
import { getAuthorUserIdByPostId } from "~/server/utils/posts.utils";

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

  const requestFormData = await readMultipartFormData(event)

  const postText = requestFormData?.find((f) => f.name === 'text')?.data.toString('utf-8') || ''
  const category = requestFormData?.find((f) => f.name === 'category')?.data.toString('utf-8') || undefined
  const postParentId = requestFormData?.find((f) => f.name === 'parent_post_id')?.data.toString('utf-8') || undefined
  const pictureFile = requestFormData?.find((f) => f.name === 'picture')?.data
  const pictureFileName = requestFormData?.find((f) => f.name === 'picture')?.filename

  if (!postText?.length) {
    setResponseStatus(event, 400)
    return { error: 'No text' }
  }

  const supportedPostCategoriesRoutes = supportedPostCategoriesConstants.map((c) => c.route)

  if (category && !supportedPostCategoriesRoutes.includes(category)) {
    setResponseStatus(event, 400)
    return { error: 'Not supported category' }
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
        avatar: author.imageUrl
      }

      await redis.set(`author:${userId}`, JSON.stringify(authorDataToSaveOnCache), 'EX', 60*60*24*15)
    }

    const firestore = admin.firestore()

    const newPostId = crypto.randomUUID()
    const createdAt = new Date()

    const window = new JSDOM('').window
    const purify = DOMPurify(window)

    const sanitizedContent = purify.sanitize(postText, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target'],
    });

    let pictureUrl = null

    if (pictureFile && pictureFileName) {
      const pictureExtension = pictureFileName.split('.').pop()

      if (!pictureExtension) return

      if (pictureExtension.toLowerCase() ===  'gif') {
        pictureUrl = await uploadStaticImage(runtimeConfig, pictureFile, `posts/${newPostId}`, 'gif')
      } else {
        pictureUrl = await uploadStaticImage(runtimeConfig, pictureFile, `posts/${newPostId}`, 'webp')
      }
    }

    const newPost: STOREABLE_POST = {
      id: newPostId,
      text: sanitizedContent,
      created_at: createdAt,
      category: category || null,
      updated_at: null,
      deleted_at: null,
      user_id: userId,
      deleted: false,
      parent_post_id: postParentId || null,
      picture_url: pictureUrl || null,
    }

    // Save on Database
    await firestore.collection('user-posts').doc(newPostId).set(newPost)

    // Save on cache
    await redis.set(`post:${newPostId}`, JSON.stringify(newPost), 'EX', 60*60*24*7)

    if (newPost.parent_post_id) {
      await redis.lpush(`post:${newPost.parent_post_id}:replies`, newPostId)
    } else {
      await redis.lpush('recent_posts', newPostId)
      await redis.ltrim('recent_posts', 0, 99)

      if (category) {
        await redis.zadd(`category:${category}:posts`, Date.now(), newPostId)
        await redis.zremrangebyrank(`category:${category}:posts`, 0, -101)
      }
    }
    
    // Send notification

    if (newPost.parent_post_id && newPost.parent_post_id !== userId) {
      const parentPostAuthorUserId = await getAuthorUserIdByPostId(newPost.parent_post_id)

      await createNewNotification({
        text: `<strong>${author.username!}</strong> respondió a tu post`,
        image_url: author.avatar,
        link: `/p/${newPostId}`,
        user_id: parentPostAuthorUserId
      })
    }

    const response: RAW_USER_POST_RESPONSE_DATA = {
      id: newPostId,
      text: postText,
      category: category,
      created_at: createdAt,
      user_id: userId,
      fav_count: 0,
      replies_count: 0,
      parent_post_id: newPost.parent_post_id || undefined,
      picture_url: pictureUrl || undefined,
      author: {
        username: author.username!,
        avatar: author.avatar!,
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
