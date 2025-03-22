import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/Layout';
import useStore from '../../utils/store';
import { mockStationData } from '../../utils/mockData';
import YouTube from 'react-youtube';

export default function StationDetail() {
  const router = useRouter();
  const { slug } = router.query;
  
  // Zustand 스토어에서 상태와 액션 가져오기
  const { 
    setCurrentMedia, 
    isPlaying: isGlobalPlaying, 
    currentMedia: globalCurrentMedia,
    togglePlay: toggleGlobalPlay,
    togglePlayState,
    addToPlaylist,
    playlist
  } = useStore();
  
  const [videoId, setVideoId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const wasGlobalPlaying = useRef(false); // 메인 플레이어의 이전 재생 상태를 저장하는 ref
  
  // 해당 슬러그에 맞는 스테이션 아이템 찾기
  const stationItem = mockStationData.find(item => item.slug === slug);
  
  // 관련 스테이션 찾기 (같은 카테고리 또는 태그를 가진 다른 스테이션)
  const relatedStations = stationItem ? 
    mockStationData
      .filter(item => 
        item.id !== stationItem.id && 
        (item.categories.some(cat => stationItem.categories.includes(cat)) || 
        item.tags.some(tag => stationItem.tags.includes(tag)))
      )
      .slice(0, 3) : 
    [];
    
  // 유튜브 비디오 ID 추출
  useEffect(() => {
    if (stationItem && stationItem.mediaType === 'youtube' && stationItem.mediaUrl) {
      const videoIdMatch = stationItem.mediaUrl.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
      if (videoIdMatch && videoIdMatch[1]) {
        setVideoId(videoIdMatch[1]);
      }
    }
  }, [stationItem]);
  
  // 현재 미디어가 플레이리스트에 있는지 확인
  useEffect(() => {
    if (stationItem && playlist) {
      const found = playlist.some(item => item.id === stationItem.id && item.type === stationItem.type);
      setIsInPlaylist(found);
    }
  }, [stationItem, playlist]);
  
  // 글로벌 재생 상태에 따른 로컬 상태 동기화
  useEffect(() => {
    if (globalCurrentMedia && stationItem) {
      if (globalCurrentMedia.id === stationItem.id && globalCurrentMedia.type === stationItem.type) {
        setIsPlaying(isGlobalPlaying);
      }
    }
  }, [globalCurrentMedia, isGlobalPlaying, stationItem]);
  
  // 글로벌 재생 상태 변경 감지
  useEffect(() => {
    if (isGlobalPlaying && player && isPlaying) {
      try {
        // 플레이어가 완전히 준비되었는지 확인
        if (player.getPlayerState !== undefined) {
          player.pauseVideo();
          setIsPlaying(false);
        }
      } catch (error) {
        console.error('YouTube 플레이어 제어 중 오류 발생:', error);
      }
    }
  }, [isGlobalPlaying, player, isPlaying]);
  
  // 미니 플레이어로 재생
  const playInMiniPlayer = () => {
    if (stationItem) {
      // 필요한 모든 미디어 정보를 포함하여 전달
      const mediaForPlayer = {
        ...stationItem,
        // 다음 필드들이 반드시 포함되도록 보장
        type: 'station',
        mediaType: stationItem.mediaType,
        mediaUrl: stationItem.mediaUrl,
        title: stationItem.title,
        description: stationItem.description,
        author: stationItem.author,
        thumbnailUrl: stationItem.thumbnailUrl,
        slug: stationItem.slug,
        id: stationItem.id
      };
      
      console.log('미니 플레이어로 전송:', mediaForPlayer);
      setCurrentMedia(mediaForPlayer);
    }
  };
  
  // 플레이리스트에 추가/제거
  const togglePlaylist = () => {
    if (isInPlaylist) {
      // 플레이리스트에서 제거 로직
      const { removeFromPlaylist } = useStore.getState();
      removeFromPlaylist(stationItem.id, stationItem.type);
    } else {
      // 플레이리스트에 추가
      addToPlaylist(stationItem);
    }
  };
  
  // 재생 상태 변경 함수
  const togglePlay = () => {
    if (player) {
      try {
        if (isPlaying) {
          player.pauseVideo();
          // 유튜브 일시 중지 시 메인 플레이어 상태 복원
          if (wasGlobalPlaying.current && globalCurrentMedia) {
            setTimeout(() => {
              togglePlayState(true);
              wasGlobalPlaying.current = false;
            }, 500);
          }
        } else {
          // 유튜브 재생 시 메인 플레이어 상태 저장 및 일시 중지
          if (isGlobalPlaying) {
            wasGlobalPlaying.current = true;
            togglePlayState(false);
          }
          player.playVideo();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('YouTube 플레이어 제어 중 오류 발생:', error);
      }
    }
  };
  
  // 플레이어 준비 완료 핸들러
  const handleReady = (event) => {
    try {
      const ytPlayer = event.target;
      // 플레이어가 준비되었는지 확인 후 상태 설정
      if (ytPlayer && ytPlayer.getPlayerState !== undefined) {
        setPlayer(ytPlayer);
        console.log('YouTube 플레이어가 준비되었습니다.');
      }
    } catch (error) {
      console.error('YouTube 플레이어 초기화 중 오류 발생:', error);
    }
  };
  
  // 플레이어 상태 변경 핸들러
  const handleStateChange = (event) => {
    // 유튜브 플레이어 상태에 따라 isPlaying 상태 업데이트
    // 1: 재생 중, 2: 일시 정지, 0: 종료, 3: 버퍼링
    if (event.data === 1) { // 재생 시작
      setIsPlaying(true);
      
      // 메인 플레이어 재생 중이면 상태 저장 후 일시 중지
      if (isGlobalPlaying) {
        wasGlobalPlaying.current = true;
        togglePlayState(false); // 메인 플레이어 일시 중지
      }
    } else if (event.data === 2) { // 일시 정지
      setIsPlaying(false);
    } else if (event.data === 0) { // 종료
      setIsPlaying(false);
      
      // 유튜브 영상이 끝났을 때 메인 플레이어 재생 상태 복원
      if (wasGlobalPlaying.current && globalCurrentMedia) {
        setTimeout(() => {
          togglePlayState(true); // 메인 플레이어 재생
          wasGlobalPlaying.current = false;
        }, 500); // 약간의 지연 추가
      }
    }
  };
  
  // 유튜브 플레이어 옵션
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      modestbranding: 1,
    },
  };
  
  // 로딩 상태 처리
  if (router.isFallback || !stationItem) {
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
        <title>{`${stationItem.title} | Ostrozon`}</title>
        <meta name="description" content={stationItem.description} />
        <meta property="og:title" content={`${stationItem.title} | Ostrozon`} />
        <meta property="og:description" content={stationItem.description} />
        <meta property="og:image" content={stationItem.thumbnailUrl} />
        <meta property="og:type" content="music" />
      </Head>
      
      <main className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              {stationItem.categories && stationItem.categories.map((category, index) => (
                <span key={index} className="text-xs bg-secondary/30 text-gray-300 px-2 py-1 rounded">
                  {category}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">{stationItem.title}</h1>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-400">
                  {new Date(stationItem.publishedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
          
          {/* 소셜 공유 버튼 */}
          <div className="flex justify-end mb-6">
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
          
          {stationItem.mediaType === 'youtube' && videoId ? (
            <div className="mb-8">
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <div className="absolute inset-0">
                  <YouTube
                    videoId={videoId}
                    opts={opts}
                    onReady={handleReady}
                    onStateChange={handleStateChange}
                    className="w-full h-full rounded-lg overflow-hidden"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
              <Image 
                src={stationItem.thumbnailUrl} 
                alt={stationItem.title}
                fill
                className="object-cover"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  className="bg-accent/90 text-white p-4 rounded-full shadow-lg transform transition-transform hover:scale-110"
                  onClick={playInMiniPlayer}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg mb-6">{stationItem.description}</p>
            
            <p>
              이 스테이션은 목업 데이터를 사용한 예시입니다. 실제 애플리케이션에서는 여기에 스테이션에 대한 상세 설명과
              큐레이터의 노트, 트랙 리스트 등이 표시됩니다.
            </p>
            
            <p>
              Ostrozon의 스테이션은 전 세계의 언더그라운드 전자음악을 큐레이션하여 제공합니다.
              각 스테이션은 특정 장르, 무드, 지역 등을 중심으로 구성되어 있으며, 
              전문 DJ와 큐레이터들이 엄선한 트랙으로 이루어져 있습니다.
            </p>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8">
            <h3 className="text-xl font-heading font-semibold mb-4">태그</h3>
            <div className="flex flex-wrap gap-2">
              {stationItem.tags && stationItem.tags.map((tag, index) => (
                <span key={index} className="text-sm bg-secondary/20 text-gray-300 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* 관련 스테이션 섹션 */}
          {relatedStations.length > 0 && (
            <div className="border-t border-gray-800 pt-8 mt-8">
              <h3 className="text-xl font-heading font-semibold mb-6">관련 스테이션</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedStations.map((item) => (
                  <Link 
                    href={`/station/${item.slug}`} 
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="text-xs bg-accent/80 text-white px-2 py-1 rounded">
                          {item.categories[0]}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-base font-medium line-clamp-2 group-hover:text-accent">{item.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {item.author.name}
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
  const paths = mockStationData.map((station) => ({
    params: { slug: station.slug },
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
