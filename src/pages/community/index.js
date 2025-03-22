import Head from 'next/head';
import { useState } from 'react';
import Layout from '../../components/Layout';
import { mockCommunityData } from '../../utils/mockData';
import Link from 'next/link';
import Image from 'next/image';

export default function Community() {
  const [activeTab, setActiveTab] = useState('popular');
  
  // 탭 클릭 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // 데이터 필터링 및 정렬
  const getTabData = () => {
    let filteredData = [...mockCommunityData];
    
    // 탭별 필터링
    if (activeTab === 'popular') {
      return filteredData.sort((a, b) => b.viewCount - a.viewCount);
    } else if (activeTab === 'recent') {
      return filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (activeTab === 'categories') {
      // 카테고리 탭은 데이터가 아닌 카테고리 리스트를 반환
      return getCommunityCategories();
    }
    
    return filteredData;
  };
  
  // 카테고리 리스트 생성
  const getCommunityCategories = () => {
    const categories = [
      { id: 'general', name: '자유게시판', icon: 'chat-bubble', count: 128 },
      { id: 'events', name: '이벤트/공연', icon: 'calendar', count: 56 },
      { id: 'music', name: '음악 이야기', icon: 'music-note', count: 89 },
      { id: 'gear', name: '중고장터', icon: 'device', count: 43 },
      { id: 'producers', name: '프로듀서 라운지', icon: 'user', count: 32 },
      { id: 'collabs', name: '협업 모집', icon: 'users', count: 17 },
    ];
    
    return categories;
  };
  
  return (
    <Layout>
      <Head>
        <title>커뮤니티 - Ostrozon</title>
        <meta name="description" content="언더그라운드 전자음악 관련 토론과 정보 공유를 위한 커뮤니티" />
      </Head>
      
      <main className="container-custom py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">커뮤니티</h1>
          <p className="text-gray-400 mt-2">언더그라운드 전자음악 관련 토론과 정보 공유</p>
        </div>
        
        {/* 탭 네비게이션 */}
        <div className="border-b border-zinc-800 mb-8">
          <div className="flex space-x-1 -mb-px">
            <button
              className={`py-3 px-4 font-medium transition-colors duration-200 relative ${
                activeTab === 'popular' 
                  ? 'text-accent border-b-2 border-accent' 
                  : 'text-foreground hover:text-accent'
              }`}
              onClick={() => handleTabChange('popular')}
            >
              인기글
            </button>
            <button
              className={`py-3 px-4 font-medium transition-colors duration-200 relative ${
                activeTab === 'recent' 
                  ? 'text-accent border-b-2 border-accent' 
                  : 'text-foreground hover:text-accent'
              }`}
              onClick={() => handleTabChange('recent')}
            >
              최신글
            </button>
            <button
              className={`py-3 px-4 font-medium transition-colors duration-200 relative ${
                activeTab === 'categories' 
                  ? 'text-accent border-b-2 border-accent' 
                  : 'text-foreground hover:text-accent'
              }`}
              onClick={() => handleTabChange('categories')}
            >
              카테고리
            </button>
          </div>
        </div>
        
        {/* 탭 내용 */}
        <div className="mt-6">
          {activeTab === 'categories' ? (
            <CategoryView categories={getTabData()} />
          ) : (
            <PostListView posts={getTabData()} />
          )}
        </div>
        
        {/* 게시글 작성 버튼 */}
        <div className="fixed bottom-24 right-6 z-10 md:bottom-8">
          <button className="h-14 w-14 rounded-full bg-accent text-white shadow-lg flex items-center justify-center hover:bg-accent/80 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </main>
    </Layout>
  );
}

// 카테고리 보기 컴포넌트
function CategoryView({ categories }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link 
          href={`/community/category/${category.id}`} 
          key={category.id}
          className="bg-black border border-zinc-900 p-6 rounded-sm hover:border-accent/50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-secondary/20 rounded-md flex items-center justify-center text-accent">
              {category.icon === 'chat-bubble' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )}
              {category.icon === 'calendar' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              {category.icon === 'music-note' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              )}
              {category.icon === 'device' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
              {category.icon === 'user' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
              {category.icon === 'users' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">{category.name}</h3>
              <p className="text-sm text-gray-400 mt-1">게시글 {category.count}개</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// 게시글 목록 컴포넌트
function PostListView({ posts }) {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Link href={`/community/post/${post.id}`} key={post.id} className="block">
          <div className="bg-black border border-zinc-900 hover:border-accent/30 transition-colors duration-200">
            <div className="p-6">
              {/* 게시글 헤더 - 카테고리 및 작성일 */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs uppercase px-2 py-1 bg-secondary/20 text-accent tracking-wide">
                  {post.category}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              {/* 게시글 제목 */}
              <h3 className="text-xl font-medium text-white mb-2">{post.title}</h3>
              
              {/* 게시글 내용 미리보기 */}
              <p className="text-gray-300 text-sm line-clamp-2 mb-4">{post.content}</p>
              
              {/* 게시글 푸터 - 통계 */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  {post.tags && post.tags.length > 0 && (
                    <span className="text-accent">#{post.tags[0]}</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{post.viewCount}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span>{post.commentCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 