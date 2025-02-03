-- 상담 요청 테이블
CREATE TABLE consultations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id),
  hospital_id BIGINT REFERENCES hospitals(id),
  treatment_id BIGINT REFERENCES treatments(id),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  description TEXT,
  status SMALLINT DEFAULT 1, -- 1: 접수, 2: 이메일발송
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 상태 변경 이력 테이블
CREATE TABLE consultation_status_history (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  consultation_id BIGINT REFERENCES consultations(id),
  previous_status SMALLINT,
  new_status SMALLINT,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users(id)
);

-- 상담 카테고리 연결 테이블
CREATE TABLE consultation_categories (
  consultation_id BIGINT REFERENCES consultations(id),
  category_id BIGINT REFERENCES categories(id),
  PRIMARY KEY (consultation_id, category_id)
);

-- 이미지 테이블 (다중 이미지 지원)
CREATE TABLE consultation_images (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  consultation_id BIGINT REFERENCES consultations(id),
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_hospital_id ON consultations(hospital_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_created_at ON consultations(created_at);
CREATE INDEX idx_consultation_images_consultation_id ON consultation_images(consultation_id);

-- 상태 체크를 위한 CHECK 제약조건
ALTER TABLE consultations 
ADD CONSTRAINT check_status 
CHECK (status IN (1, 2)); 