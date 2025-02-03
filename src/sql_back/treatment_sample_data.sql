-- 시술정보 샘플 데이터
INSERT INTO treatments (
    hospital_id,
    title,
    summary,
    city_id,
    rating,
    thumbnail_url,
    detail_content,
    price,
    discount_price,
    discount_rate,
    is_advertised,
    is_recommended,
    is_discounted
) VALUES
(1, '자연스러운 쌍꺼풀 수술', 
'부기가 적고 회복이 빠른 자연스러운 쌍꺼풀 수술로 자연스러운 라인 형성',
1, 4.8,
'https://images.unsplash.com/photo-1581093458791-9d3a9f0000fa',
'<div class="treatment-detail">
    <div class="hero-section">
        <img src="https://images.unsplash.com/photo-1581093458791-9d3a9f0000fa" alt="쌍꺼풀 수술 전후" class="w-full h-96 object-cover">
        <h1 class="text-3xl font-bold mt-6">자연스러운 쌍꺼풀 수술</h1>
    </div>
    <div class="content-section mt-8">
        <div class="before-after grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1581093458791-9d3a9f0000fb" alt="수술 전" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458791-9d3a9f0000fc" alt="수술 후" class="rounded-lg">
        </div>
        <div class="description mt-6">
            <h2 class="text-xl font-semibold">시술 상세 설명</h2>
            <p class="mt-4">자연스러운 라인의 쌍꺼풀을 만드는 수술로, 개인의 눈 특성에 맞춘 맞춤형 수술입니다.</p>
        </div>
        <div class="process mt-6">
            <h2 class="text-xl font-semibold">시술 과정</h2>
            <ol class="list-decimal pl-5 mt-4">
                <li>상담 및 디자인</li>
                <li>마취</li>
                <li>절개선 표시</li>
                <li>수술 진행</li>
                <li>봉합</li>
            </ol>
        </div>
    </div>
</div>',
2000000, 1800000, 10, true, true, true),

(2, '코 필러로 높은 콧대 만들기', 
'15분 시술로 자연스럽게 높아지는 코필러',
1, 4.5,
'https://images.unsplash.com/photo-1581093458792-9d3a9f0000fd',
'<div class="treatment-detail">
    <div class="hero-section">
        <img src="https://images.unsplash.com/photo-1581093458792-9d3a9f0000fd" alt="코필러 시술" class="w-full h-96 object-cover">
        <h1 class="text-3xl font-bold mt-6">코 필러 시술</h1>
    </div>
    <div class="content-section mt-8">
        <div class="gallery grid grid-cols-3 gap-4">
            <img src="https://images.unsplash.com/photo-1581093458792-1" alt="시술 과정 1" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458792-2" alt="시술 과정 2" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458792-3" alt="시술 과정 3" class="rounded-lg">
        </div>
        <div class="description mt-6">
            <h2 class="text-xl font-semibold">시술 장점</h2>
            <ul class="list-disc pl-5 mt-4">
                <li>빠른 시술 시간</li>
                <li>자연스러운 결과</li>
                <li>부기가 적음</li>
            </ul>
        </div>
    </div>
</div>',
800000, 600000, 25, true, false, true),

(3, '울쎄라 리프팅', 
'초음파로 피부 탄력 개선하는 울쎄라 리프팅',
2, 4.7,
'https://images.unsplash.com/photo-1581093458793-9d3a9f0000fe',
'<div class="treatment-detail">
    <div class="hero-section">
        <img src="https://images.unsplash.com/photo-1581093458793-9d3a9f0000fe" alt="울쎄라 시술" class="w-full h-96 object-cover">
        <h1 class="text-3xl font-bold mt-6">울쎄라 리프팅</h1>
    </div>
    <div class="content-section mt-8">
        <div class="before-after grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1581093458793-1" alt="시술 전" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458793-2" alt="시술 후" class="rounded-lg">
        </div>
        <div class="effects mt-6">
            <h2 class="text-xl font-semibold">시술 효과</h2>
            <p class="mt-4">피부 깊숙한 층까지 초음파 에너지를 전달하여 탄력 있는 피부로 개선됩니다.</p>
        </div>
    </div>
</div>',
3000000, 2700000, 10, false, true, true),

(4, '가슴 확대 수술', 
'자연스러운 실리콘 가슴 확대술로 이상적인 바디라인 형성',
1, 4.9,
'https://images.unsplash.com/photo-1581093458794-9d3a9f0000ff',
'<div class="treatment-detail">
    <div class="hero-section">
        <img src="https://images.unsplash.com/photo-1581093458794-9d3a9f0000ff" alt="가슴 확대 수술" class="w-full h-96 object-cover">
        <h1 class="text-3xl font-bold mt-6">가슴 확대 수술</h1>
    </div>
    <div class="content-section mt-8">
        <div class="before-after grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1581093458794-1" alt="수술 전" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458794-2" alt="수술 후" class="rounded-lg">
        </div>
        <div class="features mt-6">
            <h2 class="text-xl font-semibold">수술 특징</h2>
            <ul class="list-disc pl-5 mt-4">
                <li>개인 맞춤형 사이즈 선택</li>
                <li>최소 절개</li>
                <li>빠른 회복</li>
            </ul>
        </div>
    </div>
</div>',
8000000, 7200000, 10, true, true, true),

(5, '지방흡입', 
'최신 장비를 활용한 부위별 지방흡입으로 날씬한 바디라인',
2, 4.6,
'https://images.unsplash.com/photo-1581093458795-9d3a9f0000fg',
'<div class="treatment-detail">
    <div class="hero-section">
        <img src="https://images.unsplash.com/photo-1581093458795-9d3a9f0000fg" alt="지방흡입" class="w-full h-96 object-cover">
        <h1 class="text-3xl font-bold mt-6">부위별 지방흡입</h1>
    </div>
    <div class="content-section mt-8">
        <div class="gallery grid grid-cols-3 gap-4">
            <img src="https://images.unsplash.com/photo-1581093458795-1" alt="시술 사례 1" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458795-2" alt="시술 사례 2" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458795-3" alt="시술 사례 3" class="rounded-lg">
        </div>
        <div class="areas mt-6">
            <h2 class="text-xl font-semibold">시술 가능 부위</h2>
            <ul class="list-disc pl-5 mt-4">
                <li>복부</li>
                <li>허벅지</li>
                <li>팔뚝</li>
            </ul>
        </div>
    </div>
</div>',
5000000, 4500000, 10, false, true, true),

(6, '안면 윤곽 수술', 
'V라인 페이스 라인을 위한 안면윤곽 수술',
3, 4.8,
'https://images.unsplash.com/photo-1581093458796-9d3a9f0000fh',
'<div class="treatment-detail">
    <div class="hero-section">
        <img src="https://images.unsplash.com/photo-1581093458796-9d3a9f0000fh" alt="안면윤곽" class="w-full h-96 object-cover">
        <h1 class="text-3xl font-bold mt-6">안면윤곽 수술</h1>
    </div>
    <div class="content-section mt-8">
        <div class="before-after grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1581093458796-1" alt="수술 전" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458796-2" alt="수술 후" class="rounded-lg">
        </div>
        <div class="procedure mt-6">
            <h2 class="text-xl font-semibold">수술 과정</h2>
            <ol class="list-decimal pl-5 mt-4">
                <li>3D CT 촬영</li>
                <li>수술 계획 수립</li>
                <li>절개 및 수술</li>
                <li>회복 관리</li>
            </ol>
        </div>
    </div>
</div>',
7000000, 6300000, 10, true, false, true),

(7, '모발이식', 
'자연스러운 헤어라인 형성을 위한 모발이식',
1, 4.7,
'https://images.unsplash.com/photo-1581093458797-9d3a9f0000fi',
'<div class="treatment-detail">
    <div class="hero-section">
        <img src="https://images.unsplash.com/photo-1581093458797-9d3a9f0000fi" alt="모발이식" class="w-full h-96 object-cover">
        <h1 class="text-3xl font-bold mt-6">자연스러운 모발이식</h1>
    </div>
    <div class="content-section mt-8">
        <div class="process-images grid grid-cols-4 gap-4">
            <img src="https://images.unsplash.com/photo-1581093458797-1" alt="과정 1" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458797-2" alt="과정 2" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458797-3" alt="과정 3" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458797-4" alt="과정 4" class="rounded-lg">
        </div>
        <div class="benefits mt-6">
            <h2 class="text-xl font-semibold">시술 장점</h2>
            <ul class="list-disc pl-5 mt-4">
                <li>자연스러운 헤어라인</li>
                <li>최소 통증</li>
                <li>빠른 회복</li>
            </ul>
        </div>
    </div>
</div>',
6000000, 5400000, 10, false, true, false),

(8, '치아 교정', 
'투명 교정으로 편안하고 자연스러운 치아 교정',
2, 4.6,
'https://images.unsplash.com/photo-1581093458798-9d3a9f0000fj',
'<div class="treatment-detail">
    <div class="hero-section">
        <img src="https://images.unsplash.com/photo-1581093458798-9d3a9f0000fj" alt="치아 교정" class="w-full h-96 object-cover">
        <h1 class="text-3xl font-bold mt-6">투명 교정 시술</h1>
    </div>
    <div class="content-section mt-8">
        <div class="before-after grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1581093458798-1" alt="교정 전" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458798-2" alt="교정 후" class="rounded-lg">
        </div>
        <div class="advantages mt-6">
            <h2 class="text-xl font-semibold">교정 장점</h2>
            <ul class="list-disc pl-5 mt-4">
                <li>눈에 띄지 않는 교정</li>
                <li>편안한 착용감</li>
                <li>효과적인 교정</li>
            </ul>
        </div>
    </div>
</div>',
4000000, 3600000, 10, true, true, true),

(9, '레이저 피부 관리', 
'첨단 레이저로 피부 톤과 결 개선',
3, 4.4,
'https://images.unsplash.com/photo-1581093458799-9d3a9f0000fk',
'<div class="treatment-detail">
    <div class="hero-section">
        <img src="https://images.unsplash.com/photo-1581093458799-9d3a9f0000fk" alt="레이저 관리" class="w-full h-96 object-cover">
        <h1 class="text-3xl font-bold mt-6">레이저 피부 관리</h1>
    </div>
    <div class="content-section mt-8">
        <div class="results grid grid-cols-3 gap-4">
            <img src="https://images.unsplash.com/photo-1581093458799-1" alt="관리 결과 1" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458799-2" alt="관리 결과 2" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458799-3" alt="관리 결과 3" class="rounded-lg">
        </div>
        <div class="effects mt-6">
            <h2 class="text-xl font-semibold">관리 효과</h2>
            <ul class="list-disc pl-5 mt-4">
                <li>피부 톤 개선</li>
                <li>모공 축소</li>
                <li>피부결 개선</li>
            </ul>
        </div>
    </div>
</div>',
300000, 250000, 17, false, true, true),

(10, '보톡스', 
'자연스러운 주름 개선을 위한 보톡스 시술',
1, 4.5,
'https://images.unsplash.com/photo-1581093458800-9d3a9f0000fl',
'<div class="treatment-detail">
    <div class="hero-section">
        <img src="https://images.unsplash.com/photo-1581093458800-9d3a9f0000fl" alt="보톡스" class="w-full h-96 object-cover">
        <h1 class="text-3xl font-bold mt-6">보톡스 시술</h1>
    </div>
    <div class="content-section mt-8">
        <div class="treatment-areas grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1581093458800-1" alt="시술 부위 1" class="rounded-lg">
            <img src="https://images.unsplash.com/photo-1581093458800-2" alt="시술 부위 2" class="rounded-lg">
        </div>
        <div class="areas mt-6">
            <h2 class="text-xl font-semibold">시술 가능 부위</h2>
            <ul class="list-disc pl-5 mt-4">
                <li>미간</li>
                <li>눈가</li>
                <li>이마</li>
                <li>입가</li>
            </ul>
        </div>
    </div>
</div>',
500000, 400000, 20, true, false, true);

-- 시술-카테고리 매핑 샘플 데이터
INSERT INTO treatment_categories (treatment_id, depth2_category_id, depth3_category_id) VALUES
(1, 3, 18),  -- 눈 - 쌍꺼풀 비절개
(1, 3, 19),  -- 눈 - 쌍꺼풀 부분절개
(2, 6, 19),   -- 코 - 코끝 성형
(2, 6, 20),   -- 코 - 콧대 확대
(3, 5, 23),  -- 피부 - anti-aging
(3, 13, 44), -- 필러/보톡스 - 필러
(4, 9, 22),   -- 가슴 - 가슴 리프팅
(4, 9, 51),   -- 가슴 - 가슴 확대
(5, 9, 34),  -- 바디 - 지방흡입
(5, 12, 42), -- 지방성형 - 흡입
(6, 6, 26),  -- 얼굴 - 사각턱 윤곽
(6, 6, 27),  -- 얼굴 - 턱 윤곽
(7, 8, 31),  -- 치아 - 모발이식
(8, 8, 30),  -- 치아 - 치아 미백
(8, 8, 31),  -- 치아 - 루미니어
(9, 5, 23),  -- 피부 - anti-aging
(9, 5, 24),  -- 피부 - 모공
(10, 13, 45); -- 필러/보톡스 - 보톡스

-- 나머지 시술들의 카테고리 매핑도 계속됩니다...