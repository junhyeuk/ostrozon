import React from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import CardGrid from '../../components/CardGrid';
import { mockNewsData } from '../../utils/mockData';

export default function NewsIndex() {
  // 최신순으로 정렬
  const sortedNews = [...mockNewsData].sort((a, b) => 
    new Date(b.publishedAt) - new Date(a.publishedAt)
  );
  
  return (
    <Layout>
      <Head>
        <title>{`뉴스 | Ostrozon`}</title>
        <meta name="description" content="언더그라운드 전자음악 신과 관련된 최신 뉴스와 정보를 확인하세요." />
      </Head>
      
      <main className="container-custom py-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">뉴스</h1>
        
        <CardGrid items={sortedNews} />
      </main>
    </Layout>
  );
} 