CREATE OR REPLACE FUNCTION get_liked_hospitals(
    p_user_id uuid,
    p_sort_by text DEFAULT 'created_at',  -- 'created_at', 'views', 'rating', 'likes'
    p_page_size int DEFAULT 10,
    p_page int DEFAULT 1
) 
RETURNS TABLE (
    id bigint,
    hospital_name varchar(200),
    address text,
    description text,
    thumbnail_url varchar(200),
    business_hours text,
    phone varchar(50),
    website varchar(200),
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
    has_next_page boolean,
    categories jsonb,
    total_count bigint,
    liked_at timestamptz
) AS $$
DECLARE
    v_offset int;
    v_total_count bigint;
BEGIN
    v_offset := (p_page - 1) * p_page_size;

    RETURN QUERY
    WITH RECURSIVE depth3_categories AS (
        SELECT DISTINCT
            hc.hospital_id as h_id,
            hc.depth2_category_id,
            jsonb_agg(
                jsonb_build_object(
                    'id', cd3.id,
                    'name', cd3.name
                )
            ) as depth3_list
        FROM hospital_categories hc
        JOIN categories cd3 ON hc.depth3_category_id = cd3.id
        WHERE cd3.depth = 3
        GROUP BY hc.hospital_id, hc.depth2_category_id
    ),
    hospital_categories_grouped AS (
        SELECT DISTINCT
            hc.hospital_id as h_id,
            jsonb_object_agg(
                cd2.name,
                jsonb_build_object(
                    'depth2', jsonb_build_object('id', cd2.id, 'name', cd2.name),
                    'depth3', COALESCE(d3c.depth3_list, '[]'::jsonb)
                )
            ) as categories
        FROM hospital_categories hc
        JOIN categories cd2 ON hc.depth2_category_id = cd2.id AND cd2.depth = 2
        LEFT JOIN depth3_categories d3c ON 
            hc.hospital_id = d3c.h_id AND 
            hc.depth2_category_id = d3c.depth2_category_id
        GROUP BY hc.hospital_id
    ),
    liked_hospitals AS (
        SELECT DISTINCT
            h.*,
            c.name as city_name,
            c.name_vi as city_name_vi,
            c.name_ko as city_name_ko,
            COALESCE(hcg.categories, '{}'::jsonb) as categories,
            hl.created_at as liked_at
        FROM hospitals h
        JOIN hospital_likes hl ON h.id = hl.hospital_id
        LEFT JOIN cities c ON h.city_id = c.id
        LEFT JOIN hospital_categories_grouped hcg ON h.id = hcg.h_id
        WHERE hl.user_id = p_user_id
    ),
    total_count AS (
        SELECT COUNT(*) FROM liked_hospitals
    ),
    ranked_results AS (
        SELECT 
            h.*,
            ROW_NUMBER() OVER (
                ORDER BY 
                    CASE p_sort_by
                        WHEN 'created_at' THEN extract(epoch from h.liked_at)
                        WHEN 'views' THEN h.view_count
                        WHEN 'rating' THEN (h.average_rating * 10)::bigint
                        WHEN 'likes' THEN h.like_count
                        ELSE extract(epoch from h.liked_at)
                    END DESC,
                    h.id DESC
            ) as row_num
        FROM liked_hospitals h
    )
    SELECT 
        r.id,
        r.name as hospital_name,
        r.address,
        r.description,
        r.thumbnail_url,
        r.business_hours,
        r.phone,
        r.website,
        r.is_advertised,
        r.is_recommended,
        r.is_member,
        r.has_discount,
        r.view_count,
        r.like_count,
        r.average_rating,
        r.city_name,
        r.city_name_vi,
        r.city_name_ko,
        EXISTS (
            SELECT 1 
            FROM ranked_results 
            WHERE row_num > (v_offset + p_page_size)
            LIMIT 1
        ) as has_next_page,
        r.categories,
        (SELECT COUNT(*) FROM liked_hospitals) as total_count,
        r.liked_at
    FROM ranked_results r
    WHERE r.row_num > v_offset 
        AND r.row_num <= (v_offset + p_page_size)
    ORDER BY r.row_num;
END;
$$ LANGUAGE plpgsql; 