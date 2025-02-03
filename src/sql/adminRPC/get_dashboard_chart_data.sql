-- 대시보드 차트 데이터를 가져오는 함수
CREATE OR REPLACE FUNCTION get_dashboard_chart_data(
    start_date timestamp with time zone,
    end_date timestamp with time zone
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    WITH dates AS (
        SELECT date_trunc('day', dd)::date AS date
        FROM generate_series(
            start_date,
            end_date,
            '1 day'::interval
        ) dd
    ),
    user_counts AS (
        SELECT 
            date_trunc('day', created_at)::date AS date,
            COUNT(*) AS count
        FROM auth.users
        WHERE created_at BETWEEN start_date AND end_date
        AND deleted_at IS NULL
        GROUP BY 1
    ),
    hospital_counts AS (
        SELECT 
            date_trunc('day', created_at)::date AS date,
            COUNT(*) AS count
        FROM hospitals
        WHERE created_at BETWEEN start_date AND end_date
        GROUP BY 1
    ),
    treatment_counts AS (
        SELECT 
            date_trunc('day', created_at)::date AS date,
            COUNT(*) AS count
        FROM treatments
        WHERE created_at BETWEEN start_date AND end_date
        GROUP BY 1
    ),
    review_counts AS (
        SELECT 
            date_trunc('day', created_at)::date AS date,
            COUNT(*) AS count
        FROM reviews
        WHERE created_at BETWEEN start_date AND end_date
        AND status = 'published'
        GROUP BY 1
    )
    SELECT json_agg(
        json_build_object(
            'date', TO_CHAR(d.date, 'YYYY-MM-DD'),
            'users', COALESCE(u.count, 0),
            'hospitals', COALESCE(h.count, 0),
            'surgeries', COALESCE(t.count, 0),
            'reviews', COALESCE(r.count, 0)
        )
        ORDER BY d.date
    )
    FROM dates d
    LEFT JOIN user_counts u ON d.date = u.date
    LEFT JOIN hospital_counts h ON d.date = h.date
    LEFT JOIN treatment_counts t ON d.date = t.date
    LEFT JOIN review_counts r ON d.date = r.date
    INTO result;

    RETURN result;
END;
$$; 