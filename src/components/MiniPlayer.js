import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import YouTube from 'react-youtube';
import useStore from '../utils/store';
import { getYoutubeThumbnail, getYoutubeVideoId } from '../utils/helpers';
import { Play, Pause, SkipForward, Volume2, VolumeX, List } from 'lucide-react';
import { useRouter } from 'next/router';

export default function MiniPlayer() {
  // 로컬 상태
  const [isReady, setIsReady] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [duration, setDuration] = useState(0);
  const [youtubeInfo, setYoutubeInfo] = useState(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [playerInitialized, setPlayerInitialized] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const progressBarRef = useRef(null);
  
  // 플레이어 참조
  const playerRef = useRef(null);
  
  // 새로운 상태 변수 추가 - 실제 플레이어 API 준비 상태
  const [playerReady, setPlayerReady] = useState(false);
  // 초기화 재시도 카운터
  const [initRetryCount, setInitRetryCount] = useState(0);
  // 마지막 에러 저장
  const [lastError, setLastError] = useState(null);
  
  // Zustand 스토어에서 필요한 상태 및 액션 가져오기
  const {
    currentMedia,
    isPlaying,
    isMuted,
    volume,
    playlist,
    currentIndex,
    playedSeconds,
    togglePlay,
    toggleMute,
    setVolume,
    setPlayedSeconds,
    playNext,
    playPrevious,
    removeFromPlaylist,
    clearPlaylist,
    playAtIndex
  } = useStore();

  const router = useRouter();

  // 라우트 변경 시 플레이어 유지를 위한 이벤트 핸들러
  useEffect(() => {
    // 라우트 변경 시작 이벤트
    const handleRouteChangeStart = () => {
      console.log('페이지 전환 시작, 플레이어 상태 유지');
    };

    // 라우트 변경 완료 이벤트
    const handleRouteChangeComplete = () => {
      console.log('페이지 전환 완료, 플레이어 상태 복원');
      // 필요한 경우 플레이어 상태 복원 코드 추가
    };

    // 이벤트 리스너 등록
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  // 기본 볼륨을 100%로 설정
  useEffect(() => {
    if (volume !== 100) {
      setVolume(100);
    }
  }, []);

  // media 변수를 선언하여 currentMedia를 참조하기 쉽게 합니다
  const media = currentMedia;

  // YouTube 관련 정보 추출
  const videoId = useMemo(() => {
    if (!media) return null;
    
    // 유튜브 비디오 ID 추출 로직 개선
    if (media.type === 'youtube') {
      return media.videoId;
    } else if (media.mediaType === 'youtube' && media.mediaUrl) {
      // mediaUrl에서 videoId 추출
      return getYoutubeVideoId(media.mediaUrl);
    } else if (media.youtubeUrl) {
      // youtubeUrl에서 videoId 추출
      return getYoutubeVideoId(media.youtubeUrl);
    }
    
    return null;
  }, [media]);

  // 미디어 타입 판별 (YouTube 또는 기타 미디어)
  const isYoutubeMedia = videoId !== null;
  const isTtsMedia = media && media.mediaType === 'tts';
  
  // 비디오 ID가 변경되면 유튜브 정보 초기화
  useEffect(() => {
    if (videoId) {
      console.log('비디오 ID 변경:', videoId);
      setYoutubeInfo(null);
      setIsReady(false);
      setPlayerInitialized(false);
    }
  }, [videoId]);
  
  // tts 미디어가 재생될 때 자동으로 ready 상태로 설정
  useEffect(() => {
    if (isTtsMedia) {
      console.log('TTS 미디어 활성화');
      setIsReady(true);
    }
  }, [isTtsMedia]);

  // 플레이리스트 토글
  const togglePlaylist = () => {
    console.log('플레이리스트 토글. 현재 상태:', showPlaylist ? '보임' : '숨김');
    setShowPlaylist(!showPlaylist);
  };

  // 안전한 플레이어 메서드 호출을 위한 유틸리티 함수들
  const safePlayerCall = useCallback((methodName, ...args) => {
    // 1. playerRef 객체 자체 검증
    if (!playerRef.current) {
      console.warn(`플레이어 메서드 ${methodName} 호출 실패: playerRef.current가 null`);
      return null;
    }
    
    // 2. playerReady 상태 검증
    if (!playerReady) {
      console.warn(`플레이어 메서드 ${methodName} 호출 실패: 플레이어가 준비되지 않음 (playerReady: false)`);
      return null;
    }
    
    // 3. 메서드 존재 여부 검증 (iframe 검증 전에 수행)
    if (typeof playerRef.current[methodName] !== 'function') {
      console.warn(`플레이어 메서드 ${methodName}이 함수가 아님`);
      return null;
    }
    
    // 4. 메서드 호출 시도 - iframe 검증 없이도 시도
    try {
      // 메서드 직접 호출을 먼저 시도
      return playerRef.current[methodName](...args);
    } catch (err) {
      // 오류가 발생했으나 계속 진행 가능한지 확인
      console.warn(`플레이어 메서드 ${methodName} 호출 중 오류:`, err);
      setLastError(err);
      
      // 특별히 심각한 오류인 경우 (Cannot read property 등)
      if (err.toString().includes("Cannot read property") || 
          err.toString().includes("null") || 
          err.toString().includes("undefined")) {
        console.error(`플레이어 메서드 ${methodName} 호출 중 심각한 오류:`, err);
        return null;
      }
      
      // 특정 메서드의 경우 오류가 있어도 기본값 반환
      if (methodName === 'getCurrentTime') return 0;
      if (methodName === 'getDuration') return 0;
      
      return null;
    }
  }, [playerReady]);
  
  // 안전한 플레이어 API 호출 래퍼 함수들
  const safePlayVideo = useCallback(() => safePlayerCall('playVideo'), [safePlayerCall]);
  const safePauseVideo = useCallback(() => safePlayerCall('pauseVideo'), [safePlayerCall]);
  const safeMute = useCallback(() => safePlayerCall('mute'), [safePlayerCall]);
  const safeUnMute = useCallback(() => safePlayerCall('unMute'), [safePlayerCall]);
  const safeSetVolume = useCallback((vol) => safePlayerCall('setVolume', vol), [safePlayerCall]);
  const safeGetCurrentTime = useCallback(() => safePlayerCall('getCurrentTime'), [safePlayerCall]);
  const safeGetDuration = useCallback(() => safePlayerCall('getDuration'), [safePlayerCall]);
  const safeGetVideoData = useCallback(() => safePlayerCall('getVideoData'), [safePlayerCall]);

  // 개선된 재생 상태 변경 효과 - iframe 검증 제거
  useEffect(() => {
    // playerRef 존재 여부만 확인
    if (!playerRef.current) return;
    
    const timer = setTimeout(() => {
      // 타이머 실행 전 playerRef 재확인
      if (!playerRef.current) return;
      
      if (isPlaying) {
        console.log('Effect: 플레이어 재생 시작 시도');
        // iframe 검증 없이 직접 재생 시도
        safePlayVideo();
      } else {
        console.log('Effect: 플레이어 일시 정지 시도');
        safePauseVideo();
      }
    }, 500); // 지연 시간 증가
    
    return () => clearTimeout(timer);
  }, [isPlaying, safePlayVideo, safePauseVideo]);

  // 개선된 음소거 상태 변경 효과
  useEffect(() => {
    if (!playerRef.current || !playerReady) return;
    
    const timer = setTimeout(() => {
      // 타이머 실행 전 상태 재확인
      if (!playerRef.current || !playerReady) return;
      
      try {
        if (isMuted) {
          console.log('Effect: 플레이어 음소거');
          safeMute();
        } else {
          console.log('Effect: 플레이어 음소거 해제');
          safeUnMute();
        }
      } catch (err) {
        console.error('Effect: 음소거 상태 변경 중 오류:', err);
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [isMuted, playerReady, safeMute, safeUnMute]);

  // 개선된 볼륨 변경 효과
  useEffect(() => {
    if (!playerRef.current || !playerReady) return;
    
    const timer = setTimeout(() => {
      // 타이머 실행 전 상태 재확인
      if (!playerRef.current || !playerReady) return;
      
      try {
        console.log('Effect: 플레이어 볼륨 설정', volume);
        safeSetVolume(volume);
      } catch (err) {
        console.error('Effect: 볼륨 설정 중 오류:', err);
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [volume, playerReady, safeSetVolume]);

  // 개선된 재생 시간 업데이트 핸들러
  const handleTimeUpdate = useCallback(() => {
    if (!playerRef.current || !playerReady || !isPlaying) return;
    
    try {
      const iframe = playerRef.current.getIframe?.();
      if (!iframe || !iframe.contentWindow) return;
      
      const currentTime = safeGetCurrentTime();
      if (currentTime !== null && !isNaN(currentTime)) {
        setPlayedSeconds(currentTime);
      }
    } catch (err) {
      // 시간 업데이트는 자주 호출되므로 콘솔 오류는 남기지 않음
    }
  }, [isPlaying, setPlayedSeconds, playerReady, safeGetCurrentTime]);

  // 유튜브 플레이어 준비 핸들러
  const handleReady = (event) => {
    console.log('플레이어 초기화 시작');
    
    // 이벤트 객체 검증
    if (!event || !event.target) {
      console.error('플레이어 초기화 실패: 유효하지 않은 이벤트 객체');
      return;
    }
    
    // 플레이어 참조 저장
    playerRef.current = event.target;
    
    // 안전한 초기화 과정을 위해 약간의 지연 도입
    setTimeout(() => {
      try {
        // 플레이어 객체에 실제로 접근 가능한지 테스트
        if (!playerRef.current) {
          throw new Error('플레이어 객체에 접근할 수 없음');
        }
        
        // API 필수 메소드 확인
        if (typeof playerRef.current.getPlayerState !== 'function') {
          console.warn('플레이어 API의 getPlayerState 함수를 찾을 수 없음');
          // 오류를 throw하지 않고 계속 진행
        }
        
        // iframe 검증 시도 - 접근 불가능한 경우 경고만 표시
        try {
          const iframe = playerRef.current.getIframe?.();
          if (!iframe) {
            console.warn('플레이어 iframe을 찾을 수 없음, 기능이 제한될 수 있음');
          } else if (!iframe.contentWindow) {
            console.warn('iframe.contentWindow에 접근할 수 없음, 크로스 오리진 제한 가능성 있음');
          }
          // iframe 접근 실패가 있더라도 초기화 계속 진행
        } catch (iframeErr) {
          console.warn('iframe 접근 중 오류 발생, 계속 진행합니다:', iframeErr);
          // 오류를 무시하고 계속 진행
        }
        
        // 플레이어 상태 테스트 - 실패해도 계속 진행
        let playerState, duration;
        try {
          playerState = playerRef.current.getPlayerState();
          duration = playerRef.current.getDuration();
          console.log('플레이어 상태 확인:', playerState, '재생 시간:', duration);
        } catch (methodErr) {
          console.warn('플레이어 API 테스트 중 오류가 발생했지만 계속 진행합니다:', methodErr);
          // 심각한 오류라도 초기화 시도 계속
        }
        
        // 초기화 완료 표시
        console.log('플레이어 초기화 완료');
        setIsReady(true);
        setPlayerInitialized(true);
        setPlayerReady(true);
        setInitRetryCount(0);
        setLastError(null);
        
        // 기본 설정 적용 - 메서드 호출 전에 항상 playerRef 유효성 확인
        if (playerRef.current) {
          // 볼륨 설정
          safeSetVolume(volume);
          
          // 음소거 상태 적용
          if (isMuted) {
            safeMute();
          } else {
            safeUnMute();
          }
          
          // 비디오 정보 가져오기
          const videoDuration = safeGetDuration();
          if (videoDuration !== null && !isNaN(videoDuration) && videoDuration > 0) {
            setDuration(videoDuration);
          }
          
          // 비디오 데이터 가져오기
          const videoData = safeGetVideoData();
          if (videoData && videoData.title) {
            setYoutubeInfo({
              title: videoData.title || media?.title,
              author: videoData.author || media?.author?.name || 'Unknown',
              videoId: videoData.video_id || videoId
            });
          }
          
          // 자동 재생 (필요한 경우) - 추가 지연 적용
          if (isPlaying) {
            // 재생 전에 짧은 지연 추가
            setTimeout(() => {
              if (playerRef.current) {
                safePlayVideo();
              }
            }, 200);
          }
        }
      } catch (err) {
        console.error('플레이어 초기화 중 오류:', err);
        setLastError(err);
        
        // 재시도 계획
        if (initRetryCount < 3) {
          console.log(`플레이어 초기화 재시도 (${initRetryCount + 1}/3)...`);
          setInitRetryCount(prev => prev + 1);
          // 다음 재시도 예약
          setTimeout(() => {
            if (playerRef.current) {
              handleReady({ target: playerRef.current });
            }
          }, 1000); // 1초 후 재시도
        } else {
          console.error('플레이어 초기화 최대 재시도 횟수 초과');
          // 부분적 초기화 완료로 표시하여 기본 기능이라도 작동하게 함
          setIsReady(true);
          setPlayerInitialized(true);
        }
      }
    }, 500); // 지연 시간을 300ms에서 500ms로 증가
  };

  // 유튜브 플레이어 상태 변경 핸들러
  const handleStateChange = (event) => {
    // 상태 코드
    // -1 (미시작), 0 (종료), 1 (재생 중), 2 (일시정지), 3 (버퍼링), 5 (큐)
    const playerState = event.data;
    
    console.log('플레이어 상태 변경:', playerState);
    
    // API 접근성 재확인 (상태 변경 시점에도 API가 준비되었는지 다시 확인)
    if (!playerReady && playerState !== undefined) {
      setPlayerReady(true);
    }
    
    // 재생이 끝난 경우
    if (playerState === 0) {
      console.log('재생 종료. 다음 트랙으로 이동');
      
      // 자동 재생이 활성화된 경우 다음 트랙으로 이동
      if (autoPlay && playlist.length > 1) {
        playNext();
      } else {
        // 자동 재생이 비활성화된 경우 현재 트랙 재생 중지
        togglePlay();
      }
    }
    
    // 재생 상태 동기화
    if (playerState === 1 && !isPlaying) {
      console.log('플레이어 재생 중, 상태 동기화');
      togglePlay();
    } else if (playerState === 2 && isPlaying) {
      console.log('플레이어 일시정지, 상태 동기화');
      togglePlay();
    }
  };

  // 재생/일시정지 토글
  const onPlayPause = () => {
    if (!media) return;
    
    console.log('재생/일시정지 토글');
    togglePlay();
    
    if (isYoutubeMedia && playerReady) {
      // 약간의 지연을 두어 상태 변경이 완료된 후 플레이어를 제어
      setTimeout(() => {
        // togglePlay 이후에는 isPlaying 상태가 반전되므로 조건을 반대로 체크
        if (isPlaying) {
          console.log('유튜브 플레이어 일시정지');
          safePauseVideo();
        } else {
          console.log('유튜브 플레이어 재생 시작');
          safePlayVideo();
        }
      }, 150);
    }
  };

  // 음소거 토글 핸들러
  const handleToggleMute = () => {
    console.log('음소거 토글');
    toggleMute();
    
    if (playerReady) {
      setTimeout(() => {
        // toggleMute 이후에는 isMuted 상태가 반전되므로 조건을 반대로 체크
        if (!isMuted) {
          console.log('유튜브 플레이어 음소거');
          safeMute();
        } else {
          console.log('유튜브 플레이어 음소거 해제');
          safeUnMute();
        }
      }, 150);
    }
  };

  // 다음 트랙 재생 핸들러
  const handleNext = () => {
    console.log('다음 트랙으로 이동');
    playNext();
  };

  // 플레이리스트에서 항목 재생
  const playItemFromPlaylist = (index) => {
    console.log('플레이리스트에서 항목 재생:', index);
    if (index >= 0 && index < playlist.length) {
      playAtIndex(index);
    }
  };

  // 정기적인 시간 업데이트를 위한 인터벌 설정
  useEffect(() => {
    if (!isPlaying || !playerReady) return;
    
    // 1초마다 시간 업데이트
    const intervalId = setInterval(handleTimeUpdate, 1000);
    return () => clearInterval(intervalId);
  }, [isPlaying, playerReady, handleTimeUpdate]);

  // 플레이어 초기화 오류 복구 메커니즘
  useEffect(() => {
    if (lastError && !playerReady && initRetryCount >= 3) {
      // 심각한 초기화 실패 이후 복구 시도
      const recoveryTimer = setTimeout(() => {
        console.log('플레이어 복구 시도...');
        setInitRetryCount(0); // 재시도 카운터 리셋
        setLastError(null);   // 오류 상태 리셋
        
        // 플레이어 상태 리셋
        setIsReady(false);
        setPlayerInitialized(false);
        setPlayerReady(false);
        
        // 페이지 리로딩 없이 플레이어만 다시 마운트하기 위한 트릭
        if (videoId) {
          // 비디오 ID를 일시적으로 변경했다가 다시 원래 값으로 되돌림
          const tempVideoId = null;
          setTimeout(() => {
            // 원래 비디오 ID로 복원 (다시 마운트 트리거)
            // 이 부분은 실제로는 작동하지 않지만, 실제 구현에서는
            // 상태를 변경하여 플레이어를 리마운트하는 로직이 필요함
          }, 100);
        }
      }, 5000); // 5초 후 복구 시도
      
      return () => clearTimeout(recoveryTimer);
    }
  }, [lastError, playerReady, initRetryCount, videoId]);

  // 진행 상태 포맷팅을 위한 함수 (시:분:초 형식)
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00:00";
    
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    // 시간이 0이면 분:초만 표시, 그렇지 않으면 시:분:초 표시
    if (hours > 0) {
      return `${hours}:${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
    } else {
      return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    }
  };

  // 화면에 표시할 정보
  const displayTitle = youtubeInfo?.title || media?.title || 'No media';
  const displayType = media?.type === 'news' ? '뉴스' : media?.type === 'station' ? '스테이션' : '미디어';
  const displayThumbnail = videoId ? getYoutubeThumbnail(videoId) : media?.thumbnailUrl;

  // 플레이어가 표시되지 않는 경우
  if (!media) return null;

  // YouTube 플레이어 설정 옵션
  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 0, // 자동 재생 비활성화 (수동으로 제어)
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      origin: typeof window !== 'undefined' ? window.location.origin : '',
      playsinline: 1 // 모바일에서 인라인 재생을 위한 설정
    },
  };

  // 미니 플레이어 렌더링
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white z-[1000] h-16 shadow-lg border-t border-zinc-800/50">
      {/* 메인 컨텐츠 */}
      <div className="h-full flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 미니 플레이어 헤더 */}
        <div className="flex items-center justify-between h-16 w-full">
          {/* 좌측: 썸네일과 정보 - 클릭 시 원본 게시물로 이동 */}
          <Link
            href={media?.slug ? `/${media.type}/${media.slug}` : '#'}
            className="flex items-center w-1/4 flex-shrink-0 cursor-pointer hover:bg-gray-900/50 rounded px-2 py-1 transition-colors"
            onClick={(e) => {
              // 링크가 없는 경우 이동 방지
              if (!media?.slug) {
                e.preventDefault();
              }
            }}
          >
            {/* 썸네일 */}
            <div className="relative h-10 w-10 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
              {displayThumbnail ? (
                <Image
                  src={displayThumbnail}
                  alt={displayTitle}
                  width={40}
                  height={40}
                  className="object-cover"
                  loading="eager"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* 정보 섹션 */}
            <div className="ml-2 w-[calc(100%-48px)] flex-shrink-0">
              <p className="text-sm font-medium truncate">{displayTitle}</p>
              <p className="text-xs text-accent truncate">{displayType}</p>
            </div>
          </Link>
          
          {/* 중앙: 컨트롤 섹션 */}
          <div className="flex items-center ml-4 flex-shrink-0">
            {/* 재생/일시정지 버튼 */}
            <button 
              onClick={onPlayPause} 
              className="text-white p-1 mx-2 focus:outline-none"
              aria-label={isPlaying ? "일시정지" : "재생"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            
            {/* 다음 트랙 버튼 */}
            <button 
              onClick={handleNext}
              disabled={playlist.length <= 1}
              className={`text-white p-1 mx-1 focus:outline-none ${
                playlist.length <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-300'
              }`}
              aria-label="다음 트랙"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
          
          {/* 중앙: 프로그레스 바 */}
          <div className="flex-1 flex flex-col justify-center mx-4 min-w-0 max-w-[60%]">
            <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden relative">
              <div 
                className="bg-white h-full rounded-full transition-none"
                style={{ width: `${duration > 0 ? Math.min(100, Math.max(0, (playedSeconds / duration) * 100)) : 0}%` }}
                ref={progressBarRef}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(playedSeconds)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* 우측: 볼륨 및 플레이리스트 버튼 */}
          <div className="flex items-center relative flex-shrink-0">
            {/* 볼륨 버튼 */}
            <button 
              className="p-1 mx-1 hover:text-gray-300 focus:outline-none"
              onClick={handleToggleMute}
              aria-label={isMuted ? "음소거 해제" : "음소거"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
            
            {/* 플레이리스트 토글 버튼 */}
            <button 
              onClick={togglePlaylist}
              className={`text-white p-1 mx-1 focus:outline-none ${showPlaylist ? 'text-blue-400' : 'hover:text-gray-300'}`}
              aria-label="플레이리스트 표시"
            >
              <List className="h-5 w-5" />
            </button>
            
            {/* 플레이리스트 UI */}
            {showPlaylist && playlist.length > 0 && (
              <div className="absolute bottom-full right-0 w-80 bg-black border border-gray-700 shadow-lg rounded-t-md" style={{ marginBottom: '20px' }}>
                {/* 플레이리스트 헤더 */}
                <div className="flex justify-between items-center p-3 border-b border-gray-700 sticky top-0">
                  <div className="flex items-center">
                    <h3 className="text-white font-bold">UP NEXT</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">AUTO-PLAY</span>
                    <div className="relative inline-block w-10 align-middle select-none mr-3">
                      <input 
                        type="checkbox"
                        id="autoplay-toggle"
                        className="sr-only"
                        checked={autoPlay}
                        onChange={() => setAutoPlay(!autoPlay)}
                      />
                      <label 
                        htmlFor="autoplay-toggle"
                        className="block h-5 overflow-hidden rounded-full bg-gray-800 border border-gray-700 cursor-pointer"
                      >
                        <span 
                          className={`block h-4 w-4 rounded-full transform transition-transform duration-200 ease-in-out ${
                            autoPlay 
                              ? 'translate-x-5 bg-blue-500' 
                              : 'translate-x-0.5 bg-gray-400'
                          }`}
                          style={{ marginTop: '2px' }}
                        ></span>
                      </label>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
                      onClick={() => setShowPlaylist(false)}
                      aria-label="닫기"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* 트랙 목록 */}
                <ul className="max-h-72 overflow-y-auto">
                  {playlist.map((item, index) => (
                    <li 
                      key={`${item.type}-${item.slug}`} 
                      className={`p-3 border-b border-gray-700 flex items-center hover:bg-gray-900 cursor-pointer ${
                        currentIndex === index ? 'bg-gray-900' : ''
                      }`}
                      onClick={() => playItemFromPlaylist(index)}
                    >
                      {/* 재생 버튼 */}
                      <div className="mr-3">
                        <button className="w-8 h-8 flex items-center justify-center">
                          {currentIndex === index && isPlaying ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      
                      {/* 트랙 정보 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.title}</p>
                        <div className="flex items-center text-xs text-gray-400">
                          <span className="uppercase truncate text-accent">{item.type === 'news' ? '뉴스' : item.type === 'station' ? '스테이션' : '미디어'}</span>
                          <span className="mx-1">•</span>
                          <span>
                            {item.publishedAt 
                              ? new Date(item.publishedAt).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: '2-digit'
                                }).replace(/\//g, '.')
                              : item.date || '00.00.00'
                            }
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* YouTube Player (숨겨진 상태로 유지) */}
      {isYoutubeMedia && videoId && (
        <div className="absolute bottom-0 left-0 w-1 h-1 overflow-hidden opacity-0">
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={handleReady}
            onStateChange={handleStateChange}
          />
        </div>
      )}
    </div>
  );
}
