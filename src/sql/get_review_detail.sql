-- 기존 함수 삭제
DROP FUNCTION IF EXISTS get_review_detail(BIGINT);

-- 새 함수 생성
CREATE OR REPLACE FUNCTION get_review_detail(p_review_id BIGINT)
RETURNS TABLE (
  -- 리뷰 기본 정보
  id BIGINT,
  title VARCHAR(255),
  content TEXT,
  rating DECIMAL(2,1),
  view_count INTEGER,
  like_count INTEGER,
  comment_count BIGINT,
  created_at TIMESTAMPTZ,
  is_best BOOLEAN,
  is_google BOOLEAN,
  
  -- 작성자 정보
  author_id UUID,
  author_name VARCHAR(255),
  author_image VARCHAR(255),
  
  -- 병원 정보
  hospital_id BIGINT,
  hospital_name VARCHAR(200),
  hospital_address TEXT,
  hospital_phone VARCHAR(50),
  hospital_rating DECIMAL(2,1),
  hospital_review_count BIGINT,
  hospital_image VARCHAR(200),
  
  -- 시술 정보
  treatment_id BIGINT,
  treatment_name VARCHAR(255),
  treatment_price NUMERIC(12,2),
  treatment_discount_rate INTEGER,
  treatment_discount_price NUMERIC(12,2),
  treatment_rating DECIMAL(2,1),
  treatment_summary TEXT,
  
  -- 카테고리 정보
  categories JSONB,
  
  -- 이미지 정보
  images JSONB,
  
  -- 댓글 정보
  comments JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH review_base AS (
    SELECT 
      r.id,
      r.title,
      r.content,
      r.rating,
      r.view_count,
      r.like_count,
      h.comment_count,
      r.created_at,
      r.is_best,
      r.is_google,
      r.author_id,
      (u.raw_user_meta_data->>'full_name')::VARCHAR as author_name,
      (u.raw_user_meta_data->>'avatar_url')::VARCHAR as author_image,
      r.hospital_id,
      h.name as hospital_name,
      h.address as hospital_address,
      h.phone as hospital_phone,
      h.average_rating as hospital_rating,
      h.comment_count as hospital_review_count,
      h.thumbnail_url as hospital_image,
      r.treatment_id,
      t.title as treatment_name,
      t.price as treatment_price,
      t.discount_rate as treatment_discount_rate,
      t.discount_price as treatment_discount_price,
      t.rating as treatment_rating,
      t.summary as treatment_summary
    FROM reviews r
    LEFT JOIN auth.users u ON r.author_id = u.id
    LEFT JOIN hospitals h ON r.hospital_id = h.id
    LEFT JOIN treatments t ON r.treatment_id = t.id
    WHERE r.id = p_review_id
  ),
  review_categories AS (
    SELECT 
      tc.treatment_id,
      jsonb_build_object(
        'depth2', jsonb_build_object(
          'id', cat2.id,
          'name', cat2.name
        ),
        'depth3', jsonb_build_object(
          'id', cat3.id,
          'name', cat3.name
        )
      ) as cat_data
    FROM treatment_categories tc
    LEFT JOIN categories cat2 ON tc.depth2_category_id = cat2.id
    LEFT JOIN categories cat3 ON tc.depth3_category_id = cat3.id
    WHERE tc.treatment_id = (SELECT rb.treatment_id FROM review_base rb)
  ),
  review_images AS (
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'id', ri.id,
          'url', ri.image_url,
          'type', ri.image_type,
          'order', ri.display_order
        ) ORDER BY ri.display_order
      ) as img_data
    FROM review_images ri
    WHERE ri.review_id = p_review_id
  ),
  review_comments AS (
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'id', rc.id,
          'content', rc.content,
          'author_id', rc.author_id,
          'author_name', (u.raw_user_meta_data->>'full_name')::VARCHAR,
          'author_image', (u.raw_user_meta_data->>'avatar_url')::VARCHAR,
          'like_count', rc.like_count,
          'created_at', rc.created_at,
          'replies', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'id', rc2.id,
                'content', rc2.content,
                'author_id', rc2.author_id,
                'author_name', (u2.raw_user_meta_data->>'full_name')::VARCHAR,
                'author_image', (u2.raw_user_meta_data->>'avatar_url')::VARCHAR,
                'like_count', rc2.like_count,
                'created_at', rc2.created_at
              ) ORDER BY rc2.created_at
            )
            FROM review_comments rc2
            LEFT JOIN auth.users u2 ON rc2.author_id = u2.id
            WHERE rc2.parent_id = rc.id
          )
        ) ORDER BY rc.created_at
      ) as cmt_data
    FROM review_comments rc
    LEFT JOIN auth.users u ON rc.author_id = u.id
    WHERE rc.review_id = p_review_id
    AND rc.parent_id IS NULL
  )
  SELECT
    rb.*,
    COALESCE(rc.cat_data, '{}'::jsonb) as categories,
    COALESCE(ri.img_data, '[]'::jsonb) as images,
    COALESCE(rco.cmt_data, '[]'::jsonb) as comments
  FROM review_base rb
  LEFT JOIN LATERAL (
    SELECT cat_data FROM review_categories rc2 WHERE rc2.treatment_id = rb.treatment_id LIMIT 1
  ) rc ON true
  LEFT JOIN LATERAL (
    SELECT img_data FROM review_images ri2 LIMIT 1
  ) ri ON true
  LEFT JOIN LATERAL (
    SELECT cmt_data FROM review_comments rc3 LIMIT 1
  ) rco ON true;
END;
$$; 