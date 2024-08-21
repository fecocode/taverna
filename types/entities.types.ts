export type STOREABLE_POST = {
  id: string;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
  text: string;
  user_id: string;
  deleted: boolean;
  parent_post_id: string | null;
  picture_url: string | null;
}

export type STORABLE_FAV_USER_POST_RELATIONSHIP = {
  id: string;
  user_id: string;
  post_id: string;
  created_at: Date;
}

export type STORABLE_FOLLOW_RELATIONSHIP = {
  id: string;
  follower_user_id: string;
  followed_user_id: string;
  created_at: Date;
}