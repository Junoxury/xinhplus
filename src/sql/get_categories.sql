CREATE OR REPLACE FUNCTION get_categories(p_parent_depth1_id bigint)
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    WITH categories_data AS (
        SELECT 
            d2.id,
            d2.shortname as label,
            d2.icon_path as icon,
            jsonb_agg(
                jsonb_build_object(
                    'id', d3.id,
                    'label', COALESCE(d3.shortname, d3.name),
                    'parentId', d3.parent_id
                )
                ORDER BY d3.sort_order
            ) FILTER (WHERE d3.id IS NOT NULL) as subcategories
        FROM categories d2
        LEFT JOIN categories d3 ON d3.parent_id = d2.id AND d3.depth = 3
        WHERE d2.depth = 2 
        AND d2.parent_id = p_parent_depth1_id
        AND d2.is_active = true
        GROUP BY d2.id, d2.shortname, d2.icon_path, d2.sort_order
        ORDER BY d2.sort_order
    )
    SELECT jsonb_build_object(
        'categories', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'label', label,
                    'icon', icon
                )
                ORDER BY id
            )
            FROM categories_data
        ),
        'subCategories', (
            SELECT jsonb_agg(sub)
            FROM (
                SELECT jsonb_array_elements(subcategories) as sub
                FROM categories_data
            ) as expanded
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql; 