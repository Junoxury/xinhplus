-- user_profiles와 user_preferred_categories의 데이터를 auth.users의 메타데이터로 동기화하는 함수
create or replace function public.sync_user_data_to_auth()
returns trigger as $$
declare
  profile_data json;
  categories json;
  v_user_id uuid;
begin
  -- TG_OP와 TG_TABLE_NAME을 사용하여 트리거 작업 유형과 테이블 확인
  IF TG_TABLE_NAME = 'user_profiles' THEN
    v_user_id := NEW.id;  -- user_profiles 테이블은 id 컬럼 사용
  ELSE
    -- user_preferred_categories 테이블의 경우
    IF TG_OP = 'DELETE' THEN
      v_user_id := OLD.user_id;  -- DELETE는 OLD 레코드 사용
    ELSE
      v_user_id := NEW.user_id;  -- INSERT/UPDATE는 NEW 레코드 사용
    END IF;
  END IF;

  -- user_profiles 데이터 가져오기
  select json_build_object(
    'gender', p.gender,
    'phone', p.phone,
    'city_id', p.city_id,
    'avatar_url', p.avatar_url,
    'nickname', p.nickname
  )
  from public.user_profiles p
  where p.id = v_user_id
  into profile_data;

  -- user_preferred_categories 데이터 가져오기
  select json_agg(depth2_id)
  from public.user_preferred_categories
  where user_id = v_user_id
  into categories;

  -- auth.users 메타데이터 업데이트
  update auth.users
  set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)::jsonb || 
    jsonb_build_object(
      'profile', profile_data,
      'preferred_categories', coalesce(categories, '[]'::json)
    )
  where id = v_user_id;
  
  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;

-- user_profiles 테이블에 대한 트리거
create or replace trigger on_user_profile_update
  after insert or update on public.user_profiles
  for each row
  execute function public.sync_user_data_to_auth();

-- user_preferred_categories 테이블에 대한 트리거
create or replace trigger on_user_preferred_categories_change
  after insert or update or delete on public.user_preferred_categories
  for each row
  execute function public.sync_user_data_to_auth();