import type { RAW_EDIT_USER_POST_REQUEST_BODY, RAW_DELETE_USER_POST_REQUEST_BODY, RAW_USER_POST_RESPONSE_DATA } from "~/types/api-spec.types";
import type { IPost } from "~/types/post.interface";

export class Post implements IPost {
  id: string;
  user_id: string;
  text: string;
  created_at?: Date;
  updated_at?: Date;
  deleted?: boolean | undefined;
  deleted_at?: Date | undefined;
  fav_count: number;
  replies_count: number;
  author: { username: string; avatar: string; };
  replies?: IPost[] | undefined;
  parent_post?: IPost | undefined;
  parent_post_id?: string | undefined;
  picture_url?: string | undefined;

  constructor(rawPost: RAW_USER_POST_RESPONSE_DATA) {
    this.id = rawPost.id
    this.user_id = rawPost.user_id
    this.text = rawPost.text
    this.created_at = rawPost.created_at
    this.updated_at = rawPost.updated_at
    this.fav_count = rawPost.fav_count
    this.replies_count = rawPost.replies_count
    this.author = {
      username: rawPost.author.username,
      avatar: rawPost.author.avatar
    }
    this.deleted = rawPost.deleted
    this.deleted_at = rawPost.deleted_at
    this.parent_post_id = rawPost.parent_post_id

    if (rawPost.replies) {
      this.replies = rawPost.replies.map((rawReply) => new Post(rawReply))
    }

    if (rawPost.parent_post) {
      this.parent_post = new Post(rawPost.parent_post)
    }

    if (rawPost.picture_url) {
      this.picture_url = rawPost.picture_url
    }
  }
}
