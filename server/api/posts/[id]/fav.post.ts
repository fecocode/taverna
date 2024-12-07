import { createClerkClient } from "@clerk/clerk-sdk-node"
import { RAW_CREATE_USER_POST_REQUEST_BODY, RAW_NEW_FAV_STORED_RESPONSE, RAW_USER_POST_RESPONSE_DATA } from "~/types/api-spec.types.js";
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import RedisSingleton from "~/classes/redis-singletone.class"
import { STORABLE_FAV_USER_POST_RELATIONSHIP } from "~/types/entities.types";

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

    if (!postId) {
      return {
        error: 'postId is required'
      }
    }

    const storableFav: STORABLE_FAV_USER_POST_RELATIONSHIP = {
      id: favId,
      user_id: userId,
      post_id: postId!,
      created_at: new Date(),
    }

    const firestore = admin.firestore()
    
    // Check if fav exist
    const existQuerySnapshot = await firestore.collection('fav-user-post-rel')
      .doc(favId)
      .get()

    if (existQuerySnapshot.exists) {
      setResponseStatus(event, 200)

      return {
        message: 'Fav already exist'
      }
    }

    // Save on database 
    await firestore.collection('fav-user-post-rel')
      .doc(favId)
      .set(storableFav)

    // Update users fav cache
    await redis.lpush(`user:${userId}:favs`, favId)

    // Update post favs cache
    const postFavKey = `post:${postId}:favs`
    const existPostFavCount = await redis.exists(postFavKey)
    let postFavsCount = 0
    if (existPostFavCount) {
      postFavsCount = await redis.incr(postFavKey)
    } else {
      const querySnapshot = await firestore.collection('fav-user-post-rel')
        .where('post_id', '==', postId)
        .get()
      
      postFavsCount = querySnapshot.size
      await redis.set(postFavKey, postFavsCount)
    }

    const postAuthorUserId = await getAuthorUserIdByPostId(postId)

    if (postAuthorUserId !== userId) {
      const user = await clerk.users.getUser(userId)
      
      await createNewNotification({
        text: `A <strong>${user.username!}</strong> le gustó tu post`,
        image_url: user.imageUrl,
        link: `/p/${postId}`,
        user_id: postAuthorUserId
      })
    }

    setResponseStatus(event, 201)

    const response: RAW_NEW_FAV_STORED_RESPONSE = {
      id: storableFav.id,
      fav_count: postFavsCount,
      post_id: storableFav.post_id,
      created_at: storableFav.created_at,
    }

    return response

  } catch (error) {
    console.error(error)
    return {
      error: 'unexpected error'
    }
  }
})