import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { mockMarketplaceData } from '../../utils/mockData';

export default function MarketplaceDetail({ item, relatedItems }) {
  const router = useRouter();
  const { slug } = router.query;
  
  // 이미지 갤러리 상태
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const allImages = item ? [item.mainImage, ...item.additionalImages] : [];
  
  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '원';
  };
  
  // 이미지 이동 핸들러
  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };
  
  // 다음 이미지
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  
  // 이전 이미지
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };
  
  // 상품이 없을 경우 로딩 상태 표시
  if (router.isFallback) {
    return (
      <Layout>
        <div className="container-custom py-8 min-h-screen flex items-center justify-center">
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </Layout>
    );
  }
  
  // 상품이 없을 경우 404 표시
  if (!item) {
    return (
      <Layout>
        <div className="container-custom py-8 min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">상품을 찾을 수 없습니다</h1>
          <p className="text-gray-400 mb-6">요청하신 상품이 존재하지 않거나 삭제되었을 수 있습니다.</p>
          <Link href="/marketplace" className="bg-accent text-white px-4 py-2 rounded-sm">
            스토어로 돌아가기
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Head>
        <title>{item.title} - Ostrozon 스토어</title>
        <meta name="description" content={item.description.substring(0, 155)} />
      </Head>
      
      <main className="container-custom py-8">
        {/* 상단 네비게이션 */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/marketplace" className="text-accent hover:underline">스토어</Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 왼쪽: 이미지 갤러리 */}
          <div>
            {/* 메인 이미지 */}
            <div className="relative aspect-square bg-black border border-zinc-900 overflow-hidden mb-4">
              <Image
                src={allImages[currentImageIndex]}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />
              
              {/* 이미지 네비게이션 버튼 */}
              {allImages.length > 1 && (
                <>
                  <button 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 rounded-full"
                    onClick={prevImage}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 rounded-full"
                    onClick={nextImage}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* 상태 배지 - pre-order 표시 */}
              {item.id === 'item-2' && (
                <div className="absolute top-0 left-0 bg-black px-3 py-1">
                  <span className="text-xs uppercase">pre-order</span>
                </div>
              )}
            </div>
            
            {/* 썸네일 갤러리 */}
            {allImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-20 w-20 border-2 flex-shrink-0 ${
                      currentImageIndex === index ? 'border-accent' : 'border-zinc-800'
                    }`}
                    onClick={() => handleImageChange(index)}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* 오른쪽: 상품 정보 */}
          <div>
            {/* 상품 기본 정보 */}
            <h1 className="text-2xl font-medium uppercase mb-4">{item.title}</h1>
            
            <div className="text-xl mb-6">
              {item.id === 'item-1' ? (
                <span className="text-gray-300">SOLD OUT</span>
              ) : (
                formatPrice(item.price)
              )}
            </div>
            
            {/* 상품 설명 */}
            <div className="space-y-4 prose prose-sm prose-invert max-w-none mb-8">
              <p className="text-gray-300">{item.description}</p>
            </div>
            
            {/* 태그 */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="bg-zinc-900 text-gray-400 px-2 py-1 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* 구매 버튼 */}
            {item.id !== 'item-1' && (
              <button className="w-full py-3 bg-white text-black font-medium hover:bg-gray-200 transition-colors">
                구매하기
              </button>
            )}
          </div>
        </div>
        
        {/* 관련 상품 */}
        {relatedItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-lg font-medium uppercase mb-6">관련 상품</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedItems.map(relatedItem => (
                <Link href={`/marketplace/${relatedItem.slug}`} key={relatedItem.id}>
                  <div className="group">
                    {/* 상품 이미지 */}
                    <div className="relative aspect-square bg-zinc-900 mb-3 overflow-hidden">
                      <Image
                        src={relatedItem.mainImage}
                        alt={relatedItem.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* 상품 정보 */}
                    <h3 className="text-sm font-medium uppercase mb-1">
                      {relatedItem.title}
                    </h3>
                    <div className="text-sm">
                      {relatedItem.id === 'item-1' ? 'SOLD OUT' : formatPrice(relatedItem.price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = mockMarketplaceData.map(item => ({
    params: { slug: item.slug }
  }));
  
  return {
    paths,
    fallback: true
  };
}

export async function getStaticProps({ params }) {
  const item = mockMarketplaceData.find(item => item.slug === params.slug);
  
  if (!item) {
    return {
      notFound: true
    };
  }
  
  // 관련 상품 선택: 무작위 정렬 제거, ID 기준으로 정렬
  const relatedItems = mockMarketplaceData
    .filter(i => i.id !== item.id)
    .sort((a, b) => a.id.localeCompare(b.id))
    .slice(0, 4);
  
  return {
    props: {
      item,
      relatedItems
    },
    revalidate: 60
  };
} 