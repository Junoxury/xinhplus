CREATE OR REPLACE FUNCTION get_my_reviews(
  p_user_id uuid,
  p_page_size int DEFAULT 4,
  p_page int DEFAULT 1
) RETURNS TABLE (
  id bigint,
  title varchar,
  content text,
  before_image text,
  after_image text,
  rating decimal,
  view_count integer,
  like_count integer,
  comment_count integer,
  author_id uuid,
  author_name varchar,
  author_image varchar,
  created_at timestamptz,
  treatment_id bigint,
  treatment_name varchar,
  hospital_id bigint,
  hospital_name varchar,
  location varchar,
  categories jsonb,
  is_best boolean,
  is_google boolean,
  total_count bigint,
  has_next_page boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_offset int;
BEGIN
  v_offset := (p_page - 1) * p_page_size;

  RETURN QUERY
  WITH my_reviews AS (
    SELECT DISTINCT
      r.*,
      c.name as city_name,
      h.name as hospital_name,
      t.title as treatment_name,
      (u.raw_user_meta_data->>'full_name')::varchar as author_name,
      (u.raw_user_meta_data->>'avatar_url')::varchar as author_image
    FROM reviews r
    LEFT JOIN hospitals h ON r.hospital_id = h.id
    LEFT JOIN cities c ON h.city_id = c.id
    LEFT JOIN treatments t ON r.treatment_id = t.id
    LEFT JOIN auth.users u ON r.author_id = u.id
    WHERE r.author_id = p_user_id
  ),
  review_images AS (
    SELECT 
      ri.review_id,
      MAX(CASE WHEN ri.image_type = 'before' THEN ri.image_url END) as before_image,
      MAX(CASE WHEN ri.image_type = 'after' THEN ri.image_url END) as after_image
    FROM review_images ri
    GROUP BY ri.review_id
  ),
  ranked_reviews AS (
    SELECT 
      r.*,
      ROW_NUMBER() OVER (ORDER BY r.created_at DESC) as row_num
    FROM my_reviews r
  )
  SELECT 
    r.id,
    r.title,
    r.content,
    ri.before_image,
    ri.after_image,
    r.rating,
    r.view_count,
    r.like_count,
    r.comment_count,
    r.author_id,
    r.author_name,
    r.author_image,
    r.created_at,
    r.treatment_id,
    r.treatment_name,
    r.hospital_id,
    r.hospital_name,
    r.city_name as location,
    COALESCE(
      (
        SELECT jsonb_agg(DISTINCT jsonb_build_object(
          'depth2_id', tc.depth2_category_id,
          'depth2_name', c2.name,
          'depth3_list', jsonb_build_object(
            'id', c3.id,
            'name', c3.name
          )
        ))
        FROM (
          SELECT DISTINCT ON (depth2_category_id) 
            depth2_category_id,
            depth3_category_id
          FROM treatment_categories tc2
          WHERE tc2.treatment_id = r.treatment_id
        ) tc
        JOIN categories c2 ON tc.depth2_category_id = c2.id
        JOIN categories c3 ON tc.depth3_category_id = c3.id
      ),
      '[]'::jsonb
    ) as categories,
    r.is_best,
    r.is_google,
    (SELECT COUNT(*) FROM my_reviews) as total_count,
    (SELECT COUNT(*) FROM my_reviews) > (v_offset + p_page_size) as has_next_page
  FROM ranked_reviews r
  LEFT JOIN review_images ri ON r.id = ri.review_id
  WHERE r.row_num > v_offset 
    AND r.row_num <= (v_offset + p_page_size)
  ORDER BY r.created_at DESC;
END;
$$;

-- 함수 소유자 변경
ALTER FUNCTION get_my_reviews(uuid, int, int) OWNER TO postgres;

-- 실행 권한 부여
GRANT EXECUTE ON FUNCTION get_my_reviews TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_reviews TO service_role; 