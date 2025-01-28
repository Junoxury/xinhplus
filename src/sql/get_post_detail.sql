CREATE OR REPLACE FUNCTION get_post_detail(
  p_post_id BIGINT
)
RETURNS TABLE (
  -- 포스트 기본 정보
  id BIGINT,
  title VARCHAR(255),
  content TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  view_count INTEGER,
  like_count INTEGER,
  comment_count INTEGER,
  
  -- 작성자 정보
  author_id UUID,
  author_name TEXT,
  author_avatar_url TEXT,
  
  -- 태그 정보
  tags JSON,
  
  -- 이전글/다음글 정보
  prev_post JSON,
  next_post JSON
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 조회수 증가
  UPDATE posts p
  SET view_count = p.view_count + 1 
  WHERE p.id = p_post_id;

  RETURN QUERY
  WITH post_tags AS (
    -- 현재 포스트의 태그 정보
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
    WHERE pt.post_id = p_post_id
    GROUP BY pt.post_id
  ),
  prev_post AS (
    -- 이전 글
    SELECT json_build_object(
      'id', p.id,
      'title', p.title,
      'thumbnail_url', p.thumbnail_url
    ) as post
    FROM posts p
    WHERE p.id < p_post_id
      AND p.status = 'published'
    ORDER BY p.id DESC
    LIMIT 1
  ),
  next_post AS (
    -- 다음 글
    SELECT json_build_object(
      'id', p.id,
      'title', p.title,
      'thumbnail_url', p.thumbnail_url
    ) as post
    FROM posts p
    WHERE p.id > p_post_id
      AND p.status = 'published'
    ORDER BY p.id ASC
    LIMIT 1
  )
  SELECT 
    p.id,
    p.title,
    p.content,
    p.thumbnail_url,
    p.created_at,
    p.updated_at,
    p.published_at,
    p.view_count,
    p.like_count,
    p.comment_count,
    p.author_id,
    u.raw_user_meta_data->>'full_name' as author_name,
    u.raw_user_meta_data->>'avatar_url' as author_avatar_url,
    COALESCE(pt.tags, '[]'::json) as tags,
    COALESCE((SELECT post FROM prev_post), null::json) as prev_post,
    COALESCE((SELECT post FROM next_post), null::json) as next_post
  FROM posts p
  LEFT JOIN post_tags pt ON p.id = pt.post_id
  LEFT JOIN auth.users u ON p.author_id = u.id
  WHERE p.id = p_post_id AND p.status = 'published';
END;
$$;

-- 함수 사용 권한 설정
GRANT EXECUTE ON FUNCTION get_post_detail TO authenticated;
GRANT EXECUTE ON FUNCTION get_post_detail TO service_role;

-- 사용 예시:
-- SELECT * FROM get_post_detail(1); 