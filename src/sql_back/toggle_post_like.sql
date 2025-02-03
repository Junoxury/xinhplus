CREATE OR REPLACE FUNCTION toggle_post_like(
  p_post_id BIGINT,
  p_user_id UUID
) RETURNS TABLE (
  success BOOLEAN,
  is_liked BOOLEAN,
  new_like_count INTEGER
) LANGUAGE plpgsql AS $$
DECLARE
  v_exists BOOLEAN;
  v_current_count INTEGER;
BEGIN
  -- 좋아요 존재 여부 확인
  SELECT EXISTS (
    SELECT 1 FROM post_likes 
    WHERE post_id = p_post_id AND user_id = p_user_id
  ) INTO v_exists;
  
  IF v_exists THEN
    -- 좋아요 취소
    DELETE FROM post_likes 
    WHERE post_id = p_post_id AND user_id = p_user_id;
    
    UPDATE posts 
    SET like_count = posts.like_count - 1 
    WHERE id = p_post_id
    RETURNING posts.like_count INTO v_current_count;
    
    RETURN QUERY 
    SELECT 
      TRUE::BOOLEAN as success,
      FALSE::BOOLEAN as is_liked,
      v_current_count::INTEGER as new_like_count;
  ELSE
    -- 좋아요 추가
    INSERT INTO post_likes (post_id, user_id)
    VALUES (p_post_id, p_user_id);
    
    UPDATE posts 
    SET like_count = posts.like_count + 1 
    WHERE id = p_post_id
    RETURNING posts.like_count INTO v_current_count;
    
    RETURN QUERY 
    SELECT 
      TRUE::BOOLEAN as success,
      TRUE::BOOLEAN as is_liked,
      v_current_count::INTEGER as new_like_count;
  END IF;
END;
$$; 