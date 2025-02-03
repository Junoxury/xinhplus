CREATE OR REPLACE FUNCTION get_top_treatments(
  p_limit integer DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  view_count bigint
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.title,
    t.view_count
  FROM treatments t
  WHERE t.is_active = true
  ORDER BY t.view_count DESC
  LIMIT p_limit;
END;
$$; 