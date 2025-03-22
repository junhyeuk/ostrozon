import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../../components/Layout';
import { mockCommunityData } from '../../../utils/mockData';
import { useState } from 'react';

export default function CommunityPost() {
  const router = useRouter();
  const { id } = router.query;
  const [commentText, setCommentText] = useState('');
  
  // 해당 게시물 찾기
  const post = mockCommunityData.find(post => post.id === id);
  
  // 관련 게시물 찾기 (같은 카테고리의 다른 게시물)
  const relatedPosts = post
    ? mockCommunityData
        .filter(item => item.category === post.category && item.id !== post.id)
        .slice(0, 3)
    : [];
  
  // 게시물이 로딩 중이거나 찾을 수 없는 경우
  if (!post) {
    return (
      <Layout>
        <div className="container-custom py-12">
          <div className="bg-black border border-zinc-900 p-8 text-center">
            <h1 className="text-xl font-medium mb-4">
              {router.query.id ? '게시물을 찾을 수 없습니다.' : '로딩 중...'}
            </h1>
            <Link href="/community" className="text-accent hover:underline">
              커뮤니티 메인으로 돌아가기
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  // 댓글 제출 핸들러
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      // 실제 구현에서는 여기서 API 호출을 통해 댓글 저장
      console.log('댓글 제출:', commentText);
      setCommentText('');
      alert('댓글 기능은 현재 개발 중입니다.');
    }
  };
  
  return (
    <Layout>
      <Head>
        <title>{post.title} - Ostrozon 커뮤니티</title>
        <meta name="description" content={post.content.substring(0, 160)} />
      </Head>
      
      <main className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* 뒤로가기 */}
          <div className="mb-6">
            <Link href="/community" className="text-accent hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              커뮤니티로 돌아가기
            </Link>
          </div>
          
          {/* 게시물 헤더 */}
          <div className="bg-black border border-zinc-900 p-6 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xs uppercase px-2 py-0.5 bg-secondary/20 text-accent tracking-wide">
                {post.category}
              </span>
              <div className="mb-6">
                <p className="text-gray-400 text-sm">
                  {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex justify-between items-center text-sm border-t border-zinc-800 pt-4">
              <div className="flex space-x-6">
                <div className="flex items-center space-x-1 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>조회 {post.viewCount}</span>
                </div>
                
                <div className="flex items-center space-x-1 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span>댓글 {post.commentCount}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 게시물 본문 */}
          <div className="bg-black border border-zinc-900 p-6 mb-6">
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-line text-gray-300 leading-relaxed">{post.content}</p>
              
              {/* 더미 콘텐츠 추가 (실제로는 post.content에 전체 내용이 있을 것) */}
              <p className="mt-4 text-gray-300 leading-relaxed">
                위 내용은 미리보기의 일부이며, 실제 게시물에서는 더 자세한 내용을 담고 있을 것입니다. 
                게시물의 전체 내용은 API에서 가져온 실제 콘텐츠로 대체될 예정입니다.
              </p>
              <p className="mt-4 text-gray-300 leading-relaxed">
                언더그라운드 전자음악 씬에서는 다양한 의견과 경험을 공유하는 것이 중요합니다. 
                이러한 커뮤니티 활동을 통해 우리 모두가 함께 성장할 수 있습니다.
              </p>
            </div>
          </div>
          
          {/* 댓글 섹션 */}
          <div className="bg-black border border-zinc-900 p-6 mb-6">
            <h3 className="text-xl font-medium mb-6">댓글 {post.commentCount}개</h3>
            
            {/* 댓글 작성 폼 */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="mb-4">
                <textarea
                  className="w-full bg-secondary/10 border border-zinc-800 rounded-sm p-3 text-gray-300 focus:border-accent focus:ring focus:ring-accent/20 focus:ring-opacity-50"
                  rows="3"
                  placeholder="댓글을 작성해주세요..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-accent text-white px-4 py-2 rounded-sm hover:bg-accent/80 transition-colors"
                >
                  댓글 작성
                </button>
              </div>
            </form>
            
            {/* 댓글 목록 */}
            <div className="space-y-6">
              <div className="text-center py-8 text-gray-400">
                아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
              </div>
              
              {/* 예시 댓글 - 실제로는 API에서 가져온 데이터로 렌더링될 것 */}
              {/*
              <div className="border-b border-zinc-800 pb-6">
                <div className="flex space-x-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image 
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                      alt="사용자 이미지"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">사용자 이름</span>
                      <span className="text-gray-400 text-sm">2025.03.15 14:23</span>
                    </div>
                    <p className="text-gray-300 mb-3">
                      예시 댓글 내용입니다. 실제로는 API에서 가져온 댓글 내용이 표시될 것입니다.
                    </p>
                    <div className="flex space-x-4 text-sm">
                      <button className="text-gray-400 hover:text-accent transition-colors">좋아요</button>
                      <button className="text-gray-400 hover:text-accent transition-colors">답글</button>
                    </div>
                  </div>
                </div>
              </div>
              */}
            </div>
          </div>
          
          {/* 관련 게시물 */}
          {relatedPosts.length > 0 && (
            <div className="bg-black border border-zinc-900 p-6">
              <h3 className="text-xl font-medium mb-6">관련 게시물</h3>
              
              <div className="space-y-4">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    href={`/community/post/${relatedPost.id}`} 
                    key={relatedPost.id}
                    className="block hover:bg-zinc-900/30 p-3 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white hover:text-accent transition-colors mb-1">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-gray-400 line-clamp-1">{relatedPost.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {new Date(relatedPost.createdAt).toLocaleDateString('ko-KR', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
} 