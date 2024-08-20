import admin from 'firebase-admin';
import { RAW_USER_POST_RESPONSE_DATA } from "~/types/api-spec.types";
import { ClerkClient } from "@clerk/clerk-sdk-node";
import Redis from "ioredis";

function parseFirestoreTimeStampFormatToDate(firestoreFormatedDate: {_seconds: number, _nanoseconds: number} | null) {
  if (firestoreFormatedDate) {
    return new Date(
      firestoreFormatedDate._seconds * 1000 + firestoreFormatedDate._nanoseconds / 1000000
    )
  } else {
    return null
  }
}

export async function getAuthorUserIdByUsername(
  username: string,
  clerkClient: ClerkClient,
  redis: Redis,
): Promise<string | null> {
  const catchedAuthorId = await redis.get(`username-id:${username}`)

  if (!catchedAuthorId) {
    const clerkSearchResults = await clerkClient.users.getUserList({
      username: [username],
    })

    const [ clerkUser ] = clerkSearchResults.data

    if (clerkUser) {
      await redis.set(`username-id:${username}`, clerkUser.id, 'EX', 60*60*24*15)
      return clerkUser.id
    } else {
      return null
    }
  } else {
    return catchedAuthorId
  }
}


export async function getPostAuthorData(
  authorId: string,
  clerkClient: ClerkClient,
  redis: Redis,
): Promise<{ username: string, avatar: string }> {
  let author = null

  const catchedAuthor = await redis.get(`author:${authorId}`)

  if (!catchedAuthor) {
    const authorClerkData = await clerkClient.users.getUser(authorId)

    author = {
      username: authorClerkData.username!,
      avatar: authorClerkData.imageUrl,
    }

    await redis.set(`author:${authorId}`, JSON.stringify(author), 'EX', 60*60)
  } else {
    author = JSON.parse(catchedAuthor)
  }

  return author
}

async function getFavCountData(
  postId: string,
  redis: Redis
): Promise<number> {
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

  return favCount
}

async function getRepliesCountData(
  postId: string,
  redis: Redis
): Promise<number> {
  let repliesCount = 0

  const postCatchedRepliesCountKey = `post:${postId}:replies`
  const existCatchedRepliesList = await redis.exists(postCatchedRepliesCountKey)

  if (existCatchedRepliesList) {
    repliesCount = await redis.llen(postCatchedRepliesCountKey)
  } else {
    const repliesQuerySnapshot = await admin.firestore()
      .collection('user-posts')
      .where('parent_post_id', '==', postId)
      .where('deleted', '!=', true)
      .get()

    repliesCount = repliesQuerySnapshot.size

    if (repliesCount) {
      const repliesIdsArray = repliesQuerySnapshot.docs.map((doc) => `${doc.id}`)
      await redis.rpush(postCatchedRepliesCountKey, ...repliesIdsArray)
    }
  }

  return repliesCount
}


export async function populatePostReplies(
  post: RAW_USER_POST_RESPONSE_DATA,
  clerkClient: ClerkClient,
  redis: Redis,
): Promise<RAW_USER_POST_RESPONSE_DATA> {
  if (!admin.apps.length) {
    throw new Error('FirebaseAdmin not initialized')
  }
  
  const copyOfPost = { ...post }

  const postCatchedRepliesCountKey = `post:${post.id}:replies`
  const existCatchedRepliesList = await redis.exists(postCatchedRepliesCountKey)

  const replies: RAW_USER_POST_RESPONSE_DATA[] = []

  if (existCatchedRepliesList) {
    const cachedRepliesList = await redis.lrange(postCatchedRepliesCountKey, 0, -1)

    for (let cachedReplyId of cachedRepliesList) {
      const reply = await getPostById(cachedReplyId, clerkClient, redis)

      if (reply) {
        if (reply.deleted) {
          await redis.lrem(postCatchedRepliesCountKey, 0, reply.id)
          continue
        }
        replies.push(reply)
      }
    }
  } else {
    const repliesQuerySnapshot = await admin.firestore()
      .collection('user-posts')
      .where('parent_post_id', '==', post.id)
      .get()

    for (let savedReply of repliesQuerySnapshot.docs) {
      const reply = await getPostById(savedReply.id, clerkClient, redis)

      if (reply && !reply.deleted) {
        replies.push(reply)
      }
    }
  }


  copyOfPost.replies = replies

  return copyOfPost
}

export async function populatePostParent(
  post: RAW_USER_POST_RESPONSE_DATA,
  clerkClient: ClerkClient,
  redis: Redis,
): Promise<RAW_USER_POST_RESPONSE_DATA> {
  if (!admin.apps.length) {
    throw new Error('FirebaseAdmin not initialized')
  }

  const copyOfPost = {...post}

  if (!copyOfPost.parent_post_id) {
    return copyOfPost
  } else {
    const parentPost = await getPostById(copyOfPost.parent_post_id, clerkClient, redis)

    if (parentPost) {
      copyOfPost.parent_post = await populatePostParent(parentPost, clerkClient, redis)
    }
  }

  return copyOfPost
}

export async function getPostById(
  postId: string,
  clerkClient: ClerkClient,
  redis: Redis,
): Promise<RAW_USER_POST_RESPONSE_DATA | null> {
  if (!admin.apps.length) {
    throw new Error('FirebaseAdmin not initialized')
  }

  const rawCatchedPost = await redis.get(`post:${postId}`)
  let postObject = null

  if (!rawCatchedPost) {
    const querySnapshotOfPostSearch = await admin
      .firestore()
      .collection('user-posts')
      .doc(postId)
      .get()

    const storedPostOnDatabase = querySnapshotOfPostSearch.data()

    if (!storedPostOnDatabase) {
      return null
    }

    if (storedPostOnDatabase.deleted) {
      return {
        id: storedPostOnDatabase.id,
        text: '',
        created_at: parseFirestoreTimeStampFormatToDate(storedPostOnDatabase.created_at)!,
        updated_at: parseFirestoreTimeStampFormatToDate(storedPostOnDatabase.updated_at)!,
        deleted_at: parseFirestoreTimeStampFormatToDate(storedPostOnDatabase.deleted_at)!,
        user_id: storedPostOnDatabase.user_id,
        deleted: storedPostOnDatabase.deleted,
        fav_count: 0,
        replies_count: 0,
        author: await getPostAuthorData(storedPostOnDatabase.user_id, clerkClient, redis)
      }
    }

    const parsedFoundedPost = {
      id: storedPostOnDatabase.id,
      text: storedPostOnDatabase.text,
      created_at: parseFirestoreTimeStampFormatToDate(storedPostOnDatabase.created_at),
      updated_at: parseFirestoreTimeStampFormatToDate(storedPostOnDatabase.updated_at),
      deleted_at: parseFirestoreTimeStampFormatToDate(storedPostOnDatabase.deleted_at),
      user_id: storedPostOnDatabase.user_id,
      deleted: storedPostOnDatabase.deleted,
      parent_post_id: storedPostOnDatabase.parent_post_id,
    }

    await redis.set(`post:${postId}`, JSON.stringify(parsedFoundedPost), 'EX', 60*60*24)
    postObject = parsedFoundedPost
  } else {
    postObject = JSON.parse(rawCatchedPost)
  }

  return {
    id: postObject.id,
    text: postObject.text,
    created_at: postObject.created_at,
    updated_at: postObject.updated_at,
    user_id: postObject.user_id,
    fav_count: await getFavCountData(postId, redis),
    replies_count: await getRepliesCountData(postId, redis),
    author: await getPostAuthorData(postObject.user_id, clerkClient, redis),
    parent_post_id: postObject.parent_post_id
  }
}

export async function getLastAuthorPosts(authorId: string, clerk: ClerkClient, redis: Redis): Promise<RAW_USER_POST_RESPONSE_DATA[]> {
  const POST_LIMIT = 50
  const posts: RAW_USER_POST_RESPONSE_DATA[] = []


  const lastAuthorPostsIdsQuerySnapshot = await admin
    .firestore()
    .collection('user-posts')
    .orderBy('created_at', 'desc')
    .where('user_id', '==', authorId)
    .where('deleted', '!=', true)
    .limit(POST_LIMIT)
    .get()

  for (let savedAuthorPost of lastAuthorPostsIdsQuerySnapshot.docs) {
    const post = await getPostById(savedAuthorPost.id, clerk, redis)

    if (post && !post.deleted) {
      posts.push(post)
    }
  }

  return posts
}
