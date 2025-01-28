-- 1. 기존 함수가 있다면 삭제
DROP FUNCTION IF EXISTS get_hospital_detail(bigint);

-- 2. 새 함수 생성
CREATE OR REPLACE FUNCTION get_hospital_detail(
    p_hospital_id bigint
)
RETURNS TABLE (
    id bigint,
    hospital_name varchar(200),
    city_id bigint,
    business_hours text,
    address text,
    phone varchar(50),
    email varchar(100),
    website varchar(200),
    facebook_url varchar(200),
    youtube_url varchar(200),
    tiktok_url varchar(200),
    instagram_url varchar(200),
    zalo_id varchar(100),
    description text,
    thumbnail_url varchar(200),
    detail_content text,
    latitude decimal(10,8),
    longitude decimal(11,8),
    is_advertised boolean,
    is_recommended boolean,
    is_member boolean,
    has_discount boolean,
    view_count bigint,
    like_count bigint,
    average_rating decimal(2,1),
    city_name varchar(100),
    city_name_vi varchar(100),
    city_name_ko varchar(100),
    categories jsonb,
    created_at timestamptz,
    updated_at timestamptz
) AS $$
DECLARE
    v_result RECORD;
BEGIN
    -- 조회수 증가 로직
    BEGIN
        UPDATE hospitals t
        SET view_count = t.view_count + 1
        WHERE t.id = p_hospital_id;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Failed to increment view count for hospital %: %', p_hospital_id, SQLERRM;
    END;

    RETURN QUERY
    WITH RECURSIVE depth3_categories AS (
        SELECT 
            hc.hospital_id as h_id,
            hc.depth2_category_id,
            jsonb_agg(
                jsonb_build_object(
                    'id', cd3.id,
                    'label', COALESCE(cd3.shortname, cd3.name),
                    'parent_id', cd3.parent_id
                )
                ORDER BY cd3.sort_order
            ) as depth3_list
        FROM hospital_categories hc
        JOIN categories cd3 ON hc.depth3_category_id = cd3.id
        WHERE cd3.depth = 3
        AND hc.hospital_id = p_hospital_id
        GROUP BY hc.hospital_id, hc.depth2_category_id
    ),
    hospital_categories_grouped AS (
        SELECT 
            hc.hospital_id as h_id,
            jsonb_agg(
                jsonb_build_object(
                    'depth2', jsonb_build_object(
                        'id', cd2.id, 
                        'label', COALESCE(cd2.shortname, cd2.name)
                    ),
                    'depth3', COALESCE(d3c.depth3_list, '[]'::jsonb)
                )
                ORDER BY cd2.sort_order
            ) as categories
        FROM hospital_categories hc
        JOIN categories cd2 ON hc.depth2_category_id = cd2.id AND cd2.depth = 2
        LEFT JOIN depth3_categories d3c ON 
            hc.hospital_id = d3c.h_id AND 
            hc.depth2_category_id = d3c.depth2_category_id
        WHERE hc.hospital_id = p_hospital_id
        GROUP BY hc.hospital_id
    )
    SELECT 
        h.id,
        h.name as hospital_name,
        h.city_id,
        h.business_hours,
        h.address,
        h.phone,
        h.email,
        h.website,
        h.facebook_url,
        h.youtube_url,
        h.tiktok_url,
        h.instagram_url,
        h.zalo_id,
        h.description,
        h.thumbnail_url,
        h.detail_content,
        h.latitude,
        h.longitude,
        h.is_advertised,
        h.is_recommended,
        h.is_member,
        h.has_discount,
        h.view_count,
        h.like_count,
        h.average_rating,
        c.name as city_name,
        c.name_vi as city_name_vi,
        c.name_ko as city_name_ko,
        COALESCE(hcg.categories, '{}'::jsonb) as categories,
        h.created_at,
        h.updated_at
    FROM hospitals h
    LEFT JOIN cities c ON h.city_id = c.id
    LEFT JOIN hospital_categories_grouped hcg ON h.id = hcg.h_id
    WHERE h.id = p_hospital_id;
END;
$$ LANGUAGE plpgsql; 