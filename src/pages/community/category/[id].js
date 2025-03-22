import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../../components/Layout';
import { mockCommunityData } from '../../../utils/mockData';

export default function CommunityCategory() {
  const router = useRouter();
  const { id } = router.query;
  
  // 카테고리 정보
  const getCategoryInfo = () => {
    switch(id) {
      case 'general':
        return { 
          name: '자유게시판', 
          description: '전자음악과 관련된 자유로운 주제의 이야기를 나누는 공간입니다.',
          icon: 'chat-bubble' 
        };
      case 'events':
        return { 
          name: '이벤트/공연', 
          description: '다양한 전자음악 이벤트와 공연 정보를 공유하는 공간입니다.',
          icon: 'calendar' 
        };
      case 'music':
        return { 
          name: '음악 이야기', 
          description: '전자음악 트랙, 앨범, 아티스트에 대한 이야기를 나누는 공간입니다.',
          icon: 'music-note' 
        };
      case 'gear':
        return { 
          name: '중고장터', 
          description: '신디사이저, 드럼머신, DJ 장비 등 전자음악 관련 중고 장비 거래 공간입니다.',
          icon: 'device' 
        };
      case 'producers':
        return { 
          name: '프로듀서 라운지', 
          description: '전자음악 프로듀서들이 제작 팁과 경험을 공유하는 공간입니다.',
          icon: 'user' 
        };
      case 'collabs':
        return { 
          name: '협업 모집', 
          description: '함께 음악을 만들거나 이벤트를 기획할 협업자를 찾는 공간입니다.',
          icon: 'users' 
        };
      default:
        return { 
          name: '카테고리', 
          description: '전자음악 커뮤니티',
          icon: 'folder' 
        };
    }
  };
  
  const categoryInfo = getCategoryInfo();
  
  // 해당 카테고리의 게시물 찾기
  const posts = mockCommunityData.filter(post => {
    if (!id) return false;
    
    // 카테고리 ID에 따라 포스트 필터링
    switch(id) {
      case 'general':
        return post.category === '자유게시판';
      case 'events':
        return post.category === '이벤트/공연';
      case 'music':
        return post.category === '음악 이야기';
      case 'gear':
        return post.category === '중고장터';
      case 'producers':
        return post.category === '프로듀서 라운지';
      case 'collabs':
        return post.category === '협업 모집';
      default:
        return false;
    }
  });
  
  return (
    <Layout>
      <Head>
        <title>{categoryInfo.name} - Ostrozon 커뮤니티</title>
        <meta name="description" content={categoryInfo.description} />
      </Head>
      
      <main className="container-custom py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-1">
            <Link href="/community" className="text-accent hover:underline">
              커뮤니티
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-foreground">{categoryInfo.name}</span>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-secondary/20 rounded-md flex items-center justify-center text-accent">
              {categoryInfo.icon === 'chat-bubble' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )}
              {categoryInfo.icon === 'calendar' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              {categoryInfo.icon === 'music-note' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              )}
              {categoryInfo.icon === 'device' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
              {categoryInfo.icon === 'user' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
              {categoryInfo.icon === 'users' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
              {categoryInfo.icon === 'folder' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{categoryInfo.name}</h1>
              <p className="text-gray-400 text-sm mt-1">{categoryInfo.description}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              총 <span className="text-white font-medium">{posts.length}</span>개의 게시물
            </div>
            
            <Link 
              href="/community" 
              className="inline-flex items-center space-x-1 text-sm text-accent hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>모든 카테고리</span>
            </Link>
          </div>
        </div>
        
        {/* 게시물 목록 */}
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link href={`/community/post/${post.id}`} key={post.id} className="block">
                <div className="bg-black border border-zinc-900 hover:border-accent/30 transition-colors duration-200">
                  <div className="p-6">
                    {/* 게시글 헤더 - 작성일 */}
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
                    
                    {/* 게시글 푸터 - 작성자 및 통계 */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                          <Image 
                            src={post.author.profileImage}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium">{post.author.name}</span>
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
        ) : (
          <div className="bg-black border border-zinc-900 p-8 text-center">
            <h2 className="text-xl font-medium mb-4">아직 게시물이 없습니다</h2>
            <p className="text-gray-400 mb-6">이 카테고리에 첫 게시물을 작성해보세요!</p>
            <button className="bg-accent text-white px-4 py-2 rounded-sm hover:bg-accent/80 transition-colors">
              게시물 작성하기
            </button>
          </div>
        )}
        
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