export type STOREABLE_POST = {
  id: string;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
  text: string;
  user_id: string;
  deleted: boolean;
  parent_post_id: string | null;
}

export type STORABLE_FAV_USER_POST_RELATIONSHIP = {
  id: string;
  user_id: string;
  post_id: string;
  created_at: Date;
}