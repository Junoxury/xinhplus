-- avatar_url 컬럼 추가
ALTER TABLE user_profiles 
ADD COLUMN avatar_url text;

-- user_profiles 테이블에 service_role 컬럼 추가
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS service_role VARCHAR(20) DEFAULT 'user';

-- service_role에 대한 체크 제약조건 추가
ALTER TABLE public.user_profiles
ADD CONSTRAINT valid_service_role 
CHECK (service_role IN ('user', 'admin', 'super_admin'));

-- 기존 데이터에 대한 업데이트 예시
UPDATE public.user_profiles
SET service_role = 'admin'
WHERE id = '특정_사용자_ID'; 