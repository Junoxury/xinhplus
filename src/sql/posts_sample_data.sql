-- 태그 데이터 삽입
INSERT INTO tags (name, slug) VALUES
  ('쌍커풀', 'double-eyelid'),
  ('코필러', 'nose-filler'),
  ('보톡스', 'botox'),
  ('리프팅', 'lifting'),
  ('피부관리', 'skin-care'),
  ('눈성형', 'eye-surgery'),
  ('안면윤곽', 'facial-contouring'),
  ('가슴성형', 'breast-surgery'),
  ('지방이식', 'fat-grafting'),
  ('턱성형', 'jaw-surgery');

-- 포스트 데이터 삽입
INSERT INTO posts (title, content, thumbnail_url, status, author_id, slug, meta_description, published_at) VALUES
  (
    '자연스러운 쌍커풀 수술의 모든 것',
    '# 쌍커풀 수술 완벽 가이드

![수술 상담](/images/treatments/eye-surgery-1.jpg)

안녕하세요, 오늘은 쌍커풀 수술의 모든 것을 알려드리려고 합니다.

## 1. 수술 방법 선택
- 절개법: 정교한 라인 형성
- 매몰법: 빠른 회복
- 부분절개법: 절개법과 매몰법의 장점

![수술 과정](/images/treatments/eye-surgery-2.jpg)

## 2. 회복 과정
1주차부터 6주차까지의 상세한 회복 과정과 주의사항을 설명드립니다.

## 3. 수술 후 관리법
자세한 내용은 본문을 확인해주세요.',
    '/images/treatments/eye-surgery-1.jpg',
    'published',
    '10211088-e960-442d-9f71-8c539a4f638a',
    'complete-guide-to-double-eyelid-surgery',
    '자연스러운 쌍커풀 수술의 모든 것을 상세히 알아봅니다.',
    NOW()
  ),
  (
    '코필러로 높은 코 만들기',
    '# 코필러 시술 가이드

![코필러 시술](/images/treatments/nose-filler-1.jpg)

코필러는 수술 없이 코를 높이는 대표적인 시술입니다.

## 1. 필러의 종류
- HA필러
- PMMA필러
- 콜라겐 필러

![시술 결과](/images/treatments/nose-filler-2.jpg)

## 2. 시술 과정
상세한 시술 과정과 주의사항을 설명합니다.',
    '/images/treatments/nose-filler-1.jpg',
    'published',
    '10211088-e960-442d-9f71-8c539a4f638a',
    'nose-filler-guide',
    '코필러 시술의 모든 것을 상세히 알아봅니다.',
    NOW()
  ),
  (
    '보톡스 시술의 진실과 오해',
    '# 보톡스 시술 가이드

![보톡스 시술](/images/treatments/botox-1.jpg)

보톡스에 대한 진실과 오해를 파헤쳐봅니다.

## 1. 보톡스의 원리
작용 원리와 효과에 대해 설명합니다.

![시술 부위](/images/treatments/botox-2.jpg)

## 2. 주의사항
시술 전후 주의사항을 상세히 설명합니다.',
    '/images/treatments/botox-1.jpg',
    'published',
    '10211088-e960-442d-9f71-8c539a4f638a',
    'truth-about-botox',
    '보톡스 시술에 대한 진실과 오해를 파헤칩니다.',
    NOW()
  ),
  (
    '안면윤곽 수술 전 체크리스트',
    '# 안면윤곽 수술 가이드

![안면윤곽](/images/treatments/facial-contouring-1.jpg)

완벽한 V라인을 위한 안면윤곽 수술 체크리스트입니다.

## 1. 수술 방법
다양한 수술 방법과 장단점을 설명합니다.

![수술 결과](/images/treatments/facial-contouring-2.jpg)

## 2. 회복 과정
상세한 회복 과정과 관리법을 설명합니다.',
    '/images/treatments/facial-contouring-1.jpg',
    'published',
    '10211088-e960-442d-9f71-8c539a4f638a',
    'facial-contouring-checklist',
    '안면윤곽 수술의 체크리스트와 주의사항을 상세히 설명합니다.',
    NOW()
  ),
  (
    '지방이식으로 자연스러운 볼륨 만들기',
    '# 지방이식 시술 가이드

![지방이식](/images/treatments/fat-grafting-1.jpg)

자연스러운 볼륨을 위한 지방이식 가이드입니다.

## 1. 시술 과정
상세한 시술 과정을 설명합니다.

![시술 결과](/images/treatments/fat-grafting-2.jpg)

## 2. 관리법
시술 후 관리법과 주의사항을 설명합니다.',
    '/images/treatments/fat-grafting-1.jpg',
    'published',
    '10211088-e960-442d-9f71-8c539a4f638a',
    'natural-volume-with-fat-grafting',
    '지방이식으로 자연스러운 볼륨을 만드는 방법을 설명합니다.',
    NOW()
  ),
  (
    '리프팅 시술의 종류와 특징',
    '# 리프팅 시술 가이드

![리프팅](/images/treatments/lifting-1.jpg)

다양한 리프팅 시술의 특징을 비교해봅니다.

## 1. 시술 종류
- 실리프팅
- 울쎄라
- 써마지

![시술 비교](/images/treatments/lifting-2.jpg)

## 2. 효과 비교
각 시술별 효과와 지속기간을 비교합니다.',
    '/images/treatments/lifting-1.jpg',
    'published',
    '10211088-e960-442d-9f71-8c539a4f638a',
    'types-of-lifting-procedures',
    '다양한 리프팅 시술의 특징과 효과를 비교 분석합니다.',
    NOW()
  ),
  (
    '가슴성형 수술 전 알아야 할 것들',
    '# 가슴성형 수술 가이드

![가슴성형](/images/treatments/breast-surgery-1.jpg)

가슴성형 수술의 모든 것을 알려드립니다.

## 1. 보형물 선택
다양한 보형물의 특징을 설명합니다.

![수술 방법](/images/treatments/breast-surgery-2.jpg)

## 2. 수술 방법
수술 방법과 회복 과정을 설명합니다.',
    '/images/treatments/breast-surgery-1.jpg',
    'published',
    '10211088-e960-442d-9f71-8c539a4f638a',
    'breast-surgery-guide',
    '가슴성형 수술의 모든 것을 상세히 설명합니다.',
    NOW()
  ),
  (
    '턱성형으로 완성하는 小얼굴',
    '# 턱성형 수술 가이드

![턱성형](/images/treatments/jaw-surgery-1.jpg)

작은 얼굴을 위한 턱성형 가이드입니다.

## 1. 수술 방법
다양한 수술 방법을 설명합니다.

![수술 결과](/images/treatments/jaw-surgery-2.jpg)

## 2. 회복 과정
상세한 회복 과정을 설명합니다.',
    '/images/treatments/jaw-surgery-1.jpg',
    'published',
    '10211088-e960-442d-9f71-8c539a4f638a',
    'jaw-surgery-for-small-face',
    '턱성형으로 작은 얼굴을 만드는 방법을 설명합니다.',
    NOW()
  ),
  (
    '피부관리의 기본과 심화',
    '# 피부관리 가이드

![피부관리](/images/treatments/skin-care-1.jpg)

완벽한 피부를 위한 관리법을 소개합니다.

## 1. 기본 관리
일상적인 피부 관리법을 설명합니다.

![관리법](/images/treatments/skin-care-2.jpg)

## 2. 전문 관리
전문적인 피부 관리 방법을 소개합니다.',
    '/images/treatments/skin-care-1.jpg',
    'published',
    '10211088-e960-442d-9f71-8c539a4f638a',
    'skin-care-basics-and-advanced',
    '기본부터 심화까지, 완벽한 피부관리 방법을 설명합니다.',
    NOW()
  ),
  (
    '눈성형 트렌드 2024',
    '# 2024 눈성형 트렌드

![눈성형](/images/treatments/eye-surgery-3.jpg)

2024년 눈성형 트렌드를 소개합니다.

## 1. 최신 트렌드
현재 인기 있는 눈성형을 소개합니다.

![트렌드](/images/treatments/eye-surgery-4.jpg)

## 2. 시술 비교
다양한 시술의 장단점을 비교합니다.',
    '/images/treatments/eye-surgery-3.jpg',
    'published',
    '10211088-e960-442d-9f71-8c539a4f638a',
    'eye-surgery-trends-2024',
    '2024년 최신 눈성형 트렌드와 시술을 소개합니다.',
    NOW()
  );

-- posts_tags 관계 데이터 삽입
INSERT INTO posts_tags (post_id, tag_id) VALUES
  (1, 1), -- 쌍커풀
  (1, 6), -- 눈성형
  (2, 2), -- 코필러
  (3, 3), -- 보톡스
  (4, 7), -- 안면윤곽
  (4, 10), -- 턱성형
  (5, 9), -- 지방이식
  (6, 4), -- 리프팅
  (7, 8), -- 가슴성형
  (8, 10), -- 턱성형
  (9, 5), -- 피부관리
  (10, 6); -- 눈성형
