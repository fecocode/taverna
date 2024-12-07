import { createHmac, timingSafeEqual } from 'crypto';

export function verifyClerkSignature(payload: any, signature: string) {
  const secret = useRuntimeConfig().clerkWebhookSecret;
  if (!secret || !signature) return false;

  const hmac = createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const digest = hmac.digest('hex');

  return timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}