-- 기존 함수 삭제
DROP FUNCTION IF EXISTS get_treatment_detail(bigint);

CREATE OR REPLACE FUNCTION get_treatment_detail(
    p_treatment_id bigint
) RETURNS TABLE (
    id bigint,
    hospital_id bigint,
    hospital_name varchar(200),
    title varchar(200),
    summary varchar(200),
    detail_content text,
    city_id bigint,
    city_name varchar(200),
    thumbnail_url varchar(200),
    price integer,
    discount_price integer,
    discount_rate integer,
    rating numeric(2,1),
    view_count bigint,
    like_count bigint,
    comment_count bigint,
    is_advertised boolean,
    is_recommended boolean,
    is_discounted boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    website varchar(200),
    facebook_url varchar(200),
    zalo_id varchar(200),
    phone varchar(20),
    categories jsonb
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result RECORD;
BEGIN
    -- 조회수 증가 로직
    BEGIN
        UPDATE treatments t
        SET view_count = t.view_count + 1
        WHERE t.id = p_treatment_id;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Failed to increment view count for treatment %: %', p_treatment_id, SQLERRM;
    END;

    -- 메인 쿼리 실행 및 결과 반환
    RETURN QUERY
    WITH RECURSIVE depth3_categories AS (
        SELECT 
            tc.treatment_id as t_id,
            tc.depth2_category_id,
            jsonb_agg(
                jsonb_build_object(
                    'id', cd3.id,
                    'name', cd3.name::varchar(200)
                )
                ORDER BY cd3.id
            ) as depth3_list
        FROM (
            SELECT DISTINCT ON (treatment_id, depth2_category_id, depth3_category_id)
                treatment_id, depth2_category_id, depth3_category_id
            FROM treatment_categories
            WHERE treatment_id = p_treatment_id
        ) tc
        JOIN categories cd3 ON tc.depth3_category_id = cd3.id
        WHERE cd3.depth = 3
        GROUP BY tc.treatment_id, tc.depth2_category_id
    ),
    treatment_categories_grouped AS (
        SELECT 
            tc.treatment_id as t_id,
            jsonb_agg(
                jsonb_build_object(
                    'depth2_id', cd2.id,
                    'depth2_name', cd2.name::varchar(200),
                    'depth3_list', COALESCE(d3c.depth3_list, '[]'::jsonb)
                )
                ORDER BY cd2.id
            ) as categories
        FROM (
            SELECT DISTINCT ON (treatment_id, depth2_category_id)
                treatment_id, depth2_category_id
            FROM treatment_categories
            WHERE treatment_id = p_treatment_id
        ) tc
        JOIN categories cd2 ON tc.depth2_category_id = cd2.id AND cd2.depth = 2
        LEFT JOIN depth3_categories d3c ON 
            tc.treatment_id = d3c.t_id AND 
            tc.depth2_category_id = d3c.depth2_category_id
        GROUP BY tc.treatment_id
    )
    SELECT 
        t.id,
        t.hospital_id,
        h.name::varchar(200) as hospital_name,
        t.title::varchar(200),
        t.summary::varchar(200),
        t.detail_content,
        t.city_id,
        c.name::varchar(200) as city_name,
        t.thumbnail_url::varchar(200),
        t.price::integer,
        t.discount_price::integer,
        t.discount_rate::integer,
        t.rating::numeric(2,1),
        t.view_count,
        t.like_count,
        t.comment_count,
        t.is_advertised,
        t.is_recommended,
        t.is_discounted,
        t.created_at,
        t.updated_at,
        h.website::varchar(200),
        h.facebook_url::varchar(200),
        h.zalo_id::varchar(200),
        h.phone::varchar(20),
        COALESCE(tcg.categories, '[]'::jsonb) as categories
    FROM treatments t
    LEFT JOIN treatment_categories_grouped tcg ON t.id = tcg.t_id
    LEFT JOIN hospitals h ON t.hospital_id = h.id
    LEFT JOIN cities c ON t.city_id = c.id
    WHERE t.id = p_treatment_id;
END;
$$;

-- 사용 예시:
/*
SELECT * FROM get_treatment_detail(1);
*/ 