-- review_comments 테이블에 status 컬럼 추가
ALTER TABLE review_comments
ADD COLUMN status VARCHAR(20) DEFAULT 'normal' 
CHECK (status IN ('normal', 'reported', 'hidden'));

-- status에 대한 인덱스 생성
CREATE INDEX idx_review_comments_status ON review_comments(status); 