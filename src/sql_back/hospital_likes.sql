-- hospital_likes 테이블 생성
CREATE TABLE hospital_likes (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    hospital_id bigint REFERENCES hospitals(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(hospital_id, user_id)
);

-- hospitals 테이블에 like_count 컬럼 추가
ALTER TABLE hospitals 
ADD COLUMN like_count bigint DEFAULT 0;

-- 좋아요 토글 함수 생성
CREATE OR REPLACE FUNCTION toggle_hospital_like(
    p_hospital_id bigint,
    p_user_id uuid
) RETURNS TABLE (
    success boolean,
    like_count bigint,
    is_liked boolean
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    -- 이미 좋아요를 눌렀는지 확인
    IF EXISTS (
        SELECT 1 FROM hospital_likes 
        WHERE hospital_id = p_hospital_id AND user_id = p_user_id
    ) THEN
        -- 좋아요 취소
        DELETE FROM hospital_likes 
        WHERE hospital_id = p_hospital_id AND user_id = p_user_id;
        
        -- 좋아요 수 감소
        UPDATE hospitals 
        SET like_count = hospitals.like_count - 1
        WHERE id = p_hospital_id;
        
        RETURN QUERY
        SELECT 
            true as success, 
            h.like_count, 
            false as is_liked
        FROM hospitals h
        WHERE h.id = p_hospital_id;
    ELSE
        -- 좋아요 추가
        INSERT INTO hospital_likes (hospital_id, user_id)
        VALUES (p_hospital_id, p_user_id);
        
        -- 좋아요 수 증가
        UPDATE hospitals 
        SET like_count = hospitals.like_count + 1
        WHERE id = p_hospital_id;
        
        RETURN QUERY
        SELECT 
            true as success, 
            h.like_count, 
            true as is_liked
        FROM hospitals h
        WHERE h.id = p_hospital_id;
    END IF;
END;
$$;

-- 병원 좋아요 여부 확인 함수
CREATE OR REPLACE FUNCTION check_hospital_like(
    p_hospital_id bigint,
    p_user_id uuid
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM hospital_likes 
        WHERE hospital_id = p_hospital_id AND user_id = p_user_id
    );
END;
$$; 