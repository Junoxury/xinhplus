-- 대시보드 통계 데이터를 가져오는 함수
CREATE OR REPLACE FUNCTION get_dashboard_stats(
    start_date timestamp with time zone,
    end_date timestamp with time zone
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
    prev_start_date timestamp with time zone;
    prev_end_date timestamp with time zone;
BEGIN
    -- 이전 기간 설정 (현재 기간과 동일한 길이로)
    prev_start_date := start_date - (end_date - start_date);
    prev_end_date := start_date;

    SELECT json_build_object(
        'userCount', json_build_object(
            'total', (
                SELECT COUNT(*)
                FROM auth.users
                WHERE deleted_at IS NULL
            ),
            'period', (
                SELECT COUNT(*)
                FROM auth.users
                WHERE created_at BETWEEN start_date AND end_date
                AND deleted_at IS NULL
            ),
            'increase', (
                WITH current_period AS (
                    SELECT COUNT(*) as current_count
                    FROM auth.users
                    WHERE created_at BETWEEN start_date AND end_date
                    AND deleted_at IS NULL
                ),
                prev_period AS (
                    SELECT COUNT(*) as prev_count
                    FROM auth.users
                    WHERE created_at BETWEEN prev_start_date AND prev_end_date
                    AND deleted_at IS NULL
                )
                SELECT json_build_object(
                    'percentage', CASE 
                        WHEN prev_count = 0 THEN 100
                        ELSE ROUND(((current_count - prev_count)::numeric / prev_count * 100)::numeric, 1)
                    END,
                    'count', current_count - prev_count
                )
                FROM current_period, prev_period
            )
        ),
        'hospitalCount', json_build_object(
            'total', (
                SELECT COUNT(*)
                FROM hospitals
            ),
            'period', (
                SELECT COUNT(*)
                FROM hospitals
                WHERE created_at BETWEEN start_date AND end_date
            ),
            'increase', (
                WITH current_period AS (
                    SELECT COUNT(*) as current_count
                    FROM hospitals
                    WHERE created_at BETWEEN start_date AND end_date
                ),
                prev_period AS (
                    SELECT COUNT(*) as prev_count
                    FROM hospitals
                    WHERE created_at BETWEEN prev_start_date AND prev_end_date
                )
                SELECT json_build_object(
                    'percentage', CASE 
                        WHEN prev_count = 0 THEN 100
                        ELSE ROUND(((current_count - prev_count)::numeric / prev_count * 100)::numeric, 1)
                    END,
                    'count', current_count - prev_count
                )
                FROM current_period, prev_period
            )
        ),
        'treatmentCount', json_build_object(
            'total', (
                SELECT COUNT(*)
                FROM treatments
            ),
            'period', (
                SELECT COUNT(*)
                FROM treatments
                WHERE created_at BETWEEN start_date AND end_date
            ),
            'increase', (
                WITH current_period AS (
                    SELECT COUNT(*) as current_count
                    FROM treatments
                    WHERE created_at BETWEEN start_date AND end_date
                ),
                prev_period AS (
                    SELECT COUNT(*) as prev_count
                    FROM treatments
                    WHERE created_at BETWEEN prev_start_date AND prev_end_date
                )
                SELECT json_build_object(
                    'percentage', CASE 
                        WHEN prev_count = 0 THEN 100
                        ELSE ROUND(((current_count - prev_count)::numeric / prev_count * 100)::numeric, 1)
                    END,
                    'count', current_count - prev_count
                )
                FROM current_period, prev_period
            )
        ),
        'reviewCount', json_build_object(
            'total', (
                SELECT COUNT(*)
                FROM reviews
                WHERE status = 'published'
            ),
            'period', (
                SELECT COUNT(*)
                FROM reviews
                WHERE created_at BETWEEN start_date AND end_date
                AND status = 'published'
            ),
            'increase', (
                WITH current_period AS (
                    SELECT COUNT(*) as current_count
                    FROM reviews
                    WHERE created_at BETWEEN start_date AND end_date
                    AND status = 'published'
                ),
                prev_period AS (
                    SELECT COUNT(*) as prev_count
                    FROM reviews
                    WHERE created_at BETWEEN prev_start_date AND prev_end_date
                    AND status = 'published'
                )
                SELECT json_build_object(
                    'percentage', CASE 
                        WHEN prev_count = 0 THEN 100
                        ELSE ROUND(((current_count - prev_count)::numeric / prev_count * 100)::numeric, 1)
                    END,
                    'count', current_count - prev_count
                )
                FROM current_period, prev_period
            )
        )
    ) INTO result;

    RETURN result;
END;
$$; 