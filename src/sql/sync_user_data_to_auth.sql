-- user_profiles와 user_preferred_categories의 데이터를 auth.users의 메타데이터로 동기화하는 함수
create or replace function public.sync_user_data_to_auth()
returns trigger as $$
declare
  profile_data json;
  categories json;
begin
  -- user_profiles 데이터 가져오기
  select json_build_object(
    'gender', p.gender,
    'phone', p.phone,
    'city_id', p.city_id,
    'avatar_url', p.avatar_url,
    'nickname', p.nickname
  )
  from public.user_profiles p
  where p.id = new.id
  into profile_data;

  -- user_preferred_categories 데이터 가져오기
  select json_agg(depth2_id)
  from public.user_preferred_categories
  where user_id = new.id
  into categories;

  -- auth.users 메타데이터 업데이트
  update auth.users
  set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)::jsonb || 
    jsonb_build_object(
      'profile', profile_data,
      'preferred_categories', coalesce(categories, '[]'::json)
    )
  where id = new.id;
  
  return new;
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