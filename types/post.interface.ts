import type { RAW_DELETE_USER_POST_REQUEST_BODY, RAW_EDIT_USER_POST_REQUEST_BODY } from "./api-spec.types";

export interface IPost {
  id: string;
  user_id: string;
  author: {
    username: string;
    avatar: string;
  };
  text: string;
  created_at?: Date;
  updated_at?: Date;
  fav_count: number;
  replies_count: number;
  replies?: IPost[];
  parent_post?: IPost;
  parent_post_id?: string;
  deleted?: boolean;
  deleted_at?: Date;

  toUpdate(): RAW_EDIT_USER_POST_REQUEST_BODY;
  toDelete(): RAW_DELETE_USER_POST_REQUEST_BODY;
}