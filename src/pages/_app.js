import '../styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import useStore from '../utils/store';

// 클라이언트 사이드에서만 렌더링되도록 MiniPlayer를 동적으로 불러옴
const DynamicMiniPlayer = dynamic(() => import('../components/MiniPlayer'), {
  ssr: false,
});

// 미디어 플레이어 래퍼 컴포넌트
function MediaPlayerWrapper() {
  const { currentMedia } = useStore();
  
  // 현재 미디어가 있는 경우에만 플레이어 표시
  if (!currentMedia) return null;
  
  return <DynamicMiniPlayer />;
}

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <MediaPlayerWrapper />
    </QueryClientProvider>
  );
}

export default MyApp;
