import { createClient } from "@/lib/supabase/client";
import type { CampRecord } from "@/types/database";

type RecordInsert = Omit<CampRecord, "id" | "user_id" | "created_at" | "updated_at">;
type RecordUpdate = Partial<RecordInsert>;

export async function createRecord(record: RecordInsert): Promise<CampRecord> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다");

  const { data, error } = await supabase
    .from("records")
    .insert({ ...record, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyRecords(): Promise<CampRecord[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("records")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getRecord(id: string): Promise<CampRecord> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("records")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateRecord(
  id: string,
  updates: RecordUpdate,
): Promise<CampRecord> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("records")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRecord(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("records").delete().eq("id", id);

  if (error) throw error;
}
