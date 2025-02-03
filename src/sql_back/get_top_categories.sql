CREATE OR REPLACE FUNCTION get_top_categories(
  p_limit integer DEFAULT 5
)
RETURNS TABLE (
  category_id integer,
  category_name text,
  total_views bigint
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH treatment_categories AS (
    -- treatments.categories에서 depth2 카테고리 ID 추출
    SELECT 
      t.id as treatment_id,
      jsonb_array_elements(t.categories) -> 'depth2' ->> 'id' as depth2_id
    FROM treatments t
    WHERE t.is_active = true
  )
  SELECT 
    c.id as category_id,
    c.name as category_name,
    COALESCE(SUM(t.view_count), 0)::bigint as total_views
  FROM categories c
  LEFT JOIN treatment_categories tc ON tc.depth2_id = c.id::text
  LEFT JOIN treatments t ON t.id = tc.treatment_id
  WHERE c.depth = 2
  GROUP BY c.id, c.name
  ORDER BY total_views DESC
  LIMIT p_limit;
END;
$$; 