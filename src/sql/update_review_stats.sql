-- 시술 통계 업데이트 함수
create or replace function update_treatment_stats(p_treatment_id bigint)
returns void
language plpgsql
security definer
as $$
begin
  -- comment_count 증가 및 rating 업데이트
  update treatments
  set 
    comment_count = comment_count + 1,
    rating = (
      select round(avg(rating)::numeric, 1)
      from reviews
      where treatment_id = p_treatment_id
    )
  where id = p_treatment_id;
end;
$$;

-- 병원 통계 업데이트 함수
create or replace function update_hospital_stats(p_hospital_id bigint)
returns void
language plpgsql
security definer
as $$
begin
  -- comment_count 증가 및 average_rating 업데이트
  update hospitals
  set 
    comment_count = comment_count + 1,
    average_rating = (
      select round(avg(rating)::numeric, 1)
      from reviews
      where hospital_id = p_hospital_id
    )
  where id = p_hospital_id;
end;
$$;

-- 함수 사용 권한 설정
grant execute on function update_treatment_stats(bigint) to authenticated;
grant execute on function update_hospital_stats(bigint) to authenticated; 