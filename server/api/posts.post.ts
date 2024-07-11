import { createClerkClient } from "@clerk/clerk-sdk-node"

export default eventHandler(defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

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

    
  
    return {
      ok: verifiedSession.isSignedIn
    }
  } catch(error) {
    console.log(error)
    return {
      error
    }
  }
}))
