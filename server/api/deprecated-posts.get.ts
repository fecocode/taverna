import RedisSingleton from "~/classes/redis-singletone.class"
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import moment from "moment";
import Redis from "ioredis";
import { ClerkClient, createClerkClient } from "@clerk/clerk-sdk-node";
import { RAW_USER_POST_RESPONSE_DATA } from "~/types/api-spec.types";

const MAIN_FEED_CACHE_UPDATE_DATE_KEY = 'last-main-feed-cache-update'
const MAIN_FEED_CACHE_OBJECTS_KEY = 'main-feed-cache'
const REFRESH_RATE_IN_SECONDS = 30

const USERS_POSTS_COLLECTION_NAME = 'user-posts'
const CACHE_OBJECTS_LIMIT = 10

async function getLastPostsAndRefreshCache(redis: Redis, clerk: ClerkClient, firestore: admin.firestore.Firestore, lastUpdate?: Date) {
  const searchStartDate = false || moment().add(-7, 'day').startOf('day').toDate()

  const foundedPostsOnDatabase = await firestore
    .collection(USERS_POSTS_COLLECTION_NAME)
    .orderBy('created_at', 'desc')
    .where('created_at', '>=', searchStartDate)
    .where('deleted', '!=', true)
    .limit(CACHE_OBJECTS_LIMIT)
    .get()

  const parsedPostsOnDatabase: RAW_USER_POST_RESPONSE_DATA[] = []
  const rawCachedPosts = await redis.get(MAIN_FEED_CACHE_OBJECTS_KEY)
  let cachedPosts: RAW_USER_POST_RESPONSE_DATA[] = []

  if (rawCachedPosts) {
    cachedPosts = JSON.parse(rawCachedPosts)
  }

  for (let postOnDatabase of foundedPostsOnDatabase.docs) {
    const {
      id,
      created_at,
      updated_at,
      text,
      user_id
    } = postOnDatabase.data()

    const authorClerkData = await clerk.users.getUser(user_id)

    const author = {
      username: authorClerkData.username!,
      avatar: authorClerkData.imageUrl,
    }

    const parsedCreatedAt = new Date(
      created_at._seconds * 1000 + created_at._nanoseconds / 1000000
    )

    parsedPostsOnDatabase.push({
      id,
      created_at: parsedCreatedAt,
      text,
      author,
      user_id,
      fav_count: 0,
    })
  }

  cachedPosts = [...parsedPostsOnDatabase, ...cachedPosts].slice(0, CACHE_OBJECTS_LIMIT)

  await redis.set(MAIN_FEED_CACHE_OBJECTS_KEY, JSON.stringify(cachedPosts))
  await redis.set(MAIN_FEED_CACHE_UPDATE_DATE_KEY, `${new Date()}`)

  return cachedPosts
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
  const firestore = admin.firestore()
  const clerk = createClerkClient({
    secretKey: runtimeConfig.CLERK_SECRET_KEY!,
    publishableKey: runtimeConfig.public.CLERK_PUBLISHABLE_KEY!,
  })
  const lastCacheUpdate = await redis.get(MAIN_FEED_CACHE_UPDATE_DATE_KEY)

  try {
    if (!lastCacheUpdate) {
      return await getLastPostsAndRefreshCache(redis, clerk, firestore)
    } else {
      const now = moment()
      const lastUpdate = moment(lastCacheUpdate)
      if(now.diff(lastUpdate, 'seconds') > REFRESH_RATE_IN_SECONDS) {
        return await getLastPostsAndRefreshCache(redis, clerk, firestore, moment(lastCacheUpdate).toDate())
      } else {
        const rawCachedPosts = await redis.get(MAIN_FEED_CACHE_OBJECTS_KEY)
          
        if (!rawCachedPosts) {
          return await getLastPostsAndRefreshCache(redis, clerk, firestore)
        } else {
          return JSON.parse(rawCachedPosts)
        }
      }
    }
  } catch(error) {
    console.error(error)
    setResponseStatus(event, 500)

    return {
      error: 'Unexpected error'
    }
  }
})
