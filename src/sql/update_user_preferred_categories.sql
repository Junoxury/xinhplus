CREATE OR REPLACE FUNCTION update_user_preferred_categories(
  p_user_id UUID,
  p_categories INTEGER[]
) RETURNS BOOLEAN LANGUAGE plpgsql AS $$
BEGIN
  -- user_profiles 테이블의 preferred_categories 업데이트
  UPDATE user_profiles 
  SET 
    preferred_categories = p_categories,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  RETURN TRUE;
END;
$$; 