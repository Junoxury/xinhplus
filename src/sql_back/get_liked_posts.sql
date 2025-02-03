CREATE OR REPLACE FUNCTION get_liked_posts(
  p_user_id uuid,
  p_sort_by text DEFAULT 'created_at',  -- 'created_at', 'view_count', 'like_count'
  p_page_size int DEFAULT 8,
  p_page int DEFAULT 1
)
RETURNS TABLE (
  id bigint,
  title varchar(255),
  content text,
  thumbnail_url text,
  created_at timestamptz,
  updated_at timestamptz,
  published_at timestamptz,
  status post_status,
  view_count integer,
  like_count integer,
  comment_count integer,
  author_id uuid,
  slug varchar(255),
  meta_description text,
  tags json,
  author_name text,
  author_avatar_url text,
  total_count bigint,
  has_next_page boolean,
  liked_at timestamptz
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
  WITH liked_posts AS (
    SELECT DISTINCT
      p.*,
      pl.created_at as liked_at,
      u.raw_user_meta_data->>'full_name' as author_name,
      u.raw_user_meta_data->>'avatar_url' as author_avatar_url
    FROM posts p
    JOIN post_likes pl ON p.id = pl.post_id
    LEFT JOIN auth.users u ON p.author_id = u.id
    WHERE pl.user_id = p_user_id
      AND p.status = 'published'
  ),
  post_tags AS (
    SELECT 
      pt.post_id,
      json_agg(
        json_build_object(
          'id', t.id,
          'name', t.name,
          'slug', t.slug
        )
      ) as tags
    FROM posts_tags pt
    JOIN tags t ON t.id = pt.tag_id
    GROUP BY pt.post_id
  ),
  ranked_posts AS (
    SELECT 
      p.*,
      ROW_NUMBER() OVER (
        ORDER BY 
          CASE p_sort_by
            WHEN 'created_at' THEN extract(epoch from p.liked_at)
            WHEN 'view_count' THEN p.view_count
            WHEN 'like_count' THEN p.like_count
            ELSE extract(epoch from p.liked_at)
          END DESC,
          p.id DESC
      ) as row_num
    FROM liked_posts p
  )
  SELECT 
    r.id,
    r.title,
    r.content,
    r.thumbnail_url,
    r.created_at,
    r.updated_at,
    r.published_at,
    r.status,
    r.view_count,
    r.like_count,
    r.comment_count,
    r.author_id,
    r.slug,
    r.meta_description,
    COALESCE(pt.tags, '[]'::json),
    r.author_name,
    r.author_avatar_url,
    (SELECT COUNT(*) FROM liked_posts) as total_count,
    (SELECT COUNT(*) FROM liked_posts) > (v_offset + p_page_size) as has_next_page,
    r.liked_at
  FROM ranked_posts r
  LEFT JOIN post_tags pt ON r.id = pt.post_id
  WHERE r.row_num > v_offset 
    AND r.row_num <= (v_offset + p_page_size)
  ORDER BY r.row_num;
END;
$$;

COMMENT ON FUNCTION get_liked_posts IS '
사용 예시:

-- 기본 호출 (찜한 시간 순으로 8개)
SELECT * FROM get_liked_posts(
  p_user_id := ''550e8400-e29b-41d4-a716-446655440000''
);

-- 조회수 순으로 정렬
SELECT * FROM get_liked_posts(
  p_user_id := ''550e8400-e29b-41d4-a716-446655440000'',
  p_sort_by := ''view_count'',
  p_page_size := 8,
  p_page := 1
);
';

-- 함수 소유자 변경
ALTER FUNCTION get_liked_posts(uuid, text, int, int) OWNER TO postgres;

-- 실행 권한 부여
GRANT EXECUTE ON FUNCTION get_liked_posts TO authenticated;
GRANT EXECUTE ON FUNCTION get_liked_posts TO service_role; 