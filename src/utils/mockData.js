export const mockNewsData = [
  {
    id: 'news-1',
    type: 'news',
    title: '서울 언더그라운드 전자음악 신의 부상',
    slug: 'seoul-underground-electronic-music-scene-rise',
    description: '서울의 언더그라운드 전자음악 신이 글로벌 주목을 받고 있습니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    publishedAt: '2025-03-15T09:00:00Z',
    author: {
      id: 'author-1',
      name: '김지훈',
      profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5'
    },
    categories: ['국내', '테크노'],
    tags: ['서울', '언더그라운드', '전자음악'],
    viewCount: 1240,
    likeCount: 89,
    hasMedia: true,
    mediaType: 'tts'
  },
  {
    id: 'news-2',
    type: 'news',
    title: '베를린 클럽 베르그하인, 25주년 기념 이벤트 개최',
    slug: 'berghain-25th-anniversary-event',
    description: '전설적인 베를린 클럽 베르그하인이 25주년을 맞아 특별 이벤트를 개최합니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    publishedAt: '2025-03-12T15:30:00Z',
    author: {
      id: 'author-2',
      name: '박서연',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'
    },
    categories: ['유럽', '이벤트'],
    tags: ['베를린', '베르그하인', '테크노', '클럽'],
    viewCount: 2150,
    likeCount: 178,
    hasMedia: true,
    mediaType: 'tts'
  },
  {
    id: 'news-3',
    type: 'news',
    title: '새로운 아날로그 신디사이저 출시, 레트로 사운드의 귀환',
    slug: 'new-analog-synthesizer-release',
    description: '최신 아날로그 신디사이저가 출시되어 레트로 사운드의 귀환을 알립니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04',
    publishedAt: '2025-03-10T11:45:00Z',
    author: {
      id: 'author-3',
      name: '이민준',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
    },
    categories: ['장비', '트렌드'],
    tags: ['신디사이저', '아날로그', '음악 장비'],
    viewCount: 1560,
    likeCount: 112,
    hasMedia: true,
    mediaType: 'tts'
  },
  {
    id: 'news-4',
    type: 'news',
    title: '디트로이트 테크노의 선구자 제프 밀스, 아시아 투어 발표',
    slug: 'jeff-mills-asia-tour-announcement',
    description: '디트로이트 테크노의 선구자 제프 밀스가 아시아 투어를 발표했습니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    publishedAt: '2025-03-08T16:20:00Z',
    author: {
      id: 'author-1',
      name: '김지훈',
      profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5'
    },
    categories: ['아시아', '아티스트'],
    tags: ['제프 밀스', '디트로이트', '테크노', '투어'],
    viewCount: 1890,
    likeCount: 145,
    hasMedia: true,
    mediaType: 'tts'
  }
];

export const mockStationData = [
  {
    id: 'station-1',
    type: 'station',
    title: '레이트 나이트 도쿄',
    slug: 'late-night-tokyo',
    description: '도쿄 언더그라운드 신의 최신 트랙을 담은 딥 하우스와 테크노 믹스',
    thumbnailUrl: 'https://images.unsplash.com/photo-1553532434-5ab5b6b84993',
    publishedAt: '2025-03-14T20:00:00Z',
    author: {
      id: 'curator-1',
      name: 'DJ 하루',
      profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5'
    },
    categories: ['딥 하우스', '테크노'],
    tags: ['도쿄', '언더그라운드', '믹스셋'],
    viewCount: 1750,
    likeCount: 132,
    hasMedia: true,
    mediaType: 'youtube',
    mediaUrl: 'https://www.youtube.com/watch?v=wG59-qPp3j0'
  },
  {
    id: 'station-2',
    type: 'station',
    title: '서울 앰비언트 세션',
    slug: 'seoul-ambient-session',
    description: '한국 앰비언트 아티스트들의 작품을 모은 특별 큐레이션',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    publishedAt: '2025-03-11T18:30:00Z',
    author: {
      id: 'curator-2',
      name: '윤소라',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'
    },
    categories: ['앰비언트', '실험'],
    tags: ['서울', '앰비언트', '한국 음악'],
    viewCount: 980,
    likeCount: 87,
    hasMedia: true,
    mediaType: 'youtube',
    mediaUrl: 'https://www.youtube.com/watch?v=cJqkmAYrhhc'
  },
  {
    id: 'station-3',
    type: 'station',
    title: '베를린 테크노 언더그라운드',
    slug: 'berlin-techno-underground',
    description: '베를린의 언더그라운드 클럽 신에서 영감을 받은 하드 테크노 믹스',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    publishedAt: '2025-03-09T22:15:00Z',
    author: {
      id: 'curator-3',
      name: '마크 슈미트',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
    },
    categories: ['테크노', '하드코어'],
    tags: ['베를린', '클럽', '하드 테크노'],
    viewCount: 2340,
    likeCount: 201,
    hasMedia: true,
    mediaType: 'youtube',
    mediaUrl: 'https://www.youtube.com/watch?v=-2M1o_GKY7M&t=2842s'
  },
  {
    id: 'station-4',
    type: 'station',
    title: '디트로이트 테크노 클래식',
    slug: 'detroit-techno-classics',
    description: '디트로이트 테크노의 클래식 트랙을 모은 역사적인 컬렉션',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf',
    publishedAt: '2025-03-06T19:45:00Z',
    author: {
      id: 'curator-4',
      name: '제임스 존슨',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    },
    categories: ['테크노', '클래식'],
    tags: ['디트로이트', '테크노', '역사'],
    viewCount: 1870,
    likeCount: 156,
    hasMedia: true,
    mediaType: 'youtube',
    mediaUrl: 'https://www.youtube.com/watch?v=cJqkmAYrhhc'
  }
];

export const mockCommunityData = [
  {
    id: 'post-1',
    title: '보류기의 신곡 Modular Expanse 리뷰',
    content: '보류기의 새 앨범에서 가장 돋보이는 트랙인 Modular Expanse는 그의 모듈러 신스 작업의 정점을 보여줍니다. 복잡한 패치와 유기적인 리듬이 조화를 이루며 시간이 지날수록 점점 더 깊이있는 사운드가 펼쳐집니다. 특히 중반부의 패드 사운드는...',
    category: '음악 이야기',
    createdAt: '2025-03-15T14:35:00Z',
    author: {
      id: 'user-1',
      name: '테크노러버',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
    },
    viewCount: 345,
    commentCount: 23,
    likeCount: 87
  },
  {
    id: 'post-2',
    title: '오는 주말 청계천 지하 파티 정보',
    content: '오는 토요일 청계천 언더그라운드에서 새롭게 발견된 공간에서 비밀 파티가 열립니다. 라인업은 로컬 DJ 위주로 구성되어 있으며, 입장료는 2만원입니다. 위치는 당일 텔레그램 채널을 통해 공개되며, 티켓은 선착순 100명만 판매됩니다. 드레스코드는...',
    category: '이벤트/공연',
    createdAt: '2025-03-14T09:15:00Z',
    author: {
      id: 'user-2',
      name: '파티피플',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'
    },
    viewCount: 842,
    commentCount: 56,
    likeCount: 213
  },
  {
    id: 'post-3',
    title: 'Behringer 신제품 TD-3-MO 사용기',
    content: '최근 구매한 Behringer TD-3-MO를 약 한 달간 사용해본 소감을 공유합니다. 원조 TB-303과 비교했을 때 음색의 차이는 분명 있지만, 가격을 고려하면 놀라울 정도로 유사한 사운드를 제공합니다. 특히 모듈레이션 옵션이 추가되어 기존 TD-3보다 훨씬 더 다양한 사운드를 만들 수 있습니다. 시퀀서 역시...',
    category: '중고장터',
    createdAt: '2025-03-14T03:22:00Z',
    author: {
      id: 'user-3',
      name: '기어헤드',
      profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5'
    },
    viewCount: 529,
    commentCount: 34,
    likeCount: 78
  },
  {
    id: 'post-4',
    title: '애시드 하우스 프로덕션 팁 공유',
    content: '클래식한 애시드 하우스 트랙을 만들기 위한 제 워크플로우를 공유합니다. 우선 TR-808 스타일의 드럼 패턴으로 시작하여 4/4 킥과 오프비트 하이햇을 배치합니다. 그 다음 TB-303 또는 이와 유사한 신스를 사용하여 특징적인 애시드 라인을 만듭니다. 여기서 중요한 것은 레조넌스를 높게 설정하고 필터 컷오프를 모듈레이션하는 것입니다...',
    category: '프로듀서 라운지',
    createdAt: '2025-03-13T18:42:00Z',
    author: {
      id: 'user-4',
      name: '애시드메이커',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    },
    viewCount: 672,
    commentCount: 45,
    likeCount: 134
  },
  {
    id: 'post-5',
    title: '테크노 트랙 공동작업자 구합니다',
    content: '현재 진행 중인 3트랙 EP 프로젝트에 함께할 협업자를 찾고 있습니다. 베를린 스타일의 다크 테크노를 지향하며, 특히 어둡고 공간감 있는 패드 사운드와 텍스처를 추가해줄 수 있는 분을 찾고 있습니다. 현재 리듬 섹션과 베이스라인은 완성된 상태이며, 데모 트랙은 개인 메시지로 공유 가능합니다...',
    category: '협업 모집',
    createdAt: '2025-03-12T13:05:00Z',
    author: {
      id: 'user-5',
      name: '테크노프로듀서',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d'
    },
    viewCount: 384,
    commentCount: 27,
    likeCount: 42
  },
  {
    id: 'post-6',
    title: '90년대 레이브 문화가 현대 클럽씬에 미친 영향',
    content: '90년대 영국의 레이브 문화가 오늘날 서울의 클럽 씬에 어떤 영향을 미쳤는지 생각해보았습니다. 당시 불법 웨어하우스 파티에서 형성된 DIY 정신과 커뮤니티 의식이 지금의 언더그라운드 파티에도 이어지고 있음을 느낍니다. 특히 최근 홍대와 이태원을 벗어나 용산, 문래 등 산업 지역으로 파티 장소가 확장되는 현상은...',
    category: '자유게시판',
    createdAt: '2025-03-11T21:19:00Z',
    author: {
      id: 'user-6',
      name: '레이브히스토리안',
      profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956'
    },
    viewCount: 491,
    commentCount: 38,
    likeCount: 97
  },
  {
    id: 'post-7',
    title: '앰비언트 음악 추천 부탁드립니다',
    content: '요즘 작업할 때 듣기 좋은 앰비언트 음악을 찾고 있습니다. Brian Eno, Stars of the Lid 정도는 알고 있고, 좀 더 현대적인 앰비언트나 일본 앰비언트 작곡가들을 알고 싶습니다. 특히 공간감이 넓고 따뜻한 느낌의 작품을 선호합니다. 추천 부탁드립니다!',
    category: '음악 이야기',
    createdAt: '2025-03-10T11:47:00Z',
    author: {
      id: 'user-7',
      name: '드리프터',
      profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04'
    },
    viewCount: 326,
    commentCount: 42,
    likeCount: 65
  },
  {
    id: 'post-8',
    title: '중고 턴테이블 구매 조언 부탁드립니다',
    content: '처음으로 턴테이블을 구매하려고 하는데, 중고 시장에서 적당한 가격대의 제품을 찾고 있습니다. 주로 테크노, 하우스 레코드를 플레이할 예정이고, DJ 용도는 아니고 단순 감상용입니다. 예산은 30-40만원 정도로 생각하고 있습니다. 이 가격대에서 추천할 만한 모델이나 구매 시 주의사항 등 조언 부탁드립니다.',
    category: '중고장터',
    createdAt: '2025-03-09T15:36:00Z',
    author: {
      id: 'user-8',
      name: '바이닐비기너',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'
    },
    viewCount: 412,
    commentCount: 29,
    likeCount: 37
  }
];

export const mockMarketplaceData = [
  {
    id: 'item-1',
    title: '블랙 OSTROZON 로고 티셔츠',
    slug: 'black-ostrozon-logo-tshirt',
    price: 45000,
    description: '오스트로존의 시그니처 로고가 프린팅된 블랙 컬러 티셔츠입니다. 100% 유기농 면소재로 제작되었으며, 오버사이즈 핏으로 남녀 모두 착용 가능합니다. 흰색 로고 프린팅은 고품질 실크스크린 방식으로 제작되어 내구성이 뛰어납니다.',
    condition: '새 제품',
    tags: ['티셔츠', '오버사이즈', '블랙', '의류', '로고'],
    mainImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
    additionalImages: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990'
    ],
    viewCount: 324,
    contactPreference: '댓글 또는 메시지',
    postedAt: '2023-06-15T11:23:00Z',
    negotiable: false
  },
  {
    id: 'item-2',
    title: 'OSTROZON 소리파동 후드티',
    slug: 'ostrozon-soundwave-hoodie',
    price: 72000,
    description: '오스트로존의 사운드 웨이브 그래픽이 프린팅된 프리미엄 후드티입니다. 도쿄 언더그라운드 씬에서 영감을 받은 사운드 웨이브 그래픽과 미니멀한 로고 디자인이 특징입니다. 무거운 350g 원단으로 제작되어 보온성이 뛰어나며, 넉넉한 후드와 캥거루 포켓이 실용적입니다. 라이트 그레이 컬러로 다양한 스타일링이 가능합니다.',
    condition: '새 제품',
    tags: ['후드티', '그레이', '사운드웨이브', '의류', '겨울'],
    mainImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
    additionalImages: [
      'https://images.unsplash.com/photo-1578681994506-b8f463449011',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633'
    ],
    viewCount: 243,
    contactPreference: '댓글 또는 전화',
    postedAt: '2023-06-14T09:11:30Z',
    negotiable: false
  },
  {
    id: 'item-3',
    title: 'OSTROZON 베를린 에디션 토트백',
    slug: 'ostrozon-berlin-edition-totebag',
    price: 35000,
    description: '오스트로존의 베를린 에디션 토트백입니다. 베를린의 언더그라운드 클럽 문화에서 영감을 받은 그래픽 디자인이 특징이며, 두꺼운 캔버스 소재로 내구성이 뛰어납니다. 내부에 작은 포켓이 있어 소지품 보관이 용이하며, 어깨에 메거나 손으로 들 수 있는 적당한 길이의 스트랩이 있습니다.',
    condition: '새 제품',
    tags: ['토트백', '가방', '베를린', '캔버스', '에디션'],
    mainImage: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887',
    additionalImages: [
      'https://images.unsplash.com/photo-1607164253548-fe4a8abb081a'
    ],
    viewCount: 187,
    contactPreference: '댓글',
    postedAt: '2023-06-12T16:45:00Z',
    negotiable: false
  },
  {
    id: 'item-4',
    title: 'OSTROZON 테크노 아트 포스터',
    slug: 'ostrozon-techno-art-poster',
    price: 28000,
    description: '최소 수량으로 한정 제작된 오스트로존의 테크노 아트 포스터입니다. 디트로이트 테크노의 역사적인 순간들에서 영감을 받아 디자인되었으며, 유명 그래픽 디자이너 마티아스 베커가 작업했습니다. 고품질 아트 페이퍼에 프린팅되어 선명한 색감과 디테일을 자랑합니다. 크기는 50cm x 70cm이며, 액자는 포함되지 않습니다.',
    condition: '새 제품',
    tags: ['포스터', '아트워크', '테크노', '리미티드', '인테리어'],
    mainImage: 'https://images.unsplash.com/photo-1614078113610-19219af34108',
    additionalImages: [
      'https://images.unsplash.com/photo-1629975607549-73314e71c731',
      'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea'
    ],
    viewCount: 195,
    contactPreference: '메시지',
    postedAt: '2023-06-10T13:22:15Z',
    negotiable: false
  },
  {
    id: 'item-5',
    title: 'OSTROZON 스냅백 캡',
    slug: 'ostrozon-snapback-cap',
    price: 38000,
    description: '오스트로존의 로고가 수놓아진 블랙 스냅백 캡입니다. 고품질 면소재와 메쉬 소재를 사용하여 편안한 착용감과 통기성을 제공합니다. 뒷면의 스냅 잠금장치로 사이즈 조절이 가능하며, 단순하면서도 세련된 디자인으로 다양한 스타일에 매치 가능합니다.',
    condition: '새 제품',
    tags: ['모자', '스냅백', '블랙', '로고', '액세서리'],
    mainImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b',
    additionalImages: [
      'https://images.unsplash.com/photo-1534215754734-18e55d13e346',
      'https://images.unsplash.com/photo-1560774358-d727658f457c'
    ],
    viewCount: 132,
    contactPreference: '댓글 또는 메시지',
    postedAt: '2023-06-09T10:05:45Z',
    negotiable: false
  },
  {
    id: 'item-6',
    title: 'OSTROZON 바이닐 슬리브 티셔츠',
    slug: 'ostrozon-vinyl-sleeve-tshirt',
    price: 52000,
    description: '오스트로존의 바이닐 레코드 슬리브에서 영감을 받은 그래픽 티셔츠입니다. 화이트 컬러 티셔츠 후면에 테크노 뮤직의 파형과 바이닐 레코드 아트워크가 대형 프린팅되어 있으며, 가슴 부분에는 미니멀한 로고가 있습니다. 드롭 숄더 디자인으로 여유있는 핏을 제공하며, 프리미엄 면소재로 제작되었습니다.',
    condition: '새 제품',
    tags: ['티셔츠', '화이트', '그래픽', '바이닐', '의류'],
    mainImage: 'https://images.unsplash.com/photo-1554568218-0f1715e72254',
    additionalImages: [
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'
    ],
    viewCount: 218,
    contactPreference: '메시지',
    postedAt: '2023-06-08T14:30:00Z',
    negotiable: false
  }
];
