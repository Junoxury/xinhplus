-- treatment_likes 테이블 생성
CREATE TABLE treatment_likes (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    treatment_id bigint REFERENCES treatments(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(treatment_id, user_id)
);

-- 좋아요 토글 함수 생성
CREATE OR REPLACE FUNCTION toggle_treatment_like(
    p_treatment_id bigint,
    p_user_id uuid
) RETURNS TABLE (
    success boolean,
    like_count bigint,
    is_liked boolean
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    -- 이미 좋아요를 눌렀는지 확인
    IF EXISTS (
        SELECT 1 FROM treatment_likes 
        WHERE treatment_id = p_treatment_id AND user_id = p_user_id
    ) THEN
        -- 좋아요 취소
        DELETE FROM treatment_likes 
        WHERE treatment_id = p_treatment_id AND user_id = p_user_id;
        
        -- 좋아요 수 감소
        UPDATE treatments 
        SET like_count = treatments.like_count - 1
        WHERE id = p_treatment_id;
        
        RETURN QUERY
        SELECT true, h.like_count, false
        FROM treatments h
        WHERE h.id = p_treatment_id;
    ELSE
        -- 좋아요 추가
        INSERT INTO treatment_likes (treatment_id, user_id)
        VALUES (p_treatment_id, p_user_id);
        
        -- 좋아요 수 증가
        UPDATE treatments 
        SET like_count = treatments.like_count + 1
        WHERE id = p_treatment_id;
        
        RETURN QUERY
        SELECT true, h.like_count, true
        FROM treatments h
        WHERE h.id = p_treatment_id;
    END IF;
END;
$$;

-- 좋아요 여부 확인 함수
CREATE OR REPLACE FUNCTION check_treatment_like(
    p_treatment_id bigint,
    p_user_id uuid
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM treatment_likes 
        WHERE treatment_id = p_treatment_id AND user_id = p_user_id
    );
END;
$$; 