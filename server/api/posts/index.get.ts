import RedisSingleton from "~/classes/redis-singletone.class"

import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { RAW_USER_POST_RESPONSE_DATA } from "~/types/api-spec.types";
import { createClerkClient } from "@clerk/clerk-sdk-node"

function parseFirestoreTimeStampFormatToDate(firestoreFormatedDate: {_seconds: number, _nanoseconds: number} | null) {
  if (firestoreFormatedDate) {
    return new Date(
      firestoreFormatedDate._seconds * 1000 + firestoreFormatedDate._nanoseconds / 1000000
    )
  } else {
    return null
  }
}

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
    const recentPostIds = await redis.lrange('recent_posts', 0, 99);
    const recentPostsObjects = []

    for (let postId of recentPostIds) {
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
          continue
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

      // REPLIES DATA
      let repliesCount = 0

      const postCatchedRepliesCountKey = `post:${postId}:replies`
      const existCatchedRepliesList = await redis.exists(postCatchedRepliesCountKey)

      if (existCatchedRepliesList) {
        repliesCount = await redis.llen(postCatchedRepliesCountKey)
      } else {
        const repliesQuerySnapshot = await admin.firestore()
          .collection('users-post')
          .where('parent_post_id', '==', postId)
          .get()

        repliesCount = repliesQuerySnapshot.size

        if (repliesCount) {
          const repliesIdsArray = repliesQuerySnapshot.docs.map((doc) => `${doc.id}`)
          await redis.rpush(postCatchedRepliesCountKey, ...repliesIdsArray)
        }
      }

      const postFormatedForFrontend: RAW_USER_POST_RESPONSE_DATA = {
        id: postObject.id,
        text: postObject.text,
        created_at: postObject.created_at,
        updated_at: postObject.updated_at,
        user_id: postObject.user_id,
        fav_count: favCount,
        replies_count: repliesCount,
        author: {
          username: author.username!,
          avatar: author.imageUrl,
        }
      }

      recentPostsObjects.push(postFormatedForFrontend)
    }

    return recentPostsObjects
  } catch(error) {
    setResponseStatus(event, 500)
    return {
      error
    }
  }
})
