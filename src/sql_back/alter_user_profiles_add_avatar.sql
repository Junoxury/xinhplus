-- avatar_url 컬럼 추가
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url text DEFAULT NULL;

-- 설명 코멘트 추가
COMMENT ON COLUMN user_profiles.avatar_url IS '사용자 프로필 이미지 URL'; 