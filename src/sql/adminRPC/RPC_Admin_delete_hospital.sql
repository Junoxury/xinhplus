-- 병원 및 관련 카테고리 삭제를 위한 RPC 함수
create or replace function delete_hospital_with_categories(p_hospital_id bigint)
returns boolean
language plpgsql
security definer
as $$
declare
  v_success boolean;
begin
  -- 트랜잭션 시작
  begin
    -- 먼저 hospital_categories 테이블에서 관련 데이터 삭제
    delete from hospital_categories
    where hospital_id = p_hospital_id;
    
    -- hospitals 테이블에서 병원 데이터 삭제
    delete from hospitals
    where id = p_hospital_id;
    
    -- 삭제가 성공적으로 완료되면 true 반환
    v_success := true;
    
    -- 예외 처리
    exception when others then
      v_success := false;
  end;
  
  return v_success;
end;
$$;

-- RPC 함수에 대한 실행 권한 설정
grant execute on function delete_hospital_with_categories(bigint) to authenticated;
grant execute on function delete_hospital_with_categories(bigint) to service_role; 