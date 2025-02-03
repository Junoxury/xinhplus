-- 리뷰 데이터 삽입
INSERT INTO reviews (title, content, view_count, like_count, author_id, treatment_id, clinic_id, status, is_verified) 
VALUES 
  (
    '자연스러운 쌍커풀 수술 후기',
    '자연스러운 라인의 쌍커풀 수술 과정과 결과가 매우 만족스러웠습니다. 수술 후 붓기가 빠르게 가라앉았고, 회복 기간도 예상보다 짧았어요. 의사선생님의 섬세한 시술과 친절한 설명 덕분에 안심하고 수술을 받을 수 있었습니다.',
    1234, 45, 
    '123e4567-e89b-12d3-a456-426614174000',
    1,
    1,
    'published',
    true
  ),
  (
    '코필러 시술 후기 공유해요',
    '코필러 시술 받은 지 2주 되었어요. 자연스러운 라인으로 높아진 코가 정말 마음에 듭니다. 통증도 적고 회복도 빨랐어요. 시술 전 걱정했던 것보다 훨씬 만족스러운 결과를 얻었습니다.',
    892, 32,
    '123e4567-e89b-12d3-a456-426614174001',
    2,
    2,
    'published',
    true
  ),
  (
    'V라인 리프팅 시술 경험담',
    'V라인 리프팅 시술 받았어요. 턱선이 날카로워지고 얼굴이 한층 갸름해졌네요. 시술 과정도 편안했고 자연스러운 결과물에 매우 만족합니다.',
    1567, 67,
    '123e4567-e89b-12d3-a456-426614174002',
    3,
    3,
    'published',
    true
  ),
  (
    '볼 지방이식 후기입니다',
    '지방이식으로 볼륨감 있는 얼굴로 변신했어요. 자연스러운 결과물에 매우 만족합니다. 시술 후 관리도 잘 설명해주셔서 회복도 순조롭게 진행되었어요.',
    743, 28,
    '123e4567-e89b-12d3-a456-426614174003',
    4,
    4,
    'published',
    true
  ),
  (
    '울쎄라 리프팅 시술 후기',
    '울쎄라 리프팅으로 탄력 있는 피부를 되찾았어요. 즉각적인 리프팅 효과가 놀라웠습니다. 시술 후 관리법도 자세히 설명해주셔서 좋았어요.',
    1123, 52,
    '123e4567-e89b-12d3-a456-426614174004',
    5,
    5,
    'published',
    true
  ),
  (
    '눈밑 지방재배치 수술 후기',
    '눈밑 지방재배치 수술로 다크서클이 확실히 개선되었어요. 자연스러운 결과물이 정말 마음에 듭니다. 수술 후 붓기 관리도 잘 된 것 같아요.',
    987, 41,
    '123e4567-e89b-12d3-a456-426614174005',
    6,
    1,
    'published',
    true
  ),
  (
    '레이저 토닝 시술 후기',
    '레이저 토닝으로 피부톤이 확실히 개선되었어요. 잡티가 옅어지고 피부결도 매끈해졌습니다. 정기적으로 관리하면 더 좋은 결과가 있을 것 같아요.',
    856, 35,
    '123e4567-e89b-12d3-a456-426614174006',
    7,
    2,
    'published',
    true
  ),
  (
    '실리프팅 시술 후기 공유',
    '실리프팅으로 처진 피부를 개선했어요. 자연스러운 리프팅 효과가 오래 지속되네요. 시술 과정도 생각보다 편안했습니다.',
    1034, 48,
    '123e4567-e89b-12d3-a456-426614174007',
    8,
    3,
    'published',
    true
  ),
  (
    '보톡스 시술 후기입니다',
    '보톡스로 자연스러운 주름 개선 효과를 봤어요. 표정은 자연스럽게 유지되면서 주름만 개선되었습니다. 시술 후 일상생활에 바로 복귀할 수 있어서 좋았어요.',
    912, 39,
    '123e4567-e89b-12d3-a456-426614174008',
    9,
    4,
    'published',
    true
  ),
  (
    '입술 필러 시술 후기',
    '입술 필러로 자연스러운 볼륨감을 만들었어요. 과하지 않고 예쁜 입술라인이 만들어졌네요. 시술 후 붓기도 빨리 가라앉아서 만족스러웠습니다.',
    967, 43,
    '123e4567-e89b-12d3-a456-426614174009',
    10,
    5,
    'published',
    true
  );

-- 리뷰 이미지 데이터 삽입
INSERT INTO review_images (review_id, image_url, image_type, display_order) 
VALUES 
  (1, 'https://images.unsplash.com/photo-1516549655169-df83a0774514', 'after', 1),
  (1, 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7', 'before', 2),
  (2, 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c', 'after', 1),
  (2, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e', 'before', 2),
  (3, 'https://images.unsplash.com/photo-1576091160550-2173dba999ef', 'after', 1),
  (3, 'https://images.unsplash.com/photo-1578496781985-452d4a934d50', 'before', 2),
  (4, 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9', 'after', 1),
  (4, 'https://images.unsplash.com/photo-1620331311520-246422fd82f9', 'before', 2),
  (5, 'https://images.unsplash.com/photo-1608501947097-86951ad73fea', 'after', 1),
  (5, 'https://images.unsplash.com/photo-1596704017254-9b121068fb31', 'before', 2),
  (6, 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6', 'after', 1),
  (6, 'https://images.unsplash.com/photo-1522849696084-818b37dab228', 'before', 2),
  (7, 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c', 'after', 1),
  (7, 'https://images.unsplash.com/photo-1515688594390-b649af70d282', 'before', 2),
  (8, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e', 'after', 1),
  (8, 'https://images.unsplash.com/photo-1594824476967-48c8b964273f', 'before', 2),
  (9, 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c', 'after', 1),
  (9, 'https://images.unsplash.com/photo-1516549655169-df83a0774514', 'before', 2),
  (10, 'https://images.unsplash.com/photo-1513379733131-47fc74b45fc7', 'after', 1),
  (10, 'https://images.unsplash.com/photo-1588528402605-1f9d0eb7a6d6', 'before', 2);

-- 리뷰 댓글 데이터 삽입
INSERT INTO review_comments (review_id, content, like_count, author_id) 
VALUES 
  (1, '저도 이 병원에서 수술했는데 정말 만족스러웠어요!', 5, '123e4567-e89b-12d3-a456-426614174010'),
  (1, '수술 후 붓기는 얼마나 지속되었나요?', 3, '123e4567-e89b-12d3-a456-426614174011'),
  (2, '자연스러워 보이네요. 정말 좋은 결과인 것 같아요.', 4, '123e4567-e89b-12d3-a456-426614174012'),
  (3, '효과가 오래 지속되나요?', 2, '123e4567-e89b-12d3-a456-426614174013'),
  (4, '회복기간이 궁금해요!', 3, '123e4567-e89b-12d3-a456-426614174014');

-- 리뷰 카테고리 연결 데이터 삽입
INSERT INTO review_categories (review_id, category_id) 
VALUES 
  (1, 1), -- 눈성형
  (1, 2), -- 쌍커풀
  (2, 3), -- 코성형
  (2, 4), -- 필러
  (3, 5), -- 안면윤곽
  (3, 6), -- 리프팅
  (4, 7), -- 지방이식
  (5, 6), -- 리프팅
  (5, 8); -- 피부관리

-- 리뷰 좋아요 데이터 삽입
INSERT INTO review_likes (review_id, user_id) 
VALUES 
  (1, '123e4567-e89b-12d3-a456-426614174015'),
  (1, '123e4567-e89b-12d3-a456-426614174016'),
  (2, '123e4567-e89b-12d3-a456-426614174017'),
  (3, '123e4567-e89b-12d3-a456-426614174018'),
  (4, '123e4567-e89b-12d3-a456-426614174019'); 