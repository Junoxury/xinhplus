-- 리뷰 삭제 함수
CREATE OR REPLACE FUNCTION delete_review(
  p_review_id BIGINT,
  p_user_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_hospital_id BIGINT;
  v_treatment_id BIGINT;
  v_author_id UUID;
  v_comment_count INTEGER;
  v_like_count INTEGER;
BEGIN
  -- 리뷰 작성자 확인
  SELECT 
    author_id,
    hospital_id,
    treatment_id
  INTO 
    v_author_id,
    v_hospital_id,
    v_treatment_id
  FROM reviews
  WHERE id = p_review_id;

  -- 권한 확인
  IF v_author_id != p_user_id THEN
    RAISE EXCEPTION '리뷰 삭제 권한이 없습니다';
  END IF;

  -- 리뷰의 댓글 수 조회
  SELECT COUNT(*)
  INTO v_comment_count
  FROM review_comments
  WHERE review_id = p_review_id;

  -- 리뷰의 좋아요 수 조회
  SELECT COUNT(*)
  INTO v_like_count
  FROM review_likes
  WHERE review_id = p_review_id;

  -- 리뷰 좋아요 삭제
  DELETE FROM review_likes
  WHERE review_id = p_review_id;

  -- 리뷰 이미지 삭제
  DELETE FROM review_images
  WHERE review_id = p_review_id;

  -- 리뷰 댓글 삭제
  DELETE FROM review_comments
  WHERE review_id = p_review_id;

  -- 리뷰 삭제
  DELETE FROM reviews
  WHERE id = p_review_id;

  -- 병원 통계 업데이트 (리뷰 1개 + 댓글 수만큼 감소, 좋아요 수만큼 감소)
  UPDATE hospitals h
  SET 
    comment_count = comment_count - (1 + v_comment_count),
    like_count = like_count - v_like_count,
    average_rating = COALESCE(
      (SELECT round(avg(rating)::numeric, 1)
       FROM reviews
       WHERE hospital_id = v_hospital_id),
      0
    )
  WHERE id = v_hospital_id;

  -- 시술 통계 업데이트 (리뷰 1개 + 댓글 수만큼 감소, 좋아요 수만큼 감소)
  UPDATE treatments t
  SET 
    comment_count = comment_count - (1 + v_comment_count),
    like_count = like_count - v_like_count,
    rating = COALESCE(
      (SELECT round(avg(rating)::numeric, 1)
       FROM reviews
       WHERE treatment_id = v_treatment_id),
      0
    )
  WHERE id = v_treatment_id;

  RETURN TRUE;
END;
$$;

-- 함수 사용 권한 설정
GRANT EXECUTE ON FUNCTION delete_review(BIGINT, UUID) TO authenticated; 