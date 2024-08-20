import Redis from "ioredis";
import { ClerkClient } from "@clerk/clerk-sdk-node";
import admin from 'firebase-admin';
import { STORABLE_FOLLOW_RELATIONSHIP } from "~/types/entities.types";

export async function setFollowingRelationship(followerId: string, followedId: string, redis: Redis) {
  if (followedId === followerId) {
    return
  }

  const followRelationshipExist = await checkIfFollowRelationshipExist(followerId, followedId, redis)

  if (followRelationshipExist) {
    return
  }

  const newFollowRelationship: STORABLE_FOLLOW_RELATIONSHIP = {
    id: crypto.randomUUID(),
    followed_user_id: followedId,
    follower_user_id: followerId,
    created_at: new Date(),
  }

  // Saving on database
  await admin
    .firestore()
    .collection('follow-relationships')
    .doc(newFollowRelationship.id)
    .set(newFollowRelationship)

  // Saving on cache

  await redis.sadd(`author:${followedId}:followers`, followerId)
  await redis.sadd(`author:${followerId}:follows`, followedId)
}

export async function removeFollowingRelationship(followerId: string, followedId: string, redis: Redis) {
  const followRelationshipOnDatabaseQuerySnapshot = await admin
    .firestore()
    .collection('follow-relationships')
    .where('follower_user_id', '==', followerId)
    .where('followed_user_id', '==', followedId)
    .get()
  
  const followDocs = followRelationshipOnDatabaseQuerySnapshot.docs

  if (followRelationshipOnDatabaseQuerySnapshot.empty) {
    return
  }

  // Prevent multiple following documents (Why? There is no reason xD)
  for (let doc of followDocs) {
    await admin
      .firestore()
      .collection('follow-relationships')
      .doc(doc.id)
      .delete() 
  }

  await redis.srem(`author:${followedId}:followers`, followerId)
  await redis.srem(`author:${followerId}:follows`, followedId)
}

export async function checkIfFollowRelationshipExist(followerId: string, followedId: string, redis: Redis): Promise<boolean> {
  if (followedId === followerId) {
    return false
  }

  const isFollowingRelationshipOnCache = await redis.sismember(`author:${followedId}:followers`, followerId)

  if (isFollowingRelationshipOnCache) {
    return true
  } else {
    const savedOnDatabaseFollowRelationshipQuerySnapshot = await admin
      .firestore()
      .collection('follow-relationships')
      .where('follower_user_id', '==', followerId)
      .where('followed_user_id', '==', followedId)
      .get()
    
    const existRelationship = savedOnDatabaseFollowRelationshipQuerySnapshot.size > 0

    if (existRelationship) {
      await redis.sadd(`author:${followedId}:followers`, followerId)
      await redis.sadd(`author:${followerId}:follows`, followedId)
    }

    return existRelationship
  }
}

export async function countFollowersOfAnAuthor(authorId: string, redis: Redis): Promise<number> {
  const followersCount = await redis.scard(`author:${authorId}:followers`)

  return followersCount
}
