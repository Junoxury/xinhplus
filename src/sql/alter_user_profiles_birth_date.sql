-- birth_date 컬럼 삭제 (기존 컬럼이 있는 경우)
ALTER TABLE user_profiles 
DROP COLUMN IF EXISTS birth_date;

-- 새로운 birth_year, birth_month, birth_day 컬럼 추가
ALTER TABLE user_profiles 
ADD COLUMN birth_year VARCHAR(4),
ADD COLUMN birth_month VARCHAR(2),
ADD COLUMN birth_day VARCHAR(2);

-- 컬럼에 대한 유효성 검사 제약조건 추가
ALTER TABLE user_profiles 
ADD CONSTRAINT valid_birth_year 
CHECK (birth_year ~ '^\d{4}$' AND birth_year::integer BETWEEN 1900 AND EXTRACT(YEAR FROM CURRENT_DATE)::integer);

ALTER TABLE user_profiles 
ADD CONSTRAINT valid_birth_month 
CHECK (birth_month ~ '^\d{1,2}$' AND birth_month::integer BETWEEN 1 AND 12);

ALTER TABLE user_profiles 
ADD CONSTRAINT valid_birth_day 
CHECK (birth_day ~ '^\d{1,2}$' AND birth_day::integer BETWEEN 1 AND 31);

-- 선택적: 기존 데이터가 있는 경우를 위한 인덱스 추가
CREATE INDEX idx_user_profiles_birth_year ON user_profiles(birth_year); 