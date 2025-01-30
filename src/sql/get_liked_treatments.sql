CREATE OR REPLACE FUNCTION get_liked_treatments(
    p_user_id uuid,
    p_sort_by text DEFAULT 'created_at',  -- 'created_at', 'view_count', 'like_count', 'rating'
    p_limit integer DEFAULT 10,
    p_offset integer DEFAULT 0
) 
RETURNS TABLE (
    id bigint,
    hospital_id bigint,
    hospital_name varchar(200),
    hospital_phone varchar(50),
    title varchar(200),
    summary text,
    city_id bigint,
    city_name varchar(100),
    rating decimal(2,1),
    comment_count bigint,
    view_count bigint,
    like_count bigint,
    thumbnail_url varchar(200),
    is_advertised boolean,
    is_recommended boolean,
    is_discounted boolean,
    price decimal(12,2),
    discount_price decimal(12,2),
    discount_rate integer,
    categories jsonb,
    liked_at timestamptz,
    total_count bigint,
    has_next boolean
) AS $$
BEGIN
    RETURN QUERY
    WITH depth3_categories AS (
        SELECT DISTINCT  -- 중복 제거
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
    ),
    liked_treatments AS (
        SELECT 
            t.*,
            tl.created_at as liked_at,
            tcg.categories
        FROM treatments t
        JOIN treatment_likes tl ON t.id = tl.treatment_id
        LEFT JOIN treatment_categories_grouped tcg ON t.id = tcg.treatment_id
        WHERE tl.user_id = p_user_id
    ),
    total_count AS (
        SELECT COUNT(*) as count 
        FROM liked_treatments
    ),
    sorted_treatments AS (
        SELECT lt.*,
            ROW_NUMBER() OVER (
                ORDER BY 
                    CASE p_sort_by
                        WHEN 'created_at' THEN lt.liked_at
                        ELSE NULL::timestamptz
                    END DESC NULLS LAST,
                    CASE p_sort_by
                        WHEN 'view_count' THEN lt.view_count
                        WHEN 'like_count' THEN lt.like_count
                        WHEN 'rating' THEN lt.rating::bigint
                        ELSE 0
                    END DESC,
                    lt.id DESC
            ) as row_num
        FROM liked_treatments lt
    ),
    paginated_treatments AS (
        SELECT *
        FROM sorted_treatments
        WHERE row_num > p_offset
        AND row_num <= p_offset + p_limit + 1
    )
    SELECT 
        t.id,
        t.hospital_id,
        h.name AS hospital_name,
        h.phone AS hospital_phone,
        t.title,
        t.summary,
        t.city_id,
        c.name AS city_name,
        t.rating,
        t.comment_count,
        t.view_count,
        t.like_count,
        t.thumbnail_url,
        t.is_advertised,
        t.is_recommended,
        t.is_discounted,
        t.price,
        t.discount_price,
        t.discount_rate,
        COALESCE(tc.categories, '[]'::jsonb) as categories,
        t.liked_at,
        tc2.count as total_count,
        EXISTS (
            SELECT 1 FROM sorted_treatments 
            WHERE row_num = p_offset + p_limit + 1
        ) as has_next
    FROM paginated_treatments t
    JOIN hospitals h ON t.hospital_id = h.id
    JOIN cities c ON t.city_id = c.id
    LEFT JOIN treatment_categories_grouped tc ON t.id = tc.treatment_id
    CROSS JOIN total_count tc2
    WHERE t.row_num <= p_offset + p_limit
    ORDER BY t.row_num;
END;
$$ LANGUAGE plpgsql; 