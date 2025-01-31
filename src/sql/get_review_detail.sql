-- 기존 함수 삭제
DROP FUNCTION IF EXISTS get_review_detail(BIGINT);
DROP FUNCTION IF EXISTS get_review_detail(BIGINT, UUID);

-- 새 함수 생성 (p_user_id 파라미터 추가)
CREATE OR REPLACE FUNCTION get_review_detail(
  p_review_id BIGINT,
  p_user_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- 조회수 증가를 먼저 실행
  UPDATE reviews 
  SET view_count = view_count + 1 
  WHERE id = p_review_id;

  -- 기존 쿼리 수정
  WITH review_base AS (
    SELECT 
      r.id,
      r.title,
      r.content,
      r.rating,
      r.view_count,
      r.like_count,
      r.comment_count,
      r.created_at,
      r.is_best,
      r.is_google,
      r.author_id,
      -- profile 내부의 nickname을 가져오고, 없으면 email 사용
      COALESCE(
        (u.raw_user_meta_data->>'profile')::jsonb->>'nickname',
        mask_email(u.raw_user_meta_data->>'email')
      ) as author_name,
      -- profile 내부의 avatar_url
      ((u.raw_user_meta_data->>'profile')::jsonb->>'avatar_url')::VARCHAR as author_image,
      (u.raw_user_meta_data->>'email')::VARCHAR as author_email,
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
      t.summary as treatment_summary,
      -- 좋아요 상태 확인
      CASE 
        WHEN p_user_id IS NULL THEN FALSE
        ELSE EXISTS (
          SELECT 1 FROM review_likes rl 
          WHERE rl.review_id = r.id AND rl.user_id = p_user_id
        )
      END as is_liked
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
          'type', ri.image_type,  -- 이미지 타입을 그대로 사용
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
          'author_name', COALESCE(
            (u.raw_user_meta_data->>'profile')::jsonb->>'nickname',
            mask_email(u.raw_user_meta_data->>'email')
          ),
          'author_image', ((u.raw_user_meta_data->>'profile')::jsonb->>'avatar_url')::VARCHAR,
          'author_email', (u.raw_user_meta_data->>'email')::VARCHAR,
          'like_count', rc.like_count,
          'created_at', rc.created_at,
          'replies', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'id', rc2.id,
                'content', rc2.content,
                'author_id', rc2.author_id,
                'author_name', COALESCE(
                  (u2.raw_user_meta_data->>'profile')::jsonb->>'nickname',
                  mask_email(u2.raw_user_meta_data->>'email')
                ),
                'author_image', ((u2.raw_user_meta_data->>'profile')::jsonb->>'avatar_url')::VARCHAR,
                'author_email', (u2.raw_user_meta_data->>'email')::VARCHAR,
                'like_count', rc2.like_count,
                'created_at', rc2.created_at
              ) ORDER BY rc2.created_at ASC
            )
            FROM review_comments rc2
            LEFT JOIN auth.users u2 ON rc2.author_id = u2.id
            WHERE rc2.parent_id = rc.id
          )
        ) ORDER BY rc.created_at DESC
      ) as cmt_data
    FROM review_comments rc
    LEFT JOIN auth.users u ON rc.author_id = u.id
    WHERE rc.review_id = p_review_id
    AND rc.parent_id IS NULL
  )
  SELECT 
    jsonb_build_object(
      'id', rb.id,
      'title', rb.title,
      'content', rb.content,
      'rating', rb.rating,
      'view_count', rb.view_count,
      'like_count', rb.like_count,
      'comment_count', rb.comment_count,
      'created_at', rb.created_at,
      'is_best', rb.is_best,
      'is_google', rb.is_google,
      'author_id', rb.author_id,
      'author_name', rb.author_name,
      'author_image', rb.author_image,
      'author_email', rb.author_email,
      'hospital_id', rb.hospital_id,
      'hospital_name', rb.hospital_name,
      'hospital_address', rb.hospital_address,
      'hospital_phone', rb.hospital_phone,
      'hospital_rating', rb.hospital_rating,
      'hospital_review_count', rb.hospital_review_count,
      'hospital_image', rb.hospital_image,
      'treatment_id', rb.treatment_id,
      'treatment_name', rb.treatment_name,
      'treatment_price', rb.treatment_price,
      'treatment_discount_rate', rb.treatment_discount_rate,
      'treatment_discount_price', rb.treatment_discount_price,
      'treatment_rating', rb.treatment_rating,
      'treatment_summary', rb.treatment_summary,
      'categories', COALESCE(rc.cat_data, '{}'::jsonb),
      'images', COALESCE(ri.img_data, '[]'::jsonb),
      'comments', COALESCE(rco.cmt_data, '[]'::jsonb),
      'is_liked', rb.is_liked
    ) INTO result
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

  RETURN result;
END;
$$;

-- email 마스킹 함수 추가
CREATE OR REPLACE FUNCTION mask_email(email VARCHAR) 
RETURNS VARCHAR AS $$
BEGIN
  RETURN CASE 
    WHEN position('@' in email) > 0 THEN
      substring(email, 1, LEAST(5, position('@' in email) - 1)) || '...'
    ELSE email
  END;
END;
$$ LANGUAGE plpgsql; 