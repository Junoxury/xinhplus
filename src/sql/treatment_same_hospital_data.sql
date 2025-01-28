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
(4, '자연스러운 쌍꺼풀 수술', 
'부기가 적고 회복이 빠른 자연스러운 쌍꺼풀 수술로 자연스러운 라인 형성',
1, 4.8,
'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F4bb071a4b305e6ddf23c787862d12652%2Fbanner_img_1724304465.jpg&w=384&q=75',
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

(4, '코 필러로 높은 콧대 만들기', 
'15분 시술로 자연스럽게 높아지는 코필러',
1, 4.5,
'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F4bb071a4b305e6ddf23c787862d12652%2Fbanner_img_1724304465.jpg&w=384&q=75',
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

(4, '울쎄라 리프팅', 
'초음파로 피부 탄력 개선하는 울쎄라 리프팅',
2, 4.7,
'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F4bb071a4b305e6ddf23c787862d12652%2Fbanner_img_1724304465.jpg&w=384&q=75',
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
'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F4bb071a4b305e6ddf23c787862d12652%2Fbanner_img_1724304465.jpg&w=384&q=75',
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

(4, '지방흡입', 
'최신 장비를 활용한 부위별 지방흡입으로 날씬한 바디라인',
2, 4.6,
'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F4bb071a4b305e6ddf23c787862d12652%2Fbanner_img_1724304465.jpg&w=384&q=75',
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
5000000, 4500000, 10, false, true, true)