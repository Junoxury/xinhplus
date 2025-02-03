create or replace function get_admins()
returns table (
  id uuid,
  email character varying(255),
  name text,
  role character varying(255),
  last_sign_in_at timestamp with time zone,
  created_at timestamp with time zone,
  phone character varying(20)
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    au.id,
    au.email,
    user_profiles.name,
    user_profiles.role,
    au.last_sign_in_at,
    au.created_at,
    user_profiles.phone
  from
    auth.users au
  left join
    user_profiles
  on
    au.id = user_profiles.id
  where
    user_profiles.role in ('admin', 'pending');
end
$$;
