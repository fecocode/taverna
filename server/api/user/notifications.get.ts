import { createClerkClient } from "@clerk/clerk-sdk-node"
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  if (!admin.apps.length) {  
    initializeApp({
      credential: admin.credential.cert(JSON.parse(runtimeConfig.FIREBASE_ADMIN_KEY)),
      databaseURL: runtimeConfig.FIREBASE_DATABASE_ID,
    })
  }

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

    const userNotifications = await admin
      .firestore()
      .collection('user-notifications')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .limit(50)
      .get()
    
    return userNotifications.docs.map((doc) => {
      const { text, created_at, link, image_url  } = doc.data()

      return {
        text,
        link,
        image_url,
        created_at: parseFirestoreTimeStampFormatToDate(created_at)
      }
    })
  } catch (error) {
    console.error(error)
    return {
      error: 'unexpected error'
    }
  }
})