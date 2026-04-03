export interface Profile {
  id: string;
  email: string | null;
  nickname: string | null;
  provider: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampRecord {
  id: string;
  user_id: string;
  title: string;
  content: string;
  date_type: "single" | "range";
  start_date: string;
  end_date: string | null;
  place_name: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface RecordPhotoRow {
  id: string;
  record_id: string;
  user_id: string;
  storage_path: string;
  public_url: string | null;
  sort_order: number;
  created_at: string;
}
