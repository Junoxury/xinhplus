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

-- 기존 함수들 삭제
DROP FUNCTION IF EXISTS add_review_comment(BIGINT, UUID, TEXT, INTEGER);
DROP FUNCTION IF EXISTS add_review_comment(BIGINT, UUID, TEXT, INTEGER, BIGINT);
DROP FUNCTION IF EXISTS delete_review_comment(BIGINT, UUID);

-- 댓글 작성 및 평점 업데이트 함수
CREATE OR REPLACE FUNCTION add_review_comment(
  p_review_id BIGINT,
  p_user_id UUID,
  p_content TEXT,
  p_rating INTEGER,
  p_parent_id BIGINT DEFAULT NULL
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_comment_id BIGINT;
  v_avg_rating DECIMAL(2,1);
  v_new_comment JSONB;
BEGIN
  -- 댓글 추가 (like_count에 평점 저장, 답글인 경우 parent_id 설정)
  INSERT INTO review_comments (
    review_id, author_id, content, like_count, parent_id
  ) VALUES (
    p_review_id, p_user_id, p_content, 
    CASE WHEN p_parent_id IS NULL THEN p_rating ELSE 0 END,
    p_parent_id
  ) RETURNING id INTO v_comment_id;

  -- 리뷰의 댓글 수 증가
  UPDATE reviews
  SET comment_count = comment_count + 1
  WHERE id = p_review_id;

  -- 평점 업데이트는 일반 댓글인 경우에만 수행
  IF p_parent_id IS NULL THEN
    -- 해당 리뷰의 모든 댓글 평점의 평균 계산
    WITH comment_ratings AS (
      SELECT 
        review_id,
        COUNT(*) as rating_count,
        SUM(CAST(like_count AS DECIMAL)) as rating_sum
      FROM review_comments
      WHERE review_id = p_review_id
      AND parent_id IS NULL  -- 답글은 제외하고 계산
      GROUP BY review_id
    )
    SELECT 
      ROUND(rating_sum / rating_count, 1)
    INTO v_avg_rating
    FROM comment_ratings;

    -- 리뷰 평점 업데이트
    UPDATE reviews
    SET rating = v_avg_rating
    WHERE id = p_review_id;
  END IF;

  -- 새로 작성된 댓글 정보와 업데이트된 평점 반환
  SELECT jsonb_build_object(
    'id', rc.id,
    'content', rc.content,
    'author_id', rc.author_id,
    'author_name', (u.raw_user_meta_data->>'full_name'),
    'author_image', (u.raw_user_meta_data->>'avatar_url'),
    'like_count', rc.like_count,
    'created_at', rc.created_at,
    'parent_id', rc.parent_id,
    'new_rating', CASE WHEN p_parent_id IS NULL THEN v_avg_rating ELSE NULL END
  )
  INTO v_new_comment
  FROM review_comments rc
  LEFT JOIN auth.users u ON rc.author_id = u.id
  WHERE rc.id = v_comment_id;

  RETURN v_new_comment;
END;
$$;

-- 댓글 삭제 함수
CREATE OR REPLACE FUNCTION delete_review_comment(
  p_comment_id BIGINT,
  p_user_id UUID
) RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_review_id BIGINT;
BEGIN
  -- 삭제할 댓글의 review_id 저장
  SELECT review_id INTO v_review_id
  FROM review_comments
  WHERE id = p_comment_id AND author_id = p_user_id;

  -- 자신의 댓글만 삭제
  DELETE FROM review_comments
  WHERE id = p_comment_id AND author_id = p_user_id;
  
  IF FOUND THEN
    -- 리뷰의 댓글 수 감소
    UPDATE reviews
    SET comment_count = comment_count - 1
    WHERE id = v_review_id;
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;



