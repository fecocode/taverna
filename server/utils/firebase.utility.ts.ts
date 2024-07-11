import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

export function getFirestoreClient(firebase_credentials: string, database_id: string) {

  initializeApp({
    credential: admin.credential.cert(JSON.parse(firebase_credentials)),
    databaseURL: database_id,
  })


  return admin.firestore();
}