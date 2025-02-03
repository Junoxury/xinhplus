-- 리뷰 테이블
-- reviews 테이블에 hospital_id 컬럼 추가
CREATE TABLE reviews (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  treatment_cost INTEGER,  -- 시술 비용 (null 허용)
  treatment_date DATE,           -- 시술 날짜 (null 허용)
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,  -- 댓글 수 컬럼 추가
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 외래 키 없이 참조용 ID만 저장
  author_id UUID NOT NULL,
  treatment_id BIGINT,
  hospital_id BIGINT,  -- clinic_id를 hospital_id로 변경
  
  -- 메타 데이터
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'hidden')),
  is_verified BOOLEAN DEFAULT false,
  is_best BOOLEAN DEFAULT false,
  is_google BOOLEAN DEFAULT false  -- 추가된 부분
);

-- 리뷰 이미지 테이블
CREATE TABLE review_images (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  review_id BIGINT NOT NULL,
  image_url TEXT NOT NULL,
  image_type VARCHAR(20) CHECK (image_type IN ('before', 'after')),
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 리뷰 댓글 테이블
CREATE TABLE review_comments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  review_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  parent_id BIGINT, -- 답글을 위한 self reference
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- UUID 타입의 author_id
  author_id UUID NOT NULL
);

-- 리뷰 좋아요 테이블
CREATE TABLE review_likes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  review_id BIGINT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 중복 방지를 위한 유니크 제약
  UNIQUE(review_id, user_id)
);

-- 댓글 좋아요 테이블
CREATE TABLE comment_likes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  comment_id BIGINT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 중복 방지를 위한 유니크 제약
  UNIQUE(comment_id, user_id)
);


-- RLS 정책 설정
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;


-- 인덱스 생성
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_reviews_view_count ON reviews(view_count DESC);
CREATE INDEX idx_reviews_author_id ON reviews(author_id);
CREATE INDEX idx_reviews_treatment_id ON reviews(treatment_id);
CREATE INDEX idx_reviews_hospital_id ON reviews(hospital_id);  -- 인덱스 이름도 변경
CREATE INDEX idx_review_comments_created_at ON review_comments(created_at DESC);
CREATE INDEX idx_review_comments_parent_id ON review_comments(parent_id);
CREATE INDEX idx_review_comments_review_id ON review_comments(review_id);
CREATE INDEX idx_review_images_review_id ON review_images(review_id);


-- review_likes 테이블에 대한 RLS 활성화
ALTER TABLE review_likes ENABLE ROW LEVEL SECURITY;

-- 인증된 사용자는 좋아요를 추가/삭제할 수 있는 정책
CREATE POLICY "인증된 사용자는 좋아요 가능" ON review_likes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 모든 사용자가 좋아요 조회 가능한 정책
CREATE POLICY "모든 사용자가 좋아요 조회 가능" ON review_likes
  FOR SELECT
  TO public
  USING (true);

-- review_images 테이블에 대한 RLS 정책 추가
CREATE POLICY "인증된 사용자는 리뷰 이미지 추가 가능" ON review_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "모든 사용자가 리뷰 이미지 조회 가능" ON review_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "작성자는 자신의 리뷰 이미지 수정/삭제 가능" ON review_images
  FOR ALL
  TO authenticated
  USING (
    review_id IN (
      SELECT id FROM reviews 
      WHERE author_id = auth.uid()
    )
  );

