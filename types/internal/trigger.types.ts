import type { IPost } from "../post.interface"

export interface BaseTrigger {
  name: string,
  data: object,
}

export interface UpdatePostTrigger extends BaseTrigger {
  name: 'update-post',
  data: {
    postId: string,
    newPostData: IPost
  }
}

export interface DeletePostTrigger extends BaseTrigger {
  name: 'delete-post',
  data: {
    postId: string,
  }
}

export type UITrigger = UpdatePostTrigger | DeletePostTrigger