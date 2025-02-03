-- 사용자 프로필 테이블 생성
CREATE TABLE user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,  -- Supabase auth.users와 1:1 관계
    nickname varchar(50),                                            -- 닉네임 (nullable)
    gender varchar(10) NOT NULL CHECK (gender IN ('male', 'female')), -- 성별
    phone varchar(20) NOT NULL,                                       -- 전화번호
    city_id bigint REFERENCES cities(id),                            -- 거주 도시
    avatar_url text,                                                 -- 프로필 이미지 URL
    is_active boolean DEFAULT true,                                  -- 계정 활성화 상태
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- nickname 유니크 제약 조건 추가 (NULL은 중복 가능)
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_nickname_unique UNIQUE (nickname);

-- 사용자가 선호하는 카테고리 (다대다 관계)
CREATE TABLE user_preferred_categories (
    user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
    depth2_id bigint REFERENCES categories(id),                      -- depth2 카테고리만 참조
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, depth2_id)
   
);

-- 인덱스 생성
CREATE INDEX idx_user_profiles_city ON user_profiles(city_id);
CREATE INDEX idx_user_profiles_active ON user_profiles(is_active);
CREATE INDEX idx_user_preferred_categories_depth2 ON user_preferred_categories(depth2_id);

-- updated_at 자동 갱신을 위한 트리거
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책 설정
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferred_categories ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 프로필만 읽고 수정할 수 있음
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 사용자는 자신의 선호 카테고리만 관리할 수 있음
CREATE POLICY "Users can manage own preferred categories"
    ON user_preferred_categories FOR ALL
    USING (auth.uid() = user_id); 