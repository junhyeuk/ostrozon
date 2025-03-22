/**
 * YouTube 썸네일 URL을 반환하는 함수
 * @param {string} videoId - YouTube 비디오 ID
 * @param {string} quality - 썸네일 품질 (default: 'hqdefault')
 * @returns {string} 썸네일 URL
 */
export const getYoutubeThumbnail = (videoId, quality = 'hqdefault') => {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * YouTube URL에서 비디오 ID를 추출하는 함수
 * @param {string} url - YouTube URL
 * @returns {string|null} 추출된 비디오 ID 또는 null
 */
export const getYoutubeVideoId = (url) => {
  if (!url) return null;
  
  // YouTube URL 패턴들
  const regexps = [
    // youtu.be/VIDEO_ID
    /youtu\.be\/([^?&]+)/,
    // youtube.com/watch?v=VIDEO_ID
    /youtube\.com\/watch\?v=([^?&]+)/,
    // youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([^?&]+)/,
    // youtube.com/v/VIDEO_ID
    /youtube\.com\/v\/([^?&]+)/
  ];
  
  for (const regex of regexps) {
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * 시간(초)을 MM:SS 형식으로 포맷팅하는 함수
 * @param {number} seconds - 변환할 초 단위 시간
 * @returns {string} MM:SS 형식의 시간
 */
export const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * 숫자를 천 단위로 콤마를 넣어 포맷팅하는 함수
 * @param {number} num - 포맷팅할 숫자
 * @returns {string} 포맷팅된 문자열
 */
export const formatNumber = (num) => {
  if (!num || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 날짜를 포맷팅하는 함수
 * @param {string|Date} date - 포맷팅할 날짜
 * @param {string} format - 포맷 형식 ('long' | 'short')
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDate = (date, format = 'long') => {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (format === 'long') {
    // 예: 2023년 3월 15일
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  } else if (format === 'short') {
    // 예: 23.03.15
    return `${d.getFullYear().toString().substr(2)}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }
  
  return d.toLocaleDateString();
};

/**
 * 문자열을 주어진 길이로 자르고 말줄임표를 추가하는 함수
 * @param {string} text - 원본 문자열
 * @param {number} length - 최대 길이
 * @returns {string} 잘린 문자열
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}; 