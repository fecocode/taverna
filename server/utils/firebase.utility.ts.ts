import admin from 'firebase-admin';

export function getFirestoreClient(firebase_credentials: string) {

  admin.credential.cert(JSON.parse(firebase_credentials));

  return admin.firestore();
}