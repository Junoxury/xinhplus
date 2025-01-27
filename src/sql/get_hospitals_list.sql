-- 1. 기존 함수 삭제
DROP FUNCTION IF EXISTS get_hospitals_list(bigint,bigint,bigint,boolean,boolean,boolean,boolean,integer,integer,integer,text);

-- 2. 새 함수 생성
CREATE OR REPLACE FUNCTION get_hospitals_list(
    p_city_id bigint DEFAULT NULL,
    p_depth2_body_category_id bigint DEFAULT NULL,    -- 신체 부위
    p_depth2_treatment_category_id bigint DEFAULT NULL, -- 시술 방법
    p_depth3_body_category_id bigint DEFAULT NULL,
    p_depth3_treatment_category_id bigint DEFAULT NULL,
    p_is_advertised boolean DEFAULT NULL,
    p_is_recommended boolean DEFAULT NULL,
    p_is_member boolean DEFAULT NULL,
    p_has_discount boolean DEFAULT NULL,
    p_page_size int DEFAULT 10,
    p_page int DEFAULT 1,
    p_ad_limit int DEFAULT 2,
    p_sort_by text DEFAULT 'created'
) 
RETURNS TABLE (
    id bigint,
    hospital_name varchar(200),
    address text,
    description text,        -- description 필드 추가
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
    is_ad boolean,
    categories jsonb,
    total_count bigint    -- 추가된 필드
) AS $$
DECLARE
    v_offset int;
    v_total_count bigint;
BEGIN
    v_offset := (p_page - 1) * p_page_size;

    -- 전체 데이터 수 계산
    SELECT COUNT(*)
    INTO v_total_count
    FROM hospitals h
    WHERE (p_city_id IS NULL OR h.city_id = p_city_id)
        AND (p_depth2_body_category_id IS NULL OR EXISTS (
            SELECT 1 FROM hospital_categories 
            WHERE hospital_id = h.id 
            AND depth2_category_id = p_depth2_body_category_id
        ))
        AND (p_depth2_treatment_category_id IS NULL OR EXISTS (
            SELECT 1 FROM hospital_categories 
            WHERE hospital_id = h.id 
            AND depth2_category_id = p_depth2_treatment_category_id
        ))
        AND (p_depth3_body_category_id IS NULL OR EXISTS (
            SELECT 1 FROM hospital_categories 
            WHERE hospital_id = h.id 
            AND depth3_category_id = p_depth3_body_category_id
        ))
        AND (p_depth3_treatment_category_id IS NULL OR EXISTS (
            SELECT 1 FROM hospital_categories 
            WHERE hospital_id = h.id 
            AND depth3_category_id = p_depth3_treatment_category_id
        ))
        AND (p_is_advertised IS NULL OR h.is_advertised = p_is_advertised)
        AND (p_is_recommended IS NULL OR h.is_recommended = p_is_recommended)
        AND (p_is_member IS NULL OR h.is_member = p_is_member)
        AND (p_has_discount IS NULL OR h.has_discount = p_has_discount);

    RETURN QUERY
    WITH RECURSIVE depth3_categories AS (
        SELECT 
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
        -- depth 3인 카테고리만 조인
        WHERE cd3.depth = 3
        GROUP BY hc.hospital_id, hc.depth2_category_id
    ),
    hospital_categories_grouped AS (
        SELECT 
            hc.hospital_id as h_id,
            jsonb_object_agg(
                cd2.name,
                jsonb_build_object(
                    'depth2', jsonb_build_object('id', cd2.id, 'name', cd2.name),
                    'depth3', COALESCE(d3c.depth3_list, '[]'::jsonb)
                )
            ) as categories
        FROM hospital_categories hc
        -- depth 2인 카테고리만 조인
        JOIN categories cd2 ON hc.depth2_category_id = cd2.id AND cd2.depth = 2
        LEFT JOIN depth3_categories d3c ON 
            hc.hospital_id = d3c.h_id AND 
            hc.depth2_category_id = d3c.depth2_category_id
        GROUP BY hc.hospital_id
    ),
    base_hospitals AS (
        SELECT 
            h.*,
            c.name as city_name,
            c.name_vi as city_name_vi,
            c.name_ko as city_name_ko,
            COALESCE(hcg.categories, '{}'::jsonb) as categories,
            CASE 
                WHEN h.is_advertised THEN true 
                ELSE false 
            END as is_advertisement
        FROM hospitals h
        LEFT JOIN cities c ON h.city_id = c.id
        LEFT JOIN hospital_categories_grouped hcg ON h.id = hcg.h_id
        WHERE (p_city_id IS NULL OR h.city_id = p_city_id)
            AND (p_depth2_body_category_id IS NULL OR EXISTS (
                SELECT 1 FROM hospital_categories 
                WHERE hospital_id = h.id 
                AND depth2_category_id = p_depth2_body_category_id
            ))
            AND (p_depth2_treatment_category_id IS NULL OR EXISTS (
                SELECT 1 FROM hospital_categories 
                WHERE hospital_id = h.id 
                AND depth2_category_id = p_depth2_treatment_category_id
            ))
            AND (p_depth3_body_category_id IS NULL OR EXISTS (
                SELECT 1 FROM hospital_categories 
                WHERE hospital_id = h.id 
                AND depth3_category_id = p_depth3_body_category_id
            ))
            AND (p_depth3_treatment_category_id IS NULL OR EXISTS (
                SELECT 1 FROM hospital_categories 
                WHERE hospital_id = h.id 
                AND depth3_category_id = p_depth3_treatment_category_id
            ))
            AND (p_is_advertised IS NULL OR h.is_advertised = p_is_advertised)
            AND (p_is_recommended IS NULL OR h.is_recommended = p_is_recommended)
            AND (p_is_member IS NULL OR h.is_member = p_is_member)
            AND (p_has_discount IS NULL OR h.has_discount = p_has_discount)
    ),
    ranked_results AS (
        SELECT 
            h.*,
            ROW_NUMBER() OVER (
                ORDER BY 
                    h.is_advertisement DESC,
                    CASE p_sort_by
                        WHEN 'latest' THEN extract(epoch from h.created_at)
                        WHEN 'views' THEN h.view_count
                        WHEN 'rating' THEN h.average_rating
                        WHEN 'likes' THEN h.like_count
                        ELSE extract(epoch from h.created_at)
                    END DESC
            ) as row_num
        FROM base_hospitals h
    ),
    next_page_check AS (
        -- 다음 페이지 데이터 존재 여부 확인
        SELECT EXISTS (
            SELECT 1 
            FROM ranked_results 
            WHERE row_num > (v_offset + p_page_size)
            LIMIT 1
        ) as has_next
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
        npc.has_next as has_next_page,
        r.is_advertisement as is_ad,
        r.categories,
        v_total_count
    FROM ranked_results r
    CROSS JOIN next_page_check npc
    WHERE r.row_num > v_offset 
        AND r.row_num <= (v_offset + p_page_size)
    ORDER BY r.row_num;
END;
$$ LANGUAGE plpgsql;