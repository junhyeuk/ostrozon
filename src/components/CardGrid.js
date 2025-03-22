import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useStore from '../utils/store';

export default function CardGrid({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">콘텐츠가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}

function Card({ item }) {
  const [isHovering, setIsHovering] = useState(false);
  const { setCurrentMedia } = useStore();
  
  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 필요한 모든 속성을 포함한 미디어 객체 생성
    const mediaForPlayer = {
      ...item,
      type: item.type,
      mediaType: item.mediaType || 'tts', // 기본값 설정
      title: item.title,
      description: item.description,
      author: item.author,
      thumbnailUrl: item.thumbnailUrl,
      slug: item.slug,
      id: item.id
    };
    
    console.log('카드에서 재생 클릭:', mediaForPlayer);
    setCurrentMedia(mediaForPlayer);
  };

  // 날짜 포맷팅 (DD.MM.YY 형식)
  const formattedDate = item.date 
    ? new Date(item.date).toLocaleDateString('en-GB', {
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit'
    }).replace(/\//g, '.') 
    : '20.03.25'; // 기본값 설정
  
  // 게시물 타입 설정
  const postType = item.type === 'news' ? '뉴스' : '스테이션';
  
  return (
    <div className="bg-black border border-zinc-900 overflow-hidden group">
      <Link href={`/${item.type}/${item.slug}`}>
        <div 
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* 썸네일 이미지 */}
          <div className="relative h-60 w-full overflow-hidden">
            <Image 
              src={item.thumbnailUrl} 
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* 호버 시 플레이 버튼 표시 */}
            {isHovering && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handlePlayClick}
                  className="h-16 w-16 flex items-center justify-center bg-transparent"
                  aria-label="재생"
                >
                  <svg 
                    width="60" 
                    height="60" 
                    viewBox="0 0 24 24" 
                    fill="white" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polygon points="8,5 8,19 19,12" fill="white" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {/* 게시물 타입 표시 (기존 날짜 배지 위치) */}
          <div className="absolute top-0 left-0 p-1.5 text-xs text-white">
            <div className="inline-block bg-black/70 px-1.5 py-0.5 text-xs">
              {postType}
            </div>
          </div>
          
          {/* 상단 우측 배지는 삭제 */}
        </div>
        
        {/* 하단 텍스트 영역 */}
        <div className="p-3">
          {/* 날짜 정보 - 제목 위에 표시 */}
          <div className="text-xs text-gray-400 mb-1.5">
            {formattedDate}
          </div>
          
          {/* 제목 - 대문자로 변경 */}
          <h3 className="text-[14px] font-bold text-white uppercase tracking-wider mb-2 leading-tight">
            {item.title.toUpperCase()}
          </h3>
          
          {/* 카테고리 태그들 */}
          <div className="flex flex-wrap gap-1 mt-1">
            {item.categories && item.categories.slice(0, 3).map((category, index) => (
              <span key={index} className="text-[10px] uppercase px-1.5 py-0.5 bg-zinc-800 text-zinc-300 tracking-wide">
                {category.toUpperCase()}
              </span>
            ))}
            
            {/* 이미지처럼 기본 태그 추가 */}
            {(!item.categories || item.categories.length === 0) && (
              <>
                <span className="text-[10px] uppercase px-1.5 py-0.5 bg-zinc-800 text-zinc-300 tracking-wide">
                  {item.type === 'news' ? 'BASS' : 'HOUSE'}
                </span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 bg-zinc-800 text-zinc-300 tracking-wide">
                  {item.type === 'news' ? 'GRIME' : 'AMBIENT'}
                </span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 bg-zinc-800 text-zinc-300 tracking-wide">
                  LEFTFIELD TECHNO
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
