CREATE OR REPLACE FUNCTION get_members_list(
  search_text TEXT DEFAULT NULL,
  gender_filter TEXT DEFAULT NULL,
  provider_filter TEXT DEFAULT NULL,
  city_filter INTEGER DEFAULT NULL,
  category_filter INTEGER DEFAULT NULL,
  page_number INTEGER DEFAULT 1,
  items_per_page INTEGER DEFAULT 10
)
RETURNS TABLE (
  total_count BIGINT,
  id UUID,
  email VARCHAR,
  nickname VARCHAR,
  gender VARCHAR,
  phone VARCHAR,
  avatar_url VARCHAR,
  provider VARCHAR,
  last_sign_in_at VARCHAR,
  city_name VARCHAR,
  categories VARCHAR[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH filtered_users AS (
    SELECT 
      au.id,
      au.email,
      au.raw_user_meta_data,
      au.raw_app_meta_data,
      au.last_sign_in_at
    FROM auth.users au
    WHERE 
      CASE 
        WHEN search_text IS NOT NULL THEN 
          au.email ILIKE '%' || search_text || '%' OR 
          (au.raw_user_meta_data->'profile'->>'nickname')::VARCHAR ILIKE '%' || search_text || '%' OR
          (au.raw_user_meta_data->'profile'->>'phone')::VARCHAR ILIKE '%' || search_text || '%'
        ELSE true
      END
      AND
      CASE 
        WHEN gender_filter IS NOT NULL THEN 
          (au.raw_user_meta_data->'profile'->>'gender')::VARCHAR = gender_filter
        ELSE true
      END
      AND
      CASE 
        WHEN provider_filter IS NOT NULL THEN 
          (au.raw_app_meta_data->>'provider')::VARCHAR = provider_filter
        ELSE true
      END
      AND
      CASE 
        WHEN city_filter IS NOT NULL THEN 
          (au.raw_user_meta_data->>'city_id')::INTEGER = city_filter
        ELSE true
      END
      AND
      CASE 
        WHEN category_filter IS NOT NULL THEN 
          category_filter::TEXT = ANY(
            SELECT jsonb_array_elements_text(au.raw_user_meta_data->'preferred_categories')::VARCHAR
          )
        ELSE true
      END
  ),
  total AS (
    SELECT COUNT(*) as total_count FROM filtered_users
  ),
  user_data AS (
    SELECT 
      fu.id,
      fu.email::VARCHAR as email,
      (fu.raw_user_meta_data->'profile'->>'nickname')::VARCHAR as nickname,
      (fu.raw_user_meta_data->'profile'->>'gender')::VARCHAR as gender,
      (fu.raw_user_meta_data->'profile'->>'phone')::VARCHAR as phone,
      (fu.raw_user_meta_data->'profile'->>'avatar_url')::VARCHAR as avatar_url,
      (fu.raw_app_meta_data->>'provider')::VARCHAR as provider,
      fu.last_sign_in_at,
      c.name::VARCHAR as city_name,
      COALESCE(
        array_agg(DISTINCT cat.name::VARCHAR) FILTER (WHERE cat.name IS NOT NULL),
        ARRAY[]::VARCHAR[]
      ) as categories
    FROM filtered_users fu
    LEFT JOIN cities c ON (fu.raw_user_meta_data->>'city_id')::INTEGER = c.id
    LEFT JOIN LATERAL (
      SELECT jsonb_array_elements_text(fu.raw_user_meta_data->'preferred_categories')::INTEGER as category_id
    ) cats ON true
    LEFT JOIN categories cat ON cat.id = cats.category_id
    GROUP BY 
      fu.id, 
      fu.email, 
      fu.raw_user_meta_data,
      fu.raw_app_meta_data,
      fu.last_sign_in_at,
      c.name
  )
  SELECT 
    t.total_count,
    ud.id,
    ud.email,
    ud.nickname,
    ud.gender,
    ud.phone,
    ud.avatar_url,
    ud.provider,
    ud.last_sign_in_at::VARCHAR,
    ud.city_name,
    ud.categories
  FROM total t
  CROSS JOIN (
    SELECT *
    FROM user_data
    ORDER BY last_sign_in_at DESC
    LIMIT items_per_page
    OFFSET (page_number - 1) * items_per_page
  ) ud;
END;
$$;

-- RPC 함수에 대한 실행 권한 부여
GRANT EXECUTE ON FUNCTION get_members_list TO authenticated;
GRANT EXECUTE ON FUNCTION get_members_list TO service_role;
