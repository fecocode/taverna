import { STORABLE_USER_NOTIFICATION } from "~/types/entities.types";
import admin from 'firebase-admin';

export async function createNewNotification(data: {
  text: string;
  user_id: string;
  link: string;
  image_url: string;
}): Promise<STORABLE_USER_NOTIFICATION> {
  const newNotificationId = crypto.randomUUID()
  const createdAt = new Date()

  const storableNotification: STORABLE_USER_NOTIFICATION = {
    id: newNotificationId,
    created_at: createdAt,
    text: data.text,
    user_id: data.user_id,
    image_url: data.image_url,
    link: data.link,
  }

  try {
    await admin.firestore().collection('user-notifications').doc(newNotificationId).set(storableNotification)

    return storableNotification
  } catch (error) {
    throw new Error(`createNewNotification: ${error}`)
  }
}
