-- 기존 함수 삭제
DROP FUNCTION IF EXISTS get_posts(text,bigint[],text,integer,integer);

-- 새로운 함수 생성
CREATE OR REPLACE FUNCTION get_posts(
  p_search TEXT DEFAULT NULL,
  p_tag_ids bigint[] DEFAULT NULL,
  p_order_by TEXT DEFAULT 'view_count', -- 'view_count', 'like_count', 'comment_count'
  p_limit INTEGER DEFAULT 8,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id bigint,
  title VARCHAR(255),
  content TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  status post_status,
  view_count INTEGER,
  like_count INTEGER,
  comment_count INTEGER,
  author_id UUID,
  slug VARCHAR(255),
  meta_description TEXT,
  tags JSON,
  author_name TEXT,
  author_avatar_url TEXT,
  total_count BIGINT,
  has_more BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_count BIGINT;
  v_filtered_count BIGINT;
BEGIN
  -- 전체 게시글 수 계산
  WITH filtered_posts AS (
    SELECT DISTINCT p.*
    FROM posts p
    LEFT JOIN posts_tags pt ON p.id = pt.post_id
    WHERE 
      (p_search IS NULL OR 
        (
          p.title ILIKE '%' || p_search || '%' OR 
          p.content ILIKE '%' || p_search || '%'
        )
      )
      AND
      (p_tag_ids IS NULL OR 
        pt.tag_id = ANY(p_tag_ids)
      )
      AND p.status = 'published'
  )
  SELECT COUNT(*) INTO v_filtered_count FROM filtered_posts;

  RETURN QUERY
  WITH post_tags AS (
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
  filtered_posts AS (
    SELECT DISTINCT p.*
    FROM posts p
    LEFT JOIN posts_tags pt ON p.id = pt.post_id
    WHERE 
      (p_search IS NULL OR 
        (
          p.title ILIKE '%' || p_search || '%' OR 
          p.content ILIKE '%' || p_search || '%'
        )
      )
      AND
      (p_tag_ids IS NULL OR 
        pt.tag_id = ANY(p_tag_ids)
      )
      AND p.status = 'published'
  )
  SELECT 
    fp.id,
    fp.title,
    fp.content,
    fp.thumbnail_url,
    fp.created_at,
    fp.updated_at,
    fp.published_at,
    fp.status,
    fp.view_count,
    fp.like_count,
    fp.comment_count,
    fp.author_id,
    fp.slug,
    fp.meta_description,
    COALESCE(pt.tags, '[]'::json),
    u.raw_user_meta_data->>'full_name' as author_name,
    u.raw_user_meta_data->>'avatar_url' as author_avatar_url,
    v_filtered_count as total_count,
    (v_filtered_count > p_offset + p_limit) as has_more
  FROM filtered_posts fp
  LEFT JOIN post_tags pt ON fp.id = pt.post_id
  LEFT JOIN auth.users u ON fp.author_id = u.id
  ORDER BY
    CASE p_order_by
      WHEN 'view_count' THEN fp.view_count
      WHEN 'like_count' THEN fp.like_count
      WHEN 'comment_count' THEN fp.comment_count
    END DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- 함수 사용 권한 설정
GRANT EXECUTE ON FUNCTION get_posts TO authenticated;
GRANT EXECUTE ON FUNCTION get_posts TO service_role;

-- 사용 예시:
-- 기본 조회 (조회수 순)
-- SELECT * FROM get_posts();

-- 검색어로 조회
-- SELECT * FROM get_posts('쌍커풀');

-- 특정 태그로 조회
-- SELECT * FROM get_posts(p_tag_ids => ARRAY[1,2]);

-- 좋아요 순으로 정렬
-- SELECT * FROM get_posts(p_order_by => 'like_count');

-- 검색어와 태그 동시 적용
-- SELECT * FROM get_posts('성형', ARRAY[1,2], 'comment_count'); 