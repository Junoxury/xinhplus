-- 카테고리 테이블 생성
CREATE TABLE categories (
   id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   name text NOT NULL,
   shortname text,
   icon_path text,
   depth integer NOT NULL,
   parent_id bigint REFERENCES categories(id),
   sort_order integer NOT NULL,
   is_active boolean DEFAULT true,
   created_at timestamptz DEFAULT now(),
   updated_at timestamptz DEFAULT now()
);

-- depth1 입력 (최상위 카테고리)
INSERT INTO categories (name, depth, sort_order) VALUES
('신체부위', 1, 1),
('시술방법', 1, 2);

-- depth2 입력 (신체부위 하위)
WITH body_depth1 AS (
 SELECT id FROM categories WHERE name = '신체부위'
)
INSERT INTO categories (name, shortname, icon_path, depth, parent_id, sort_order) VALUES
('코', '코', 'icon-코', 2, (SELECT id FROM body_depth1), 1),
('가슴', '가슴', 'icon-가슴', 2, (SELECT id FROM body_depth1), 2),
('눈', '눈', 'icon-눈', 2, (SELECT id FROM body_depth1), 3),
('입술', '입술', 'icon-입술', 2, (SELECT id FROM body_depth1), 4),
('피부', '피부', 'icon-피부', 2, (SELECT id FROM body_depth1), 5),
('얼굴', '얼굴', 'icon-얼굴', 2, (SELECT id FROM body_depth1), 6),
('광대', '광대', 'icon-광대', 2, (SELECT id FROM body_depth1), 7),
('치아', '치아', 'icon-치아', 2, (SELECT id FROM body_depth1), 8),
('바디', '바디', 'icon-바디', 2, (SELECT id FROM body_depth1), 9),
('제모', '제모', 'icon-제모', 2, (SELECT id FROM body_depth1), 10),
('여성전용', '여성전용', 'icon-여성전용', 2, (SELECT id FROM body_depth1), 11);

-- depth2 입력 (시술방법 하위)
WITH treatment_depth1 AS (
 SELECT id FROM categories WHERE name = '시술방법'
)
INSERT INTO categories (name, shortname, icon_path, depth, parent_id, sort_order) VALUES
('지방성형', '지방성형', 'icon-지방성형', 2, (SELECT id FROM treatment_depth1), 1),
('필러/보톡스', '필러/보톡스', 'icon-필러-보톡스', 2, (SELECT id FROM treatment_depth1), 2),
('lifting', 'lifting', 'icon-lifting', 2, (SELECT id FROM treatment_depth1), 3);

-- depth3 입력 (코 카테고리 하위)
WITH nose_category AS (
 SELECT id FROM categories WHERE name = '코' AND depth = 2
)
INSERT INTO categories (name, depth, parent_id, sort_order) VALUES
('코끝 성형', 3, (SELECT id FROM nose_category), 1),
('콧대 확대', 3, (SELECT id FROM nose_category), 2),
('메무리코 교정', 3, (SELECT id FROM nose_category), 3),
('들창코 교정', 3, (SELECT id FROM nose_category), 4),
('휘어진코 수술', 3, (SELECT id FROM nose_category), 5),
('콧볼 축소', 3, (SELECT id FROM nose_category), 6),
('재수술', 3, (SELECT id FROM nose_category), 7);

-- depth3 입력 (가슴 카테고리 하위)
WITH breast_category AS (
 SELECT id FROM categories WHERE name = '가슴' AND depth = 2
)
INSERT INTO categories (name, depth, parent_id, sort_order) VALUES
('가슴 리프팅', 3, (SELECT id FROM breast_category), 1),
('가슴 확대', 3, (SELECT id FROM breast_category), 2),
('가슴 축소', 3, (SELECT id FROM breast_category), 3),
('남성 가슴 축소', 3, (SELECT id FROM breast_category), 4),
('유두 수술', 3, (SELECT id FROM breast_category), 5),
('가슴 재건', 3, (SELECT id FROM breast_category), 6),
('가슴 재수술', 3, (SELECT id FROM breast_category), 7);

-- depth3 입력 (눈 카테고리 하위)
WITH eye_category AS (
 SELECT id FROM categories WHERE name = '눈' AND depth = 2
)
INSERT INTO categories (name, depth, parent_id, sort_order) VALUES
('쌍거풀 비절개', 3, (SELECT id FROM eye_category), 1),
('쌍거풀 부분절개', 3, (SELECT id FROM eye_category), 2),
('안검하수', 3, (SELECT id FROM eye_category), 3),
('하안검 성형술', 3, (SELECT id FROM eye_category), 4),
('눈가리개', 3, (SELECT id FROM eye_category), 5),
('재수술', 3, (SELECT id FROM eye_category), 6);

-- depth3 입력 (입술 카테고리 하위)
WITH lip_category AS (
 SELECT id FROM categories WHERE name = '입술' AND depth = 2
)
INSERT INTO categories (name, depth, parent_id, sort_order) VALUES
('입꼬리', 3, (SELECT id FROM lip_category), 1),
('입 길이 연장', 3, (SELECT id FROM lip_category), 2);

-- depth3 입력 (피부 카테고리 하위)
WITH skin_category AS (
 SELECT id FROM categories WHERE name = '피부' AND depth = 2
)
INSERT INTO categories (name, depth, parent_id, sort_order) VALUES
('anti-aging', 3, (SELECT id FROM skin_category), 1),
('모공', 3, (SELECT id FROM skin_category), 2),
('흉터', 3, (SELECT id FROM skin_category), 3);

-- depth3 입력 (얼굴 카테고리 하위)
WITH face_category AS (
 SELECT id FROM categories WHERE name = '얼굴' AND depth = 2
)
INSERT INTO categories (name, depth, parent_id, sort_order) VALUES
('사각턱 윤곽', 3, (SELECT id FROM face_category), 1),
('턱 윤곽', 3, (SELECT id FROM face_category), 2),
('이마 윤곽', 3, (SELECT id FROM face_category), 3);

-- depth3 입력 (광대 카테고리 하위)
WITH cheek_category AS (
 SELECT id FROM categories WHERE name = '광대' AND depth = 2
)
INSERT INTO categories (name, depth, parent_id, sort_order) VALUES
('광대 윤곽', 3, (SELECT id FROM cheek_category), 1);

-- depth3 입력 (치아 카테고리 하위)
WITH teeth_category AS (
 SELECT id FROM categories WHERE name = '치아' AND depth = 2
)
INSERT INTO categories (name, depth, parent_id, sort_order) VALUES
('치아 미백 또는 블리칭', 3, (SELECT id FROM teeth_category), 1),
('루미니어', 3, (SELECT id FROM teeth_category), 2),
('치아 임플란트 및 브리지', 3, (SELECT id FROM teeth_category), 3),
('모발이식', 3, (SELECT id FROM teeth_category), 4);

-- depth3 입력 (바디 카테고리 하위)
WITH body_category AS (
 SELECT id FROM categories WHERE name = '바디' AND depth = 2
)
INSERT INTO categories (name, depth, parent_id, sort_order) VALUES
('지방흡입', 3, (SELECT id FROM body_category), 1),
('복부성형술', 3, (SELECT id FROM body_category), 2),
('힙업수술', 3, (SELECT id FROM body_category), 3);

-- depth3 입력 (제모 카테고리 하위)
WITH hair_removal_category AS (
 SELECT id FROM categories WHERE name = '제모' AND depth = 2
)
INSERT INTO categories (name, depth, parent_id, sort_order) VALUES
('속눈썹', 3, (SELECT id FROM hair_removal_category), 1),
('수염', 3, (SELECT id FROM hair_removal_category), 2),
('겨드랑이', 3, (SELECT id FROM hair_removal_category), 3),
('기타', 3, (SELECT id FROM hair_removal_category), 4);

-- depth3 입력 (여성전용 카테고리 하위)
WITH female_category AS (
 SELECT id FROM categories WHERE name = '여성전용' AND depth = 2
)
INSERT INTO categories (name, depth, parent_id, sort_order) VALUES
('질 성형수술', 3, (SELECT id FROM female_category), 1),
('소음순 성형술', 3, (SELECT id FROM female_category), 2);

-- depth3 입력 (지방성형 카테고리 하위)
WITH lipo_category AS (
 SELECT id FROM categories WHERE name = '지방성형' AND depth = 2
)
INSERT INTO categories (name, depth, parent_id, sort_order) VALUES
('흡입', 3, (SELECT id FROM lipo_category), 1),
('이식', 3, (SELECT id FROM lipo_category), 2);

-- depth3 입력 (필러/보톡스 카테고리 하위)
WITH filler_category AS (
 SELECT id FROM categories WHERE name = '필러/보톡스' AND depth = 2
)
INSERT INTO categories (name, depth, parent_id, sort_order) VALUES
('필러', 3, (SELECT id FROM filler_category), 1),
('보톡스', 3, (SELECT id FROM filler_category), 2);

-- depth3 입력 (lifting 카테고리 하위)
WITH lifting_category AS (
 SELECT id FROM categories WHERE name = 'lifting' AND depth = 2
)
INSERT INTO categories (name, depth, parent_id, sort_order) VALUES
('브이 리프팅', 3, (SELECT id FROM lifting_category), 1),
('미세 실 리프팅', 3, (SELECT id FROM lifting_category), 2),
('절개 리프팅', 3, (SELECT id FROM lifting_category), 3),
('비절개 리프팅', 3, (SELECT id FROM lifting_category), 4);

-- 인덱스 생성
CREATE INDEX idx_categories_depth ON categories(depth);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);