CREATE OR REPLACE FUNCTION get_my_comments(
  p_user_id uuid,
  p_page_size int DEFAULT 4,
  p_page int DEFAULT 1
) RETURNS TABLE (
  id bigint,                    -- 댓글 ID
  content text,                 -- 댓글 내용
  created_at timestamptz,       -- 댓글 작성일
  review_id bigint,            -- 리뷰 ID
  review_title varchar,         -- 리뷰 제목
  treatment_id bigint,         -- 시술 ID
  treatment_title varchar,      -- 시술 이름
  total_count bigint,          -- 전체 댓글 수
  has_next_page boolean        -- 다음 페이지 존재 여부
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
  WITH my_comments AS (
    SELECT 
      rc.id,
      rc.content,
      rc.created_at,
      r.id as review_id,
      r.title as review_title,
      r.treatment_id,
      t.title as treatment_title
    FROM review_comments rc
    JOIN reviews r ON rc.review_id = r.id
    LEFT JOIN treatments t ON r.treatment_id = t.id
    WHERE rc.author_id = p_user_id
  ),
  ranked_comments AS (
    SELECT 
      c.*,
      ROW_NUMBER() OVER (ORDER BY c.created_at DESC) as row_num
    FROM my_comments c
  )
  SELECT 
    r.id,
    r.content,
    r.created_at,
    r.review_id,
    r.review_title,
    r.treatment_id,
    r.treatment_title,
    (SELECT COUNT(*) FROM my_comments) as total_count,
    (SELECT COUNT(*) FROM my_comments) > (v_offset + p_page_size) as has_next_page
  FROM ranked_comments r
  WHERE r.row_num > v_offset 
    AND r.row_num <= (v_offset + p_page_size)
  ORDER BY r.created_at DESC;
END;
$$;

-- 함수 소유자 변경
ALTER FUNCTION get_my_comments(uuid, int, int) OWNER TO postgres;

-- 실행 권한 부여
GRANT EXECUTE ON FUNCTION get_my_comments TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_comments TO service_role;

-- 사용 예시:
/*
SELECT * FROM get_my_comments(
  p_user_id := '550e8400-e29b-41d4-a716-446655440000',
  p_page_size := 4,
  p_page := 1
);
*/ 