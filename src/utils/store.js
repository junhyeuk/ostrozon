import { create } from 'zustand';

// 미디어 아이템이 유효한지 확인하는 유틸리티 함수
const isValidMedia = (media) => {
  return media && 
         typeof media === 'object' && 
         media.slug && 
         (media.type === 'news' || media.type === 'station');
};

// 미디어 아이템이 동일한지 확인하는 유틸리티 함수
const isSameMedia = (media1, media2) => {
  if (!media1 || !media2) return false;
  return media1.slug === media2.slug && 
         media1.type === media2.type;
};

// 상태 관리를 위한 Zustand 스토어 생성
const useStore = create((set, get) => ({
  // 현재 미디어 상태
  currentMedia: null,
  isPlaying: false,
  isMuted: false,
  volume: 80,
  playedSeconds: 0,
  
  // 사용자 필터 설정
  activeFilter: 'all',
  sortOrder: 'latest',
  
  // 플레이리스트 관리
  playlist: [],
  currentIndex: -1,
  playHistory: [],
  
  // 필터 설정
  filters: {
    category: null,
    tag: null,
    searchTerm: '',
    viewMode: 'grid', // 'grid' 또는 'list'
  },
  
  // 액션
  setCurrentMedia: (media) => {
    // 유효하지 않은 미디어 객체는 무시
    if (!isValidMedia(media)) {
      console.error('유효하지 않은 미디어 객체:', media);
      return;
    }

    console.log('미디어 설정:', media.title || media.slug);
    const currentState = get();
    
    // 플레이리스트에 이미 있는지 확인
    const existingIndex = currentState.playlist.findIndex(
      item => isSameMedia(item, media)
    );

    // 플레이리스트 및 인덱스 업데이트
    set(state => {
      // 새로운 플레이리스트 상태 계산
      let newPlaylist = [...state.playlist];
      let newIndex = existingIndex;
      
      // 플레이리스트에 없는 경우 추가
      if (existingIndex === -1) {
        newPlaylist = [...newPlaylist, media];
        newIndex = newPlaylist.length - 1;
        console.log('플레이리스트에 새 항목 추가됨. 현재 크기:', newPlaylist.length);
      } else {
        console.log('플레이리스트의 기존 항목으로 전환. 인덱스:', existingIndex);
      }
      
      // 재생 이력 업데이트
      let newHistory = [...state.playHistory];
      // 같은 항목이 연속해서 추가되지 않도록 함
      if (newHistory.length === 0 || !isSameMedia(newHistory[newHistory.length - 1], media)) {
        // 이력이 너무 길어지지 않도록 제한
        if (newHistory.length >= 20) {
          newHistory = newHistory.slice(1); // 가장 오래된 항목 제거
        }
        newHistory.push(media);
      }
      
      return {
        currentMedia: media,
        isPlaying: true, // 미디어 변경 시 자동 재생
        currentIndex: newIndex,
        playlist: newPlaylist,
        playHistory: newHistory,
        playedSeconds: 0, // 새 미디어로 변경 시 재생 시간 초기화
      };
    });
  },
  
  togglePlay: () => {
    console.log('재생 토글. 현재 상태:', get().isPlaying ? '재생 중' : '일시 정지');
    set(state => ({ isPlaying: !state.isPlaying }));
  },
  
  togglePlayState: (playState) => {
    console.log('재생 상태 직접 설정:', playState ? '재생' : '일시 정지');
    set({ isPlaying: playState });
  },
  
  toggleMute: () => {
    console.log('음소거 토글. 현재 상태:', get().isMuted ? '음소거 됨' : '음소거 안 됨');
    set(state => ({ isMuted: !state.isMuted }));
  },
  
  setVolume: (vol) => {
    // 볼륨 범위 제한 (0-100)
    const validVolume = Math.max(0, Math.min(100, vol));
    console.log('볼륨 설정:', validVolume);
    set({ volume: validVolume });
  },
  
  setPlayedSeconds: (seconds) => {
    set({ playedSeconds: seconds });
  },
  
  setFilter: (filterObj) => {
    set(state => ({
      filters: {
        ...state.filters,
        ...filterObj
      }
    }));
  },
  
  // 플레이리스트에 추가
  addToPlaylist: (media) => {
    if (!isValidMedia(media)) {
      console.error('유효하지 않은 미디어 객체:', media);
      return;
    }

    set(state => {
      // 이미 있는지 확인
      const exists = state.playlist.some(item => isSameMedia(item, media));
      if (exists) {
        console.log('이미 플레이리스트에 있음:', media.title || media.slug);
        return state; // 변경 없음
      }

      console.log('플레이리스트에 추가:', media.title || media.slug);
      
      // 날짜 포맷 생성 (publishedAt이 있는 경우 이를 활용)
      let formattedDate = '00.00.00';
      if (media.publishedAt) {
        formattedDate = new Date(media.publishedAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).replace(/\//g, '.');
      }
      
      // 장소 정보 및 날짜 정보 추가
      const mediaWithLocation = {
        ...media,
        location: media.location || (media.type === 'station' ? media.city : 'UNKNOWN'),
        date: media.date || formattedDate
      };
      
      // 플레이리스트에 추가
      return {
        playlist: [...state.playlist, mediaWithLocation]
      };
    });
  },
  
  // 플레이리스트에서 제거
  removeFromPlaylist: (media) => {
    if (!media) return;

    const state = get();
    const index = state.playlist.findIndex(item => isSameMedia(item, media));
    
    if (index === -1) {
      console.log('플레이리스트에서 항목을 찾을 수 없음');
      return; // 항목 없음
    }

    console.log('플레이리스트에서 제거:', media.title || media.slug);
    
    // 새로운 플레이리스트 - 해당 항목 제외
    const newPlaylist = [
      ...state.playlist.slice(0, index),
      ...state.playlist.slice(index + 1)
    ];

    // 현재 인덱스 조정
    let newIndex = state.currentIndex;
    
    // 현재 재생 중인 항목이 제거되는 경우
    if (index === state.currentIndex) {
      if (newPlaylist.length > 0) {
        // 다음 항목으로 이동 (순환)
        newIndex = index >= newPlaylist.length ? 0 : index;
        set({
          playlist: newPlaylist,
          currentIndex: newIndex,
          currentMedia: newPlaylist[newIndex],
        });
      } else {
        // 플레이리스트가 비어있으면 재생 중지
        set({
          playlist: [],
          currentIndex: -1,
          currentMedia: null,
          isPlaying: false
        });
      }
    } else {
      // 재생 중인 항목이 제거되는 항목보다 뒤에 있는 경우
      if (state.currentIndex > index) {
        newIndex = state.currentIndex - 1;
      }
      
      set({
        playlist: newPlaylist,
        currentIndex: newIndex
      });
    }
  },
  
  clearPlaylist: () => {
    console.log('플레이리스트 비우기');
    set({
      playlist: [],
      currentIndex: -1,
      currentMedia: null,
      isPlaying: false
    });
  },
  
  // 이전/다음 트랙 재생
  playNext: () => {
    const state = get();
    
    if (state.playlist.length === 0) {
      console.log('플레이리스트가 비어있음');
      return;
    }
    
    // 다음 인덱스 계산 (순환)
    const nextIndex = (state.currentIndex + 1) % state.playlist.length;
    const nextMedia = state.playlist[nextIndex];
    
    console.log('다음 트랙 재생:', nextMedia.title || nextMedia.slug);
    
    // 다음 미디어로 설정
    set({
      currentMedia: nextMedia,
      currentIndex: nextIndex,
      isPlaying: true,
      playedSeconds: 0
    });
  },
  
  playPrevious: () => {
    const state = get();
    
    if (state.playlist.length === 0) {
      console.log('플레이리스트가 비어있음');
      return;
    }
    
    // 재생 이력이 있고 현재 트랙이 재생된 지 5초 미만이면 이력에서 이전 트랙 선택
    if (state.playHistory.length > 1 && state.playedSeconds < 5) {
      // 가장 마지막 항목(현재 항목)을 제외한 이전 항목 가져오기
      const prevMedia = state.playHistory[state.playHistory.length - 2];
      const prevIndex = state.playlist.findIndex(item => isSameMedia(item, prevMedia));
      
      if (prevIndex !== -1) {
        console.log('이전 트랙으로 돌아가기:', prevMedia.title || prevMedia.slug);
        
        // 이전 미디어로 설정
        set({
          currentMedia: prevMedia,
          currentIndex: prevIndex,
          isPlaying: true,
          playedSeconds: 0,
          // 가장 최근 이력 제거 (현재 항목)
          playHistory: state.playHistory.slice(0, -1)
        });
        return;
      }
    }
    
    // 이력이 없거나 재생 시간이 5초 이상이면 단순히 현재 트랙을 처음부터 재생
    // 또는 인덱스 기반으로 이전 트랙 선택
    const prevIndex = (state.currentIndex - 1 + state.playlist.length) % state.playlist.length;
    const prevMedia = state.playlist[prevIndex];
    
    console.log('이전 트랙 재생:', prevMedia.title || prevMedia.slug);
    
    // 이전 미디어로 설정
    set({
      currentMedia: prevMedia,
      currentIndex: prevIndex,
      isPlaying: true,
      playedSeconds: 0
    });
  },
  
  // 플레이리스트에서 특정 인덱스 재생
  playAtIndex: (index) => {
    const state = get();
    
    if (index < 0 || index >= state.playlist.length) {
      console.error('유효하지 않은 플레이리스트 인덱스:', index);
      return;
    }
    
    const mediaToPlay = state.playlist[index];
    console.log('인덱스에서 재생:', index, mediaToPlay.title || mediaToPlay.slug);
    
    set({
      currentMedia: mediaToPlay,
      currentIndex: index,
      isPlaying: true,
      playedSeconds: 0
    });
  },
  
  // 미디어가 플레이리스트에 있는지 확인
  isInPlaylist: (media) => {
    if (!media) return false;
    return get().playlist.some(item => isSameMedia(item, media));
  },
  
  // 현재 미디어가 주어진 미디어와 같은지 확인
  isCurrentMedia: (media) => {
    const currentMedia = get().currentMedia;
    if (!currentMedia || !media) return false;
    return isSameMedia(currentMedia, media);
  },
  
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setSortOrder: (order) => set({ sortOrder: order }),
}));

export default useStore;
