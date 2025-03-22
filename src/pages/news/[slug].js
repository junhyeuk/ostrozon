import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/Layout';
import useStore from '../../utils/store';
import { mockNewsData } from '../../utils/mockData';

export default function NewsDetail() {
  const router = useRouter();
  const { slug } = router.query;
  
  // Zustand 스토어에서 상태와 액션 가져오기
  const { 
    setCurrentMedia, 
    isPlaying: isGlobalPlaying, 
    currentMedia: globalCurrentMedia,
    addToPlaylist,
    playlist
  } = useStore();
  
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  
  // 해당 슬러그에 맞는 뉴스 아이템 찾기
  const newsItem = mockNewsData.find(item => item.slug === slug);
  
  // 관련 기사 찾기 (같은 카테고리의 다른 뉴스)
  const relatedNews = newsItem ? 
    mockNewsData
      .filter(item => 
        item.id !== newsItem.id && 
        item.categories.some(cat => newsItem.categories.includes(cat))
      )
      .slice(0, 3) : 
    [];
  
  // 현재 뉴스가 플레이리스트에 있는지 확인
  useEffect(() => {
    if (newsItem && playlist) {
      const found = playlist.some(item => item.id === newsItem.id && item.type === newsItem.type);
      setIsInPlaylist(found);
    }
  }, [newsItem, playlist]);
  
  // 미니 플레이어로 재생
  const playInMiniPlayer = () => {
    if (newsItem) {
      setCurrentMedia(newsItem);
    }
  };
  
  // 플레이리스트에 추가/제거
  const togglePlaylist = () => {
    if (isInPlaylist) {
      // 플레이리스트에서 제거 로직
      const { removeFromPlaylist } = useStore.getState();
      removeFromPlaylist(newsItem.id, newsItem.type);
    } else {
      // 플레이리스트에 추가
      addToPlaylist(newsItem);
    }
  };
  
  // 로딩 상태 처리
  if (router.isFallback || !newsItem) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <p>로딩 중...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Head>
        <title>{`${newsItem.title} | Ostrozon`}</title>
        <meta name="description" content={newsItem.description} />
        <meta property="og:title" content={`${newsItem.title} | Ostrozon`} />
        <meta property="og:description" content={newsItem.description} />
        <meta property="og:image" content={newsItem.thumbnailUrl} />
        <meta property="og:type" content="article" />
      </Head>
      
      <main className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              {newsItem.categories && newsItem.categories.map((category, index) => (
                <span key={index} className="text-xs bg-secondary/30 text-gray-300 px-2 py-1 rounded">
                  {category}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">{newsItem.title}</h1>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-400">
                  {new Date(newsItem.publishedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{newsItem.viewCount}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{newsItem.likeCount}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative h-96 w-full mb-4 rounded-lg overflow-hidden">
            <Image 
              src={newsItem.thumbnailUrl} 
              alt={newsItem.title}
              fill
              className="object-cover"
            />
          </div>
          
          {/* 재생 및 플레이리스트 버튼 */}
          <div className="flex flex-wrap items-center justify-start space-x-3 mb-6">
            <button 
              className="bg-accent text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
              onClick={playInMiniPlayer}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12 6-12 7Z" />
              </svg>
              <span>미니 플레이어로 듣기</span>
            </button>
            
            <button 
              className={`${isInPlaylist ? 'bg-pink-600' : 'bg-secondary/20'} text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2`}
              onClick={togglePlaylist}
            >
              {isInPlaylist ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>플레이리스트에서 제거</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12 6-12 7ZM4 6h6M4 12h4M4 18h6" />
                  </svg>
                  <span>플레이리스트에 추가</span>
                </>
              )}
            </button>
          </div>
          
          {/* 소셜 공유 버튼 */}
          <div className="flex justify-end mb-8">
            <div className="flex space-x-2">
              <button 
                className="bg-[#1877F2] p-2 rounded-full text-white hover:opacity-80 transition"
                aria-label="Facebook 공유"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                </svg>
              </button>
              <button 
                className="bg-[#1DA1F2] p-2 rounded-full text-white hover:opacity-80 transition"
                aria-label="Twitter 공유"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
                </svg>
              </button>
              <button 
                className="bg-[#0A66C2] p-2 rounded-full text-white hover:opacity-80 transition"
                aria-label="LinkedIn 공유"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
              <button 
                className="bg-gray-700 p-2 rounded-full text-white hover:opacity-80 transition"
                aria-label="링크 복사"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('링크가 클립보드에 복사되었습니다.');
                }}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg mb-6">{newsItem.description}</p>
            
            <p>
              이 기사는 목업 데이터를 사용한 예시입니다. 실제 애플리케이션에서는 여기에 전체 기사 내용이 표시됩니다.
              언더그라운드 전자음악 신에 대한 심층적인 분석과 최신 트렌드, 아티스트 인터뷰 등 다양한 콘텐츠가 제공될 예정입니다.
            </p>
            
            <p>
              Ostrozon은 언더그라운드 전자음악에 특화된 서브컬처 지향의 플랫폼으로, 
              다양한 장르의 전자음악과 관련 문화 콘텐츠를 제공합니다.
            </p>
          </div>
          
          {/* 태그 섹션 */}
          <div className="border-t border-gray-800 pt-8 mt-8">
            <h3 className="text-xl font-heading font-semibold mb-4">태그</h3>
            <div className="flex flex-wrap gap-2">
              {newsItem.tags && newsItem.tags.map((tag, index) => (
                <span key={index} className="text-sm bg-secondary/20 text-gray-300 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* 관련 기사 섹션 */}
          {relatedNews.length > 0 && (
            <div className="border-t border-gray-800 pt-8 mt-8">
              <h3 className="text-xl font-heading font-semibold mb-6">관련 기사</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((item) => (
                  <Link 
                    href={`/news/${item.slug}`} 
                    key={item.id} 
                    className="block group"
                  >
                    <div className="relative h-40 mb-3 rounded overflow-hidden">
                      <Image 
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h4 className="text-base font-medium line-clamp-2 group-hover:text-accent">{item.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(item.publishedAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* 댓글 섹션 */}
          <div className="border-t border-gray-800 pt-8 mt-8">
            <h3 className="text-xl font-heading font-semibold mb-6">댓글</h3>
            
            {/* 댓글 작성 폼 */}
            <div className="bg-secondary/10 rounded-lg p-6 mb-8">
              <h4 className="font-medium mb-3">댓글 작성</h4>
              <textarea 
                className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition mb-3" 
                rows="3"
                placeholder="댓글을 남겨보세요..."
              ></textarea>
              <div className="flex justify-end">
                <button className="btn btn-primary">등록</button>
              </div>
            </div>
            
            {/* 댓글 목록 */}
            <div className="space-y-6">
              <p className="text-gray-400 text-center py-4">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
              
              {/* 댓글 예시 (실제로는 빈 상태) */}
              {/*
              <div className="flex space-x-4">
                <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                    alt="User profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">사용자 이름</h4>
                    <span className="text-xs text-gray-400">방금 전</span>
                  </div>
                  <p className="mt-1 text-sm">댓글 내용이 여기에 표시됩니다.</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <button className="text-xs text-gray-400 hover:text-accent">좋아요</button>
                    <button className="text-xs text-gray-400 hover:text-accent">답글</button>
                  </div>
                </div>
              </div>
              */}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

// 정적 경로 생성
export async function getStaticPaths() {
  const paths = mockNewsData.map((news) => ({
    params: { slug: news.slug },
  }));
  
  return { paths, fallback: true };
}

// 정적 데이터 가져오기
export async function getStaticProps({ params }) {
  const { slug } = params;
  
  return {
    props: {
      slug,
    },
    revalidate: 60, // 60초마다 재검증
  };
}
