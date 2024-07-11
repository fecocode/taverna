import { createClerkClient } from "@clerk/clerk-sdk-node"
import { getFirestoreClient } from "../utils/firebase.utility.ts";
import { RAW_CREATE_USER_POST_REQUEST_BODY, RAW_USER_POST_RESPONSE_DATA } from "~/types/api-spec.types.js";
import { STOREABLE_POST } from "~/types/entities.types.js";



export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

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

    const author = await clerk.users.getUser(userId)

    const firestore = getFirestoreClient(runtimeConfig.FIREBASE_ADMIN_KEY, runtimeConfig.FIREBASE_DATABASE_ID)

    const newPostId = crypto.randomUUID()
    const createdAt = new Date()

    const newPost: STOREABLE_POST = {
      id: newPostId,
      text: requestBody.text,
      created_at: createdAt,
      user_id: userId,
      deleted: false,
    }

    await firestore.collection('user-posts').doc(newPostId).set(newPost)

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
    setResponseStatus(event, 500)
    return {
      error
    }
  }
})
