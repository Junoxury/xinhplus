-- 태그 목록을 가져오는 RPC 함수
CREATE OR REPLACE FUNCTION get_tags(
  p_limit INTEGER DEFAULT 10,
  p_order_by TEXT DEFAULT 'id' -- 'id', 'name', 'slug', 'post_count' 중 선택
)
RETURNS TABLE (
  id bigint,
  name VARCHAR(50),
  slug VARCHAR(50),
  post_count INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.slug,
    t.post_count
  FROM tags t
  ORDER BY
    CASE p_order_by 
      WHEN 'id' THEN t.id
      WHEN 'post_count' THEN t.post_count
    END DESC NULLS LAST,
    CASE p_order_by
      WHEN 'name' THEN t.name
      WHEN 'slug' THEN t.slug
    END ASC NULLS LAST
  LIMIT p_limit;
END;
$$;

-- 함수 사용 권한 설정
GRANT EXECUTE ON FUNCTION get_tags TO authenticated;
GRANT EXECUTE ON FUNCTION get_tags TO service_role;

-- 사용 예시:
-- SELECT * FROM get_tags(5, 'name'); -- name으로 정렬하여 5개 가져오기
-- SELECT * FROM get_tags(10, 'post_count'); -- post_count로 정렬하여 10개 가져오기
-- SELECT * FROM get_tags(); -- 기본값으로 id 정렬, 10개 가져오기 