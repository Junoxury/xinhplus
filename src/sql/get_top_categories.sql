CREATE OR REPLACE FUNCTION get_top_categories(
  p_limit integer DEFAULT 5
)
RETURNS TABLE (
  category_id bigint,
  category_name text,
  total_views bigint
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as category_id,
    c.name as category_name,
    COALESCE(SUM(t.view_count), 0)::bigint as total_views
  FROM categories c
  LEFT JOIN treatment_categories tc ON tc.depth2_category_id = c.id
  LEFT JOIN treatments t ON t.id = tc.treatment_id
  WHERE c.depth = 2 
    AND c.is_active = true
  GROUP BY c.id, c.name
  ORDER BY total_views DESC
  LIMIT p_limit;
END;
$$; 