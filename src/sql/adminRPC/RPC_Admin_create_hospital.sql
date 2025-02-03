-- supabase/functions/create_hospital.sql
create or replace function create_hospital(
  p_hospital_data json,
  p_categories json
)
returns json
language plpgsql
security definer
as $$
declare
  v_hospital_id bigint;
  v_category record;
begin
  -- 트랜잭션 시작
  begin
    -- hospital 테이블에 데이터 삽입
    insert into hospitals (
      name,
      city_id,
      business_hours,
      address,
      phone,
      email,
      website,
      facebook_url,
      youtube_url,
      tiktok_url,
      instagram_url,
      zalo_id,
      description,
      thumbnail_url,
      detail_content,
      latitude,
      longitude,
      is_advertised,
      is_recommended,
      is_member,
      is_google,
      google_map_url,
      has_discount
    )
    values (
      (p_hospital_data->>'hospital_name')::varchar,
      (p_hospital_data->>'city_id')::bigint,
      (p_hospital_data->>'business_hours')::text,
      (p_hospital_data->>'address')::text,
      (p_hospital_data->>'phone')::varchar,
      (p_hospital_data->>'email')::varchar,
      (p_hospital_data->>'website')::varchar,
      (p_hospital_data->>'facebook_url')::varchar,
      (p_hospital_data->>'youtube_url')::varchar,
      (p_hospital_data->>'tiktok_url')::varchar,
      (p_hospital_data->>'instagram_url')::varchar,
      (p_hospital_data->>'zalo_id')::varchar,
      (p_hospital_data->>'description')::text,
      (p_hospital_data->>'thumbnail_url')::varchar,
      (p_hospital_data->>'detail_content')::text,
      (p_hospital_data->>'latitude')::numeric(10,8),
      (p_hospital_data->>'longitude')::numeric(11,8),
      (p_hospital_data->>'is_advertised')::boolean,
      (p_hospital_data->>'is_recommended')::boolean,
      (p_hospital_data->>'is_member')::boolean,
      (p_hospital_data->>'is_google')::boolean,
      (p_hospital_data->>'google_map_url')::varchar,
      false
    )
    returning id into v_hospital_id;

    -- hospital_categories 테이블에 카테고리 데이터 삽입
    for v_category in 
      select 
        (value->>'depth2_category_id')::bigint as depth2_category_id,
        (value->>'depth3_category_id')::bigint as depth3_category_id
      from json_array_elements(p_categories)
    loop
      insert into hospital_categories (
        hospital_id,
        depth2_category_id,
        depth3_category_id
      )
      values (
        v_hospital_id,
        v_category.depth2_category_id,
        v_category.depth3_category_id
      );
    end loop;

    -- 성공 응답 반환
    return json_build_object(
      'success', true,
      'hospital_id', v_hospital_id
    );

  exception when others then
    -- 에러 발생시 롤백 및 에러 응답 반환
    return json_build_object(
      'success', false,
      'error', SQLERRM
    );
  end;
end;
$$;
