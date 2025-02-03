CREATE TABLE hospitals (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(200) NOT NULL,             
    city_id bigint REFERENCES cities(id),   
    business_hours text,                    
    address text NOT NULL,                  
    phone varchar(50),                      
    email varchar(100),                     
    website varchar(200),                   
    facebook_url varchar(200),              
    youtube_url varchar(200),               
    tiktok_url varchar(200),                
    instagram_url varchar(200),             
    zalo_id varchar(100),                   
    description text,                       
    thumbnail_url varchar(200),             
    detail_content text,                    
    latitude decimal(10,8),                 
    longitude decimal(11,8),                
    is_advertised boolean DEFAULT false,    
    is_recommended boolean DEFAULT false,   
    is_member boolean DEFAULT false,        
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE hospital_categories (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    hospital_id bigint REFERENCES hospitals(id) ON DELETE CASCADE,
    depth2_category_id bigint REFERENCES categories(id),
    depth3_category_id bigint REFERENCES categories(id),
    created_at timestamptz DEFAULT now(),
    
    UNIQUE(hospital_id, depth2_category_id, depth3_category_id)
);

ALTER TABLE hospitals
ADD COLUMN view_count bigint DEFAULT 0,
ADD COLUMN like_count bigint DEFAULT 0,
ADD COLUMN average_rating decimal(2,1) DEFAULT 0.0 
    CHECK (average_rating >= 0.0 AND average_rating <= 5.0),
ADD COLUMN has_discount boolean DEFAULT false,
ADD COLUMN comment_count bigint DEFAULT 0;

-- 단일 컬럼 인덱스
CREATE INDEX idx_hospitals_view_count ON hospitals (view_count DESC);
CREATE INDEX idx_hospitals_like_count ON hospitals (like_count DESC);
CREATE INDEX idx_hospitals_average_rating ON hospitals (average_rating DESC);
CREATE INDEX idx_hospitals_has_discount ON hospitals (has_discount);

-- 인덱스 생성
CREATE INDEX idx_hospitals_city ON hospitals(city_id);
CREATE INDEX idx_hospitals_member ON hospitals(is_member);
CREATE INDEX idx_hospitals_advertised ON hospitals(is_advertised);
CREATE INDEX idx_hospitals_recommended ON hospitals(is_recommended);
CREATE INDEX idx_hospital_categories_hospital ON hospital_categories(hospital_id);
CREATE INDEX idx_hospital_categories_depth2 ON hospital_categories(depth2_category_id);
CREATE INDEX idx_hospital_categories_depth3 ON hospital_categories(depth3_category_id);
CREATE INDEX idx_hospitals_comment_count ON hospitals (comment_count DESC);



----- 샘플 데이터 -----
INSERT INTO hospitals (
    name,
    city_id,
    business_hours,
    address,
    phone,
    email,
    website,
    facebook_url,
    instagram_url,
    zalo_id,
    description,
    thumbnail_url,
    detail_content,
    latitude,
    longitude,
    is_advertised,
    is_recommended,
    is_member
) VALUES
(
    'Beauty Medical Center',
    1, -- 호치민
    '월-금: 09:00-20:00\n토: 09:00-17:00\n일요일 휴무',
    '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    '+84-28-1234-5678',
    'contact@beautymedical.com',
    'https://beautymedical.com',
    'https://facebook.com/beautymedical',
    'https://instagram.com/beautymedical',
    'beautymedical123',
    '2015년에 설립된 뷰티 메디컬 센터는 최신 의료 장비와 숙련된 의료진을 보유하고 있습니다.',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d',
    '<div class="hospital-detail">
        <h2>최첨단 의료 시설을 갖춘 뷰티 메디컬 센터</h2>
        <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d" alt="병원 외관" style="width:100%; margin:20px 0;">
        <p>저희 병원은 최신 의료 장비와 숙련된 의료진을 보유하고 있습니다...</p>
        <div class="facility-images">
            <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d" alt="시설1">
            <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d" alt="시설2">
        </div>
    </div>',
    10.7769, 106.7009,
    true, true, true
),
(
    'Sunshine Aesthetic Clinic',
    2, -- 하노이
    '매일: 10:00-19:00',
    '456 Trang Tien, Hoan Kiem, Hanoi',
    '+84-24-9876-5432',
    'info@sunshineclinic.com',
    'https://sunshineclinic.com',
    'https://facebook.com/sunshineclinic',
    'https://instagram.com/sunshineclinic',
    'sunshine_clinic',
    '자연스러운 아름다움을 추구하는 선샤인 에스테틱 클리닉입니다.',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d',
    '<div class="hospital-detail">
        <h2>자연스러운 아름다움의 시작</h2>
        <div class="main-image">
            <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d" alt="클리닉 전경">
        </div>
        <p>10년 이상의 경력을 가진 전문의들이 함께합니다...</p>
    </div>',
    21.0245, 105.8412,
    false, true, true
),
(
    'VIP Beauty Center',
    3, -- 다낭
    '월-토: 09:30-18:30',
    '789 Bach Dang Street, Hai Chau, Da Nang',
    '+84-236-555-0199',
    'vipbeauty@gmail.com',
    'https://vipbeauty.com',
    'https://facebook.com/vipbeauty',
    'https://instagram.com/vipbeauty',
    'vipbeauty_danang',
    'VIP 뷰티 센터는 고객 만족도 1위를 자랑합니다.',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d',
    '<div class="hospital-detail">
        <h2>VIP 뷰티 센터의 특별한 서비스</h2>
        <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d" alt="VIP룸">
        <p>개인 맞춤형 프리미엄 서비스를 제공합니다...</p>
    </div>',
    16.0544, 108.2022,
    true, false, true
);

-- hospital_categories 테이블에 카테고리 매핑 데이터 추가
INSERT INTO hospital_categories (hospital_id, depth2_category_id, depth3_category_id) VALUES
(1, 3, 15),  -- 눈 - 쌍꺼풀 비절개
(1, 1, 1),   -- 코 - 코끝 성형
(2, 2, 8),   -- 가슴 - 가슴 리프팅
(2, 5, 23),  -- 피부 - anti-aging
(3, 6, 26);  -- 얼굴 - 사각턱 윤곽




----- 샘플데이터 추가 -----
-- 계속해서 4번째부터 10번째 병원 데이터 추가
INSERT INTO hospitals (
   name,
   city_id,
   business_hours,
   address,
   phone,
   email,
   website,
   facebook_url,
   instagram_url,
   zalo_id,
   description,
   thumbnail_url,
   detail_content,
   latitude,
   longitude,
   is_advertised,
   is_recommended,
   is_member
) VALUES
(
   'K-Beauty Premium Clinic',
   4, -- 나트랑
   '월-토: 10:00-20:00\n일: 10:00-15:00',
   '101 Tran Phu Street, Nha Trang City',
   '+84-258-1234-5678',
   'info@kbeautyclinic.com',
   'https://kbeautyclinic.com',
   'https://facebook.com/kbeautyclinic',
   'https://instagram.com/kbeautyclinic',
   'kbeauty_clinic',
   '한국의 선진 의료 기술을 베트남에서 만나보세요. K-Beauty Premium Clinic은 20년 이상의 노하우를 보유하고 있습니다.',
   'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
   '<div class="hospital-detail">
       <h2>K-Beauty Premium Clinic의 특별한 서비스</h2>
       <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d" alt="클리닉 내부" style="width:100%">
       <p>최신 의료 장비와 한국 의료진이 함께합니다...</p>
       <div class="facility-images">
           <img src="https://images.unsplash.com/photo-1590105577767-e21a1067899f" alt="시설1">
           <img src="https://images.unsplash.com/photo-1581056771107-24ca5f033842" alt="시설2">
       </div>
   </div>',
   12.2388, 109.1967,
   true, true, true
),
(
   'Modern Beauty Center',
   5, -- 호이안
   '매일: 09:00-18:00',
   '222 Cua Dai Road, Hoi An Ancient Town',
   '+84-235-9876-5432',
   'contact@modernbeauty.com',
   'https://modernbeauty.com',
   'https://facebook.com/modernbeauty',
   'https://instagram.com/modernbeauty',
   'modern_beauty',
   '현대적인 시설과 전통적인 케어가 조화를 이루는 모던 뷰티 센터입니다.',
   'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d',
   '<div class="hospital-detail">
       <h2>전통과 현대의 조화</h2>
       <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d" alt="센터 전경">
       <p>최신 기술과 전통적인 케어 방식의 완벽한 조화를 경험하세요...</p>
   </div>',
   15.8801, 108.3380,
   false, true, true
),
(
   'Star Plastic Surgery',
   1, -- 호치민
   '월-금: 09:00-21:00\n토: 09:00-18:00',
   '333 Le Loi Boulevard, District 1, HCMC',
   '+84-28-3333-4444',
   'star@starplastic.com',
   'https://starplastic.com',
   'https://facebook.com/starplastic',
   'https://instagram.com/starplastic',
   'star_plastic',
   '스타들이 선택한 프리미엄 성형외과입니다.',
   'https://images.unsplash.com/photo-1581056771107-24ca5f033842',
   '<div class="hospital-detail">
       <h2>최고의 실력과 신뢰성</h2>
       <img src="https://images.unsplash.com/photo-1581056771107-24ca5f033842" alt="수술실">
       <p>15년 이상의 경력을 가진 전문의들이 함께합니다...</p>
   </div>',
   10.7765, 106.7015,
   true, true, true
),
(
   'Royal Aesthetic Hospital',
   2, -- 하노이
   '매일: 08:30-20:30',
   '444 Kim Ma Street, Ba Dinh, Hanoi',
   '+84-24-7777-8888',
   'info@royalaesthetic.com',
   'https://royalaesthetic.com',
   'https://facebook.com/royalaesthetic',
   'https://instagram.com/royalaesthetic',
   'royal_aesthetic',
   '로얄 에스테틱 병원은 최고급 의료 서비스를 제공합니다.',
   'https://images.unsplash.com/photo-1590105577767-e21a1067899f',
   '<div class="hospital-detail">
       <h2>프리미엄 의료 서비스</h2>
       <img src="https://images.unsplash.com/photo-1590105577767-e21a1067899f" alt="병원 로비">
       <p>VIP 고객을 위한 특별한 서비스를 제공합니다...</p>
   </div>',
   21.0288, 105.8540,
   true, false, true
),
(
   'Fresh Beauty Clinic',
   3, -- 다낭
   '월-토: 10:00-19:00',
   '555 Nguyen Van Linh, Da Nang',
   '+84-236-6666-7777',
   'fresh@freshbeauty.com',
   'https://freshbeauty.com',
   'https://facebook.com/freshbeauty',
   'https://instagram.com/freshbeauty',
   'fresh_beauty',
   '자연스러운 아름다움을 추구하는 프레쉬 뷰티 클리닉입니다.',
   'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d',
   '<div class="hospital-detail">
       <h2>Natural Beauty</h2>
       <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d" alt="클리닉 전경">
       <p>자연스러운 아름다움을 위한 최선의 선택...</p>
   </div>',
   16.0548, 108.2028,
   false, true, false
),
(
   'Glamour Beauty Center',
   4, -- 나트랑
   '매일: 09:00-19:00',
   '666 Tran Phu, Nha Trang',
   '+84-258-8888-9999',
   'info@glamourbeauty.com',
   'https://glamourbeauty.com',
   'https://facebook.com/glamourbeauty',
   'https://instagram.com/glamourbeauty',
   'glamour_beauty',
   '글래머 뷰티 센터는 최신 트렌드를 선도합니다.',
   'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
   '<div class="hospital-detail">
       <h2>트렌디한 뷰티 케어</h2>
       <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d" alt="센터 내부">
       <p>최신 트렌드와 기술을 만나보세요...</p>
   </div>',
   12.2392, 109.1969,
   true, false, true
),
(
   'Perfect Line Clinic',
   5, -- 호이안
   '월-토: 08:00-17:00',
   '777 Hai Ba Trung, Hoi An',
   '+84-235-2222-3333',
   'perfect@perfectline.com',
   'https://perfectline.com',
   'https://facebook.com/perfectline',
   'https://instagram.com/perfectline',
   'perfect_line',
   '완벽한 라인을 만드는 퍼펙트 라인 클리닉입니다.',
   'https://images.unsplash.com/photo-1581056771107-24ca5f033842',
   '<div class="hospital-detail">
       <h2>Perfect Line for Perfect Beauty</h2>
       <img src="https://images.unsplash.com/photo-1581056771107-24ca5f033842" alt="클리닉 시설">
       <p>당신만을 위한 맞춤형 솔루션을 제공합니다...</p>
   </div>',
   15.8805, 108.3385,
   false, true, false
);

-- 추가 hospital_categories 매핑
INSERT INTO hospital_categories (hospital_id, depth2_category_id, depth3_category_id) VALUES
(4, 4, 21),  -- 입술 - 입꼬리
(4, 7, 29),  -- 광대 - 광대 윤곽
(5, 5, 24),  -- 피부 - 모공
(5, 9, 34),  -- 바디 - 지방흡입
(6, 3, 17),  -- 눈 - 안검하수
(6, 6, 27),  -- 얼굴 - 턱 윤곽
(7, 1, 2),   -- 코 - 콧대 확대
(7, 2, 9),   -- 가슴 - 가슴 확대
(8, 8, 30),  -- 치아 - 치아 미백
(8, 10, 37), -- 제모 - 속눈썹
(9, 11, 41), -- 여성전용 - 질 성형수술
(9, 5, 25),  -- 피부 - 흉터
(10, 3, 16), -- 눈 - 쌍거풀 부분절개
(10, 7, 29); -- 광대 - 광대 윤곽
