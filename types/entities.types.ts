export type STOREABLE_POST = {
  id: string;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
  text: string;
  user_id: string;
  deleted: boolean;
}