import { createClient } from "@/lib/supabase/client";
import type { RecordPhotoRow } from "@/types/database";

export async function uploadRecordPhotos(
  recordId: string,
  files: File[],
): Promise<RecordPhotoRow[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다");

  const results: RecordPhotoRow[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split(".").pop() || "jpg";
    const filePath = `${user.id}/records/${recordId}/${Date.now()}_${i}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("record-photos")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data, error: insertError } = await supabase
      .from("record_photos")
      .insert({
        record_id: recordId,
        user_id: user.id,
        storage_path: filePath,
        sort_order: i,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    results.push(data);
  }

  return results;
}

export async function getRecordPhotos(
  recordId: string,
): Promise<RecordPhotoRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("record_photos")
    .select("*")
    .eq("record_id", recordId)
    .order("sort_order");

  if (error) throw error;
  return data;
}

export async function getPhotoSignedUrl(
  storagePath: string,
): Promise<string> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from("record-photos")
    .createSignedUrl(storagePath, 3600); // 1시간 유효

  if (error) throw error;
  return data.signedUrl;
}

export async function deleteRecordPhoto(
  photoId: string,
  storagePath: string,
): Promise<void> {
  const supabase = createClient();

  // Storage에서 파일 삭제
  const { error: storageError } = await supabase.storage
    .from("record-photos")
    .remove([storagePath]);

  if (storageError) throw storageError;

  // DB에서 레코드 삭제
  const { error: dbError } = await supabase
    .from("record_photos")
    .delete()
    .eq("id", photoId);

  if (dbError) throw dbError;
}
