-- 리뷰 좋아요 토글 함수
CREATE OR REPLACE FUNCTION toggle_review_like(
  p_review_id BIGINT,
  p_user_id UUID
) RETURNS TABLE (
  is_liked BOOLEAN,
  like_count INTEGER
) LANGUAGE plpgsql AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  -- 좋아요 존재 여부 확인
  SELECT EXISTS (
    SELECT 1 FROM review_likes
    WHERE review_id = p_review_id AND user_id = p_user_id
  ) INTO v_exists;

  IF v_exists THEN
    -- 좋아요 취소
    DELETE FROM review_likes
    WHERE review_id = p_review_id AND user_id = p_user_id;
    
    UPDATE reviews r
    SET like_count = r.like_count - 1
    WHERE id = p_review_id;
    
    RETURN QUERY
    SELECT 
      FALSE as is_liked,
      r.like_count
    FROM reviews r
    WHERE r.id = p_review_id;
  ELSE
    -- 좋아요 추가
    INSERT INTO review_likes (review_id, user_id)
    VALUES (p_review_id, p_user_id);
    
    UPDATE reviews r
    SET like_count = r.like_count + 1
    WHERE id = p_review_id;
    
    RETURN QUERY
    SELECT 
      TRUE as is_liked,
      r.like_count
    FROM reviews r
    WHERE r.id = p_review_id;
  END IF;
END;
$$;

