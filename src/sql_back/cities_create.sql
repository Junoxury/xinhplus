CREATE TABLE cities (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(100) NOT NULL,              -- 도시 이름 (영문)
    name_vi varchar(100) NOT NULL,           -- 도시 이름 (베트남어)
    name_ko varchar(100),                    -- 도시 이름 (한국어)
    latitude decimal(10,8),                  -- 도시 중심 위도
    longitude decimal(11,8),                 -- 도시 중심 경도
    is_active boolean DEFAULT true,          -- 활성화 여부
    sort_order integer NOT NULL,             -- 정렬 순서
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 인덱스 생성
CREATE INDEX idx_cities_active ON cities(is_active);
CREATE INDEX idx_cities_sort ON cities(sort_order);

-- 샘플 데이터
INSERT INTO cities (name, name_vi, name_ko, latitude, longitude, sort_order) VALUES
('Ho Chi Minh', 'Hồ Chí Minh', '호치민', 10.8231, 106.6297, 1),
('Hanoi', 'Hà Nội', '하노이', 21.0285, 105.8542, 2),
('Da Nang', 'Đà Nẵng', '다낭', 16.0544, 108.2022, 3),
('Nha Trang', 'Nha Trang', '나트랑', 12.2388, 109.1967, 4),
('Hoi An', 'Hội An', '호이안', 15.8801, 108.3380, 5);

-- updated_at 자동 갱신을 위한 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cities_updated_at
    BEFORE UPDATE ON cities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();