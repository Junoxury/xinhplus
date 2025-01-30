-- 카테고리 추가/제거 함수
CREATE OR REPLACE FUNCTION handle_user_preferred_category(
  p_user_id UUID,
  p_depth2_id bigint,
  p_is_add BOOLEAN
) RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  categories bigint[]
) LANGUAGE plpgsql AS $$
DECLARE
  v_count INTEGER;
BEGIN
  IF p_is_add THEN
    -- 추가 로직
    -- 이미 존재하는지 확인
    IF EXISTS (
      SELECT 1 FROM user_preferred_categories 
      WHERE user_id = p_user_id AND depth2_id = p_depth2_id
    ) THEN
      RETURN QUERY
      SELECT 
        FALSE,
        '이미 선택된 카테고리입니다'::TEXT,
        ARRAY(
          SELECT depth2_id 
          FROM user_preferred_categories 
          WHERE user_id = p_user_id 
          ORDER BY created_at
        );
      RETURN;
    END IF;

    -- 현재 선택된 카테고리 수 확인
    SELECT COUNT(*) 
    INTO v_count 
    FROM user_preferred_categories 
    WHERE user_id = p_user_id;

    IF v_count >= 5 THEN
      RETURN QUERY
      SELECT 
        FALSE,
        '최대 5개까지만 선택 가능합니다'::TEXT,
        ARRAY(
          SELECT depth2_id 
          FROM user_preferred_categories 
          WHERE user_id = p_user_id 
          ORDER BY created_at
        );
      RETURN;
    END IF;

    -- 카테고리 추가
    INSERT INTO user_preferred_categories (user_id, depth2_id)
    VALUES (p_user_id, p_depth2_id);
  ELSE
    -- 제거 로직
    DELETE FROM user_preferred_categories 
    WHERE user_id = p_user_id AND depth2_id = p_depth2_id;
  END IF;
  
  RETURN QUERY
  SELECT 
    TRUE,
    ''::TEXT,  -- 성공 시 빈 메시지
    ARRAY(
      SELECT depth2_id 
      FROM user_preferred_categories 
      WHERE user_id = p_user_id 
      ORDER BY created_at
    );
END;
$$; 