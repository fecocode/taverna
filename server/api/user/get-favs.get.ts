import { ClerkClient, createClerkClient } from "@clerk/clerk-sdk-node"
import { RAW_CREATE_USER_POST_REQUEST_BODY, RAW_NEW_FAV_STORED_RESPONSE, RAW_USER_POST_RESPONSE_DATA } from "~/types/api-spec.types.js";
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import RedisSingleton from "~/classes/redis-singletone.class"
import { STORABLE_FAV_USER_POST_RELATIONSHIP } from "~/types/entities.types";
import { Redis } from "ioredis";


function parseFirestoreTimeStampFormatToDate(firestoreFormatedDate: {_seconds: number, _nanoseconds: number} | null) {
  if (firestoreFormatedDate) {
    return new Date(
      firestoreFormatedDate._seconds * 1000 + firestoreFormatedDate._nanoseconds / 1000000
    )
  } else {
    return null
  }
}

async function getParsedPost(postId: string, redis: Redis, clerk: ClerkClient): Promise<RAW_USER_POST_RESPONSE_DATA | null>{
  const rawCatchedPost = await redis.get(`post:${postId}`)
  let postObject = null

  if (!rawCatchedPost) {
    const querySnapshotOfPostSearch = await admin
      .firestore()
      .collection('user-posts')
      .doc(postId)
      .get()

    const storedPostOnDatabase = querySnapshotOfPostSearch.data()

    if (!storedPostOnDatabase || storedPostOnDatabase.deleted) {
      return null
    }

    const parsedFoundedPost = {
      id: storedPostOnDatabase.id,
      text: storedPostOnDatabase.text,
      created_at: parseFirestoreTimeStampFormatToDate(storedPostOnDatabase.created_at),
      updated_at: parseFirestoreTimeStampFormatToDate(storedPostOnDatabase.updated_at),
      deleted_at: parseFirestoreTimeStampFormatToDate(storedPostOnDatabase.deleted_at),
      user_id: storedPostOnDatabase.user_id,
      deleted: storedPostOnDatabase.deleted,
    }

    await redis.set(`post:${postId}`, JSON.stringify(parsedFoundedPost), 'EX', 60*60*24)
    postObject = parsedFoundedPost
  } else {
    postObject = JSON.parse(rawCatchedPost)
  }
  // AUTHOR DATA
  let author = null

  const catchedAuthor = await redis.get(`author:${postObject.user_id}`)

  if (!catchedAuthor) {
    const authorClerkData = await clerk.users.getUser(postObject.user_id)

    author = {
      username: authorClerkData.username!,
      avatar: authorClerkData.imageUrl,
    }

    await redis.set(`author:${postObject.user_id}`, JSON.stringify(author), 'EX', 60*60)
  } else {
    author = JSON.parse(catchedAuthor)
  }
  // FAVS DATA

  let favCount = 0

  const postCachedFavCountKey = `post:${postId}:favs`
  const cachedFavCount = await redis.get(postCachedFavCountKey)

  if (cachedFavCount) {
    favCount = parseInt(cachedFavCount)
  } else {
    const querySnapshot = await admin.firestore().collection('fav-user-post-rel')
    .where('post_id', '==', postId)
    .get()

    favCount = querySnapshot.size
    await redis.set(postCachedFavCountKey, favCount)
  }

  const postFormatedForFrontend: RAW_USER_POST_RESPONSE_DATA = {
    id: postObject.id,
    text: postObject.text,
    created_at: postObject.created_at,
    user_id: postObject.user_id,
    fav_count: favCount,
    author: {
      username: author.username!,
      avatar: author.imageUrl,
    }
  }

  return postFormatedForFrontend
}

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
        const parsedPost = await getParsedPost(catchedFavPostId, redis, clerk)
        
        if (!parsedPost) {
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

        const parsedPost = await getParsedPost(postId, redis, clerk)

        if (!parsedPost) {
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