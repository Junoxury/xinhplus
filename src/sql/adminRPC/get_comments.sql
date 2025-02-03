-- 댓글 조회를 위한 RPC 함수
CREATE OR REPLACE FUNCTION get_comments(
    p_content TEXT DEFAULT NULL,         -- 댓글 내용 검색
    p_author TEXT DEFAULT NULL,          -- 작성자 검색 (이메일 또는 닉네임)
    p_status TEXT DEFAULT NULL,          -- 상태 필터 (normal, reported, hidden)
    p_page INTEGER DEFAULT 1,            -- 페이지 번호
    p_page_size INTEGER DEFAULT 10       -- 페이지당 항목 수
)
RETURNS TABLE (
    id BIGINT,                          
    content TEXT,                       
    treatment_name VARCHAR(200),        
    hospital_name VARCHAR(200),         
    author_email VARCHAR(255),          
    author_nickname VARCHAR(255),       
    status VARCHAR(20),                 
    like_count INTEGER,                 
    created_at TIMESTAMPTZ,            
    parent_id BIGINT,                  -- 부모 댓글 ID
    is_reply BOOLEAN,                  -- 답글 여부
    total_count BIGINT                
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH filtered_comments AS (
        SELECT 
            rc.id,
            rc.content,
            t.title as treatment_name,
            h.name as hospital_name,
            au.email as author_email,
            up.nickname as author_nickname,
            rc.status,
            rc.like_count,
            rc.created_at,
            rc.parent_id,                                    -- 부모 댓글 ID
            CASE WHEN rc.parent_id IS NOT NULL THEN TRUE     -- 답글 여부
                 ELSE FALSE 
            END as is_reply
        FROM review_comments rc
        LEFT JOIN reviews r ON rc.review_id = r.id
        LEFT JOIN treatments t ON r.treatment_id = t.id
        LEFT JOIN hospitals h ON r.hospital_id = h.id
        LEFT JOIN auth.users au ON rc.author_id = au.id
        LEFT JOIN user_profiles up ON rc.author_id = up.id
        WHERE 
            -- 댓글 내용 검색
            (p_content IS NULL OR rc.content ILIKE '%' || p_content || '%')
            -- 작성자 검색 (이메일 또는 닉네임)
            AND (p_author IS NULL OR 
                au.email ILIKE '%' || p_author || '%' OR 
                up.nickname ILIKE '%' || p_author || '%')
            -- 상태 필터
            AND (p_status IS NULL OR p_status = 'all' OR rc.status = p_status)
    ),
    total AS (
        SELECT COUNT(*) as total_count FROM filtered_comments
    )
    SELECT 
        fc.*,
        t.total_count
    FROM filtered_comments fc, total t
    ORDER BY fc.created_at DESC
    LIMIT p_page_size
    OFFSET (p_page - 1) * p_page_size;
END;
$$;

-- RPC에 대한 접근 권한 설정
GRANT EXECUTE ON FUNCTION get_comments TO authenticated;
GRANT EXECUTE ON FUNCTION get_comments TO service_role;

-- 댓글 상태 변경을 위한 RPC 함수
CREATE OR REPLACE FUNCTION update_comment_status(
    p_comment_id BIGINT,
    p_status VARCHAR(20)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE review_comments
    SET 
        status = p_status,
        updated_at = NOW()
    WHERE id = p_comment_id;
    
    RETURN FOUND;
END;
$$;

-- RPC에 대한 접근 권한 설정
GRANT EXECUTE ON FUNCTION update_comment_status TO authenticated;
GRANT EXECUTE ON FUNCTION update_comment_status TO service_role; 