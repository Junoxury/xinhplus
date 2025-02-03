-- 스키마 권한 설정
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_create_treatment(
  -- 시술 정보
  p_hospital_id INT,
  p_city_id INT,
  p_name VARCHAR,
  p_thumbnail_url TEXT,
  p_description TEXT,
  p_detail_content TEXT,
  p_is_advertised BOOLEAN,
  p_is_recommended BOOLEAN,
  p_is_discounted BOOLEAN,
  p_discount_rate INT,
  p_discounted_price INT,
  p_original_price INT,
  -- 카테고리 정보
  p_categories JSONB
) RETURNS JSONB 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_treatment_id INT;
  v_category JSONB;
  v_success BOOLEAN := false;
  v_error TEXT;
BEGIN
  -- 트랜잭션 시작
  BEGIN
    -- treatments 테이블에 데이터 삽입
    INSERT INTO public.treatments (
      hospital_id,
      city_id,
      title,
      thumbnail_url,
      summary,
      detail_content,
      is_advertised,
      is_recommended,
      is_discounted,
      discount_rate,
      discount_price,
      price,
      created_at,
      updated_at
    ) VALUES (
      p_hospital_id,
      p_city_id,
      p_name,
      p_thumbnail_url,
      p_description,
      p_detail_content,
      p_is_advertised,
      p_is_recommended,
      p_is_discounted,
      CASE WHEN p_is_discounted THEN p_discount_rate ELSE NULL END,
      p_discounted_price,
      p_original_price,
      NOW(),
      NOW()
    ) RETURNING id INTO v_treatment_id;

    -- treatment_categories 테이블에 카테고리 데이터 삽입
    FOR v_category IN SELECT * FROM jsonb_array_elements(p_categories)
    LOOP
      INSERT INTO public.treatment_categories (
        treatment_id,
        depth2_category_id,
        depth3_category_id,
        created_at
      ) VALUES (
        v_treatment_id,
        (v_category->>'depth2_category_id')::INT,
        (v_category->>'depth3_category_id')::INT,
        NOW()
      );
    END LOOP;

    v_success := true;

    -- 성공 응답 반환
    RETURN jsonb_build_object(
      'success', v_success,
      'treatment_id', v_treatment_id
    );

  -- 에러 처리
  EXCEPTION WHEN OTHERS THEN
    v_success := false;
    v_error := SQLERRM;
    
    RETURN jsonb_build_object(
      'success', v_success,
      'error', v_error
    );
  END;
END;
$$;

-- 권한 설정
REVOKE ALL ON FUNCTION public.admin_create_treatment(
  INT, INT, VARCHAR, TEXT, TEXT, TEXT, 
  BOOLEAN, BOOLEAN, BOOLEAN, 
  INT, INT, INT, 
  JSONB
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.admin_create_treatment(
  INT, INT, VARCHAR, TEXT, TEXT, TEXT, 
  BOOLEAN, BOOLEAN, BOOLEAN, 
  INT, INT, INT, 
  JSONB
) TO authenticated; 