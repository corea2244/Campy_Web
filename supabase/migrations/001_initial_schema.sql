-- =============================================
-- Campy 초기 스키마: profiles, records, record_photos
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- 1. profiles 테이블
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nickname TEXT,
  provider TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. records 테이블
CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  date_type TEXT NOT NULL CHECK (date_type IN ('single', 'range')),
  start_date DATE NOT NULL,
  end_date DATE,
  place_name TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (
    date_type = 'single' OR (end_date IS NOT NULL AND end_date >= start_date)
  )
);

-- 3. record_photos 테이블
CREATE TABLE record_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- updated_at 자동 갱신 트리거
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER records_updated_at
  BEFORE UPDATE ON records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 신규 사용자 가입 시 프로필 자동 생성 트리거
-- =============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname, provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_app_meta_data->>'provider'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- RLS (Row Level Security) 활성화
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_photos ENABLE ROW LEVEL SECURITY;

-- profiles 정책
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- records 정책
CREATE POLICY "records_select_own" ON records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "records_insert_own" ON records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "records_update_own" ON records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "records_delete_own" ON records
  FOR DELETE USING (auth.uid() = user_id);

-- record_photos 정책
CREATE POLICY "photos_select_own" ON record_photos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "photos_insert_own" ON record_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "photos_update_own" ON record_photos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "photos_delete_own" ON record_photos
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 인덱스
-- =============================================

CREATE INDEX idx_records_user_id ON records(user_id);
CREATE INDEX idx_records_start_date ON records(start_date);
CREATE INDEX idx_record_photos_record_id ON record_photos(record_id);
CREATE INDEX idx_record_photos_user_id ON record_photos(user_id);

-- =============================================
-- Storage 정책 (bucket: record-photos)
-- 먼저 Supabase 대시보드에서 'record-photos' 버킷을 생성하세요
-- 경로 구조: {userId}/records/{recordId}/{fileName}
-- =============================================

CREATE POLICY "storage_select_own" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'record-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "storage_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'record-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "storage_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'record-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "storage_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'record-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
