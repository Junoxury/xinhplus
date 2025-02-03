CREATE OR REPLACE FUNCTION get_liked_reviews(
  p_user_id uuid,
  p_sort_by text DEFAULT 'created_at',  -- 'created_at', 'views', 'like_count'
  p_page_size int DEFAULT 10,
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
  has_next_page boolean,
  liked_at timestamptz
) LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_offset int;
BEGIN
  v_offset := (p_page - 1) * p_page_size;

  RETURN QUERY
  WITH liked_reviews AS (
    SELECT DISTINCT
      r.*,
      rl.created_at as liked_at,
      c.name as city_name,
      h.name as hospital_name,
      t.title as treatment_name,
      (u.raw_user_meta_data->>'full_name')::varchar as author_name,
      (u.raw_user_meta_data->>'avatar_url')::varchar as author_image
    FROM reviews r
    JOIN review_likes rl ON r.id = rl.review_id
    LEFT JOIN hospitals h ON r.hospital_id = h.id
    LEFT JOIN cities c ON h.city_id = c.id
    LEFT JOIN treatments t ON r.treatment_id = t.id
    LEFT JOIN auth.users u ON r.author_id = u.id
    WHERE rl.user_id = p_user_id
  ),
  review_images AS (
    SELECT 
      ri.review_id,
      MAX(CASE WHEN ri.image_type = 'before' THEN ri.image_url END) as before_image,
      MAX(CASE WHEN ri.image_type = 'after' THEN ri.image_url END) as after_image
    FROM review_images ri
    GROUP BY ri.review_id
  ),
  total_count AS (
    SELECT COUNT(*) FROM liked_reviews
  ),
  ranked_reviews AS (
    SELECT 
      r.*,
      ROW_NUMBER() OVER (
        ORDER BY 
          CASE p_sort_by
            WHEN 'created_at' THEN extract(epoch from r.liked_at)
            WHEN 'views' THEN r.view_count
            WHEN 'like_count' THEN r.like_count
            ELSE extract(epoch from r.liked_at)
          END DESC,
          r.id DESC
      ) as row_num
    FROM liked_reviews r
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
    (SELECT COUNT(*) FROM liked_reviews) as total_count,
    EXISTS (
      SELECT 1 
      FROM ranked_reviews 
      WHERE row_num > (v_offset + p_page_size)
      LIMIT 1
    ) as has_next_page,
    r.liked_at
  FROM ranked_reviews r
  LEFT JOIN review_images ri ON r.id = ri.review_id
  WHERE r.row_num > v_offset 
    AND r.row_num <= (v_offset + p_page_size)
  ORDER BY r.row_num;
END;
$$;

COMMENT ON FUNCTION get_liked_reviews IS '
사용 예시:

-- 기본 호출 (찜한 시간 순으로 10개)
SELECT * FROM get_liked_reviews(
  p_user_id := ''550e8400-e29b-41d4-a716-446655440000''
);

-- 조회수 순으로 정렬, 페이지네이션
SELECT * FROM get_liked_reviews(
  p_user_id := ''550e8400-e29b-41d4-a716-446655440000'',
  p_sort_by := ''views'',
  p_page_size := 8,
  p_page := 1
);
';

ALTER FUNCTION get_liked_reviews(uuid, text, int, int) OWNER TO postgres; 