-- 새로운 함수 생성
CREATE OR REPLACE FUNCTION get_reviews(
  p_treatment_id BIGINT DEFAULT NULL,
  p_hospital_id BIGINT DEFAULT NULL,
  p_depth2_id BIGINT DEFAULT NULL,
  p_depth2_treatment_id BIGINT DEFAULT NULL,
  p_depth3_id BIGINT DEFAULT NULL,
  p_depth3_treatment_id BIGINT DEFAULT NULL,
  p_is_recommended BOOLEAN DEFAULT FALSE,
  p_has_discount BOOLEAN DEFAULT FALSE,
  p_is_member BOOLEAN DEFAULT FALSE,
  p_is_ad BOOLEAN DEFAULT FALSE,
  p_location VARCHAR DEFAULT NULL,
  p_best_count INT DEFAULT 5,
  p_sort_by VARCHAR DEFAULT 'latest', -- 'latest' or 'views'
  p_limit INT DEFAULT 10,
  p_offset INT DEFAULT 0,
  p_min_price BIGINT DEFAULT 0,
  p_max_price BIGINT DEFAULT 100000000
) RETURNS TABLE (
  id BIGINT,
  title VARCHAR,
  content TEXT,
  before_image TEXT,
  after_image TEXT,
  rating DECIMAL,
  view_count INTEGER,
  like_count INTEGER,
  comment_count BIGINT,
  author_id UUID,
  author_name VARCHAR,
  author_image VARCHAR,
  created_at TIMESTAMPTZ,
  treatment_id BIGINT,
  treatment_name VARCHAR,
  hospital_id BIGINT,
  hospital_name VARCHAR,
  location VARCHAR,
  categories JSONB,
  is_best BOOLEAN,
  is_google BOOLEAN,
  total_count BIGINT,
  has_more BOOLEAN
) LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH filtered_reviews AS (
    SELECT DISTINCT ON (r.id) r.*, c.name as city_name
    FROM reviews r
    LEFT JOIN hospitals h ON r.hospital_id = h.id
    LEFT JOIN cities c ON h.city_id = c.id
    LEFT JOIN treatments t ON r.treatment_id = t.id
    INNER JOIN treatment_categories tc ON t.id = tc.treatment_id
    WHERE (p_treatment_id IS NULL OR r.treatment_id = p_treatment_id)
    AND (p_hospital_id IS NULL OR r.hospital_id = p_hospital_id)
    AND (p_location IS NULL OR h.city_id = p_location::bigint)
    AND (t.price >= p_min_price AND t.price <= p_max_price)
    AND (NOT p_is_recommended OR h.is_recommended = true)
    AND (NOT p_has_discount OR t.is_discounted = true)
    AND (NOT p_is_member OR h.is_member = true)
    AND (NOT p_is_ad OR t.is_advertised = true)
    AND (p_depth2_id IS NULL OR tc.depth2_category_id = p_depth2_id)
    AND (p_depth3_id IS NULL OR tc.depth3_category_id = p_depth3_id)
    ORDER BY r.id, r.created_at DESC
  ),
  treatment_categories_json AS (
    SELECT DISTINCT ON (tc.treatment_id) 
      tc.treatment_id,
      jsonb_build_object(
        'depth2', jsonb_build_object(
          'id', cat2.id,
          'name', cat2.name,
          'depth', cat2.depth
        ),
        'depth3', jsonb_build_object(
          'id', cat3.id,
          'name', cat3.name,
          'depth', cat3.depth
        )
      ) as categories
    FROM treatment_categories tc
    LEFT JOIN categories cat2 ON tc.depth2_category_id = cat2.id
    LEFT JOIN categories cat3 ON tc.depth3_category_id = cat3.id
    ORDER BY tc.treatment_id, tc.id  -- treatment_id로 그룹화하고 가장 첫 번째 레코드 선택
  ),
  total_counts AS (
    SELECT COUNT(*) as total
    FROM filtered_reviews
  ),
  review_images AS (
    SELECT 
      ri.review_id,
      MAX(CASE WHEN ri.image_type = 'before' THEN ri.image_url END) as before_image,
      MAX(CASE WHEN ri.image_type = 'after' THEN ri.image_url END) as after_image
    FROM review_images ri
    GROUP BY ri.review_id
  ),
  best_reviews AS (
    SELECT r.*
    FROM filtered_reviews r
    WHERE r.is_best = true
    ORDER BY 
      CASE p_sort_by
        WHEN 'latest' THEN extract(epoch from r.created_at)
        WHEN 'view_count' THEN r.view_count
        WHEN 'like_count' THEN r.like_count
        ELSE extract(epoch from r.created_at)
      END DESC NULLS LAST
    LIMIT p_best_count
  ),
  normal_reviews AS (
    SELECT r.*
    FROM filtered_reviews r
    WHERE r.id NOT IN (SELECT br.id FROM best_reviews br)
    ORDER BY 
      CASE p_sort_by
        WHEN 'latest' THEN extract(epoch from r.created_at)
        WHEN 'view_count' THEN r.view_count
        WHEN 'like_count' THEN r.like_count
        ELSE extract(epoch from r.created_at)
      END DESC NULLS LAST
    LIMIT p_limit
    OFFSET p_offset
  ),
  has_more_check AS (
    SELECT (
      (SELECT COUNT(*) FROM filtered_reviews) > 
      CASE 
        WHEN p_offset = 0 THEN p_best_count + p_limit
        ELSE p_offset + p_limit
      END
    ) as has_more
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
    r.comment_count::BIGINT,
    r.author_id,
    COALESCE(
      (u.raw_user_meta_data->>'profile')::jsonb->>'nickname',
      u.raw_user_meta_data->>'email'
    )::VARCHAR as author_name,
    ((u.raw_user_meta_data->>'profile')::jsonb->>'avatar_url')::VARCHAR as author_image,
    r.created_at,
    r.treatment_id,
    t.title as treatment_name,
    r.hospital_id,
    h.name as hospital_name,
    r.city_name as location,
    tcj.categories,
    r.is_best,
    r.is_google,
    tc.total as total_count,
    hmc.has_more
  FROM (
    SELECT * FROM best_reviews
    UNION ALL
    SELECT * FROM normal_reviews
  ) r
  CROSS JOIN total_counts tc
  CROSS JOIN has_more_check hmc
  LEFT JOIN review_images ri ON r.id = ri.review_id
  LEFT JOIN auth.users u ON r.author_id = u.id
  LEFT JOIN treatments t ON r.treatment_id = t.id
  LEFT JOIN hospitals h ON r.hospital_id = h.id
  LEFT JOIN treatment_categories_json tcj ON r.treatment_id = tcj.treatment_id
  ORDER BY r.is_best DESC,
    CASE p_sort_by
      WHEN 'latest' THEN extract(epoch from r.created_at)
      WHEN 'view_count' THEN r.view_count
      WHEN 'like_count' THEN r.like_count
      ELSE extract(epoch from r.created_at)
    END DESC NULLS LAST;
END;
$$;

-- 샘플 쿼리 모음
COMMENT ON FUNCTION get_reviews IS '
사용 예시:

-- 1. 기본 호출 (최신순 10개)
SELECT * FROM get_reviews();

-- 2. 특정 시술의 리뷰 조회 (조회순)
SELECT * FROM get_reviews(
  p_treatment_id := 1,
  p_sort_by := ''views''
);

-- 3. 특정 병원의 베스트 리뷰 3개 + 일반 리뷰 5개
SELECT * FROM get_reviews(
  p_hospital_id := 2,
  p_best_count := 3,
  p_limit := 5
);

-- 4. 페이지네이션 예시 (2번째 페이지, 페이지당 8개)
SELECT * FROM get_reviews(
  p_limit := 8,
  p_offset := 8
);

-- 5. 여러 조건 조합
SELECT * FROM get_reviews(
  p_treatment_id := 1,
  p_hospital_id := 3,
  p_location := ''Hanoi'',
  p_is_recommended := true,
  p_best_count := 2,
  p_sort_by := ''latest'',
  p_limit := 10,
  p_offset := 0
);

-- 6. 베스트 리뷰만 조회
SELECT * FROM get_reviews(
  p_best_count := 5,
  p_limit := 0
);

-- 7. 특정 카테고리(depth2)의 리뷰 조회
SELECT * FROM get_reviews(
  p_depth2_id := 1,
  p_sort_by := ''views'',
  p_best_count := 3,
  p_limit := 12
);

-- 8. 할인 중인 시술의 리뷰만 조회
SELECT * FROM get_reviews(
  p_has_discount := true,
  p_sort_by := ''latest'',
  p_best_count := 2,
  p_limit := 10
);

-- 9. 회원 전용 리뷰 조회
SELECT * FROM get_reviews(
  p_is_member := true,
  p_best_count := 0,
  p_limit := 15
);

-- 10. 광고 리뷰 우선 조회
SELECT * FROM get_reviews(
  p_is_ad := true,
  p_sort_by := ''views'',
  p_best_count := 5,
  p_limit := 10
);
'; 