export type STOREABLE_POST = {
  id: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
  text: string;
  user_id: string;
  deleted: boolean;
}