/**
CREATE TYPE treatment_category_group AS (
    depth2_id bigint,
    depth2_name text,
    depth3_list jsonb
);
*/
-- 특정 파라미터 조합의 함수 삭제
DROP FUNCTION IF EXISTS get_treatments(bigint, bigint, bigint, boolean, boolean, bigint, boolean, decimal, decimal, text, integer, integer);


CREATE OR REPLACE FUNCTION get_treatments(
    p_hospital_id bigint DEFAULT NULL,
    p_depth2_category_id bigint DEFAULT NULL,
    p_depth3_category_id bigint DEFAULT NULL,
    p_is_advertised boolean DEFAULT NULL,
    p_is_recommended boolean DEFAULT NULL,
    p_city_id bigint DEFAULT NULL,
    p_is_discounted boolean DEFAULT NULL,
    p_price_from decimal DEFAULT NULL,
    p_price_to decimal DEFAULT NULL,
    p_sort_by text DEFAULT 'view_count',  -- 'view_count', 'like_count', 'rating', 'discount_price_asc', 'discount_price_desc'
    p_limit integer DEFAULT 10,
    p_offset integer DEFAULT 0
) 
RETURNS TABLE (
    id bigint,
    hospital_id bigint,
    hospital_name varchar(200),
    hospital_phone varchar(50),
    hospital_facebook_url varchar(200),
    hospital_zalo_id varchar(100),
    title varchar(200),
    summary text,
    city_id bigint,
    city_name varchar(100),
    rating decimal(2,1),
    comment_count bigint,
    view_count bigint,
    like_count bigint,
    thumbnail_url varchar(200),
    detail_content text,
    is_advertised boolean,
    is_recommended boolean,
    is_discounted boolean,
    price decimal(12,2),
    discount_price decimal(12,2),
    discount_rate integer,
    categories jsonb,
    created_at timestamptz,
    updated_at timestamptz,
    total_count bigint,
    has_next boolean
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered_treatments AS (
        SELECT t.*
        FROM treatments t
        WHERE 
            (p_hospital_id IS NULL OR t.hospital_id = p_hospital_id)
            AND (p_depth2_category_id IS NULL OR EXISTS (
                SELECT 1 FROM treatment_categories tc 
                WHERE tc.treatment_id = t.id 
                AND tc.depth2_category_id = p_depth2_category_id
            ))
            AND (p_depth3_category_id IS NULL OR EXISTS (
                SELECT 1 FROM treatment_categories tc 
                WHERE tc.treatment_id = t.id 
                AND tc.depth3_category_id = p_depth3_category_id
            ))
            AND (p_is_advertised IS NULL OR t.is_advertised = p_is_advertised)
            AND (p_is_recommended IS NULL OR t.is_recommended = p_is_recommended)
            AND (p_city_id IS NULL OR t.city_id = p_city_id)
            AND (p_is_discounted IS NULL OR t.is_discounted = p_is_discounted)
            AND (p_price_from IS NULL OR t.discount_price >= p_price_from)
            AND (p_price_to IS NULL OR t.discount_price <= p_price_to)
    ),
    total_count AS (
        SELECT COUNT(*) as count FROM filtered_treatments
    ),
    sorted_treatments AS (
        SELECT t.*,
            CASE 
                WHEN p_sort_by = 'view_count' THEN t.view_count
                WHEN p_sort_by = 'like_count' THEN t.like_count
                WHEN p_sort_by = 'rating' THEN t.rating
                WHEN p_sort_by = 'discount_price_asc' THEN t.discount_price
                WHEN p_sort_by = 'discount_price_desc' THEN t.discount_price
                ELSE t.view_count
            END as sort_value
        FROM filtered_treatments t
    ),
    ordered_treatments AS (
        SELECT st.*,
            ROW_NUMBER() OVER (
                ORDER BY 
                    CASE WHEN p_sort_by = 'discount_price_asc' THEN sort_value END ASC,
                    CASE WHEN p_sort_by != 'discount_price_asc' THEN sort_value END DESC,
                    st.id DESC
            ) as row_num
        FROM sorted_treatments st
    ),
    paginated_treatments AS (
        SELECT *
        FROM ordered_treatments
        WHERE row_num > p_offset
        AND row_num <= p_offset + p_limit + 1
    ),
    depth3_categories AS (
        SELECT 
            tc.treatment_id,
            tc.depth2_category_id,
            c2.name as depth2_name,
            jsonb_agg(
                jsonb_build_object(
                    'id', c3.id,
                    'name', c3.name
                )
            ) AS depth3_list
        FROM treatment_categories tc
        JOIN categories c2 ON tc.depth2_category_id = c2.id
        JOIN categories c3 ON tc.depth3_category_id = c3.id
        GROUP BY tc.treatment_id, tc.depth2_category_id, c2.name
    ),
    treatment_categories_grouped AS (
        SELECT 
            treatment_id,
            jsonb_agg(
                jsonb_build_object(
                    'depth2_id', depth2_category_id,
                    'depth2_name', depth2_name,
                    'depth3_list', depth3_list
                )
            ) AS categories
        FROM depth3_categories
        GROUP BY treatment_id
    )
    SELECT 
        t.id,
        t.hospital_id,
        h.name AS hospital_name,
        h.phone AS hospital_phone,
        h.facebook_url AS hospital_facebook_url,
        h.zalo_id AS hospital_zalo_id,
        t.title,
        t.summary,
        t.city_id,
        c.name AS city_name,
        t.rating,
        t.comment_count,
        t.view_count,
        t.like_count,
        t.thumbnail_url,
        t.detail_content,
        t.is_advertised,
        t.is_recommended,
        t.is_discounted,
        t.price,
        t.discount_price,
        t.discount_rate,
        tcg.categories,
        t.created_at,
        t.updated_at,
        tc.count as total_count,
        EXISTS (
            SELECT 1 FROM ordered_treatments 
            WHERE row_num = p_offset + p_limit + 1
        ) as has_next
    FROM paginated_treatments t
    JOIN hospitals h ON t.hospital_id = h.id
    JOIN cities c ON t.city_id = c.id
    LEFT JOIN treatment_categories_grouped tcg ON t.id = tcg.treatment_id
    CROSS JOIN total_count tc
    WHERE t.row_num <= p_offset + p_limit
    ORDER BY t.row_num;
END;
$$ LANGUAGE plpgsql;

-- 사용 예시:
/*
SELECT * FROM get_treatments(
    p_hospital_id := 1,
    p_depth2_category_id := 3,
    p_depth3_category_id := 15,
    p_is_advertised := true,
    p_is_recommended := true,
    p_city_id := 1,
    p_is_discounted := true,
    p_price_from := 1000000,
    p_price_to := 5000000,
    p_sort_by := 'discount_price_asc',  -- 'view_count', 'like_count', 'rating', 'discount_price_asc', 'discount_price_desc'
    p_limit := 10,
    p_offset := 0
);
*/ 