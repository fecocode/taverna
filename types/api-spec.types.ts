// REQUESTS

export type RAW_CREATE_USER_POST_REQUEST_BODY = {
  text: string;
  parent_post_id?: string,
}

export type RAW_EDIT_USER_POST_REQUEST_BODY = {
  id: string;
  text: string;
}

export type RAW_DELETE_USER_POST_REQUEST_BODY = {
  id: string;
}

export type RAW_GET_POST_BY_ID = {
  id: string;
}

// RESPONSES

export type RAW_USER_POST_RESPONSE_DATA = {
  id: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
  deleted?: boolean;
  text: string;
  user_id: string;
  author: {
    username: string;
    avatar: string;
  };
  fav_count: number;
  replies_count: number;
  parent_post_id?: string;
  replies?: RAW_USER_POST_RESPONSE_DATA[],
  parent_post?: RAW_USER_POST_RESPONSE_DATA,
}

export type RAW_NEW_FAV_STORED_RESPONSE = {
  created_at: Date,
  post_id: string,
  fav_count: number,
  id: string,
}

export type RAW_UNFAV_RESPONSE = {
  post_id: string,
  fav_count: number,
  id: string,
}