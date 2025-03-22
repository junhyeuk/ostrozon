# Ostrozon 기술 컨텍스트

## 사용 기술

### 프론트엔드
- **Next.js 15.2.2**: React 기반 프레임워크
- **React**: UI 컴포넌트 라이브러리
- **Tailwind CSS 3.3.0**: 유틸리티 기반 CSS 프레임워크
- **Zustand**: 경량 상태 관리 라이브러리
- **React Query**: 서버 상태 관리 및 데이터 페칭 라이브러리

### 백엔드
- **Next.js API Routes**: API 엔드포인트 구현
- **(향후 적용)** RESTful API 설계
- **(향후 적용)** 데이터베이스 통합

### 스타일링
- **Tailwind CSS**: 유틸리티 클래스 기반 스타일링
- **PostCSS**: CSS 변환 및 전처리
- **Autoprefixer**: 브라우저 호환성을 위한 벤더 프리픽스 추가

### 미디어 처리
- **Next.js Image**: 이미지 최적화 컴포넌트
- **YouTube IFrame Player API**: 유튜브 비디오 임베딩 및 제어
  - `react-youtube`: 유튜브 플레이어 React 래퍼 컴포넌트
  - 플레이어 이벤트 리스너를 통한 상태 관리
  - 동적 비디오 ID 처리 및 오류 대응 
- **(향후 적용)** 오디오 스트리밍 통합

### 개발 도구
- **ESLint**: 코드 품질 및 일관성 유지
- **Prettier**: 코드 포맷팅
- **TypeScript**: 정적 타입 체킹 (향후 도입 예정)

## 개발 환경 설정

### 환경 요구사항
- Node.js 14.x 이상
- npm 6.x 이상 또는 yarn 1.x 이상

### 로컬 개발 환경 설정
```bash
# 저장소 클론
git clone [repository-url]

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 스크립트
- `npm run dev`: 개발 서버 실행 (http://localhost:3000)
- `npm run build`: 프로덕션용 빌드 생성
- `npm run start`: 프로덕션 모드로 서버 실행
- `npm run lint`: 코드 린팅 실행

## 기술적 제약 사항

### 브라우저 지원
- 최신 버전의 Chrome, Firefox, Safari, Edge
- IE11 미지원

### 성능 목표
- First Contentful Paint (FCP): 1.5초 이내
- Largest Contentful Paint (LCP): 2.5초 이내
- Cumulative Layout Shift (CLS): 0.1 이하
- 페이지 로드 시간: 3초 이내 (초기 로드)

### 접근성 표준
- WCAG 2.1 A 및 AA 레벨 준수 목표
- 스크린 리더 호환성
- 키보드 내비게이션 지원

## 기술 의존성

### 핵심 의존성
```json
{
  "dependencies": {
    "next": "^15.2.2",
    "react": "^18.x",
    "react-dom": "^18.x",
    "zustand": "^4.x",
    "@tanstack/react-query": "^5.x",
    "react-youtube": "^10.x"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.0"
  }
}
```

### 외부 서비스 의존성
- YouTube Data API v3: 비디오 콘텐츠 통합
- **(향후 적용)** 클라우드 호스팅 플랫폼
- **(향후 적용)** CI/CD 파이프라인
- **(향후 적용)** 데이터베이스 서비스
- **(향후 적용)** 미디어 스토리지 서비스

## 보안 고려사항
- HTTPS 사용 의무화
- 사용자 인증 및 권한 관리
- API 엔드포인트 보안
- 입력 검증 및 필터링

## 모니터링 및 분석
- **(향후 적용)** 에러 모니터링
- **(향후 적용)** 성능 모니터링
- **(향후 적용)** 사용자 행동 분석 