import React from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import CardGrid from '../../components/CardGrid';
import { mockStationData } from '../../utils/mockData';

export default function StationIndex() {
  // 최신순으로 정렬
  const sortedStations = [...mockStationData].sort((a, b) => 
    new Date(b.publishedAt) - new Date(a.publishedAt)
  );
  
  return (
    <Layout>
      <Head>
        <title>{`스테이션 | Ostrozon`}</title>
        <meta name="description" content="큐레이션된 언더그라운드 전자음악 스테이션을 즐겨보세요." />
      </Head>
      
      <main className="container-custom py-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">스테이션</h1>
        
        <CardGrid items={sortedStations} />
      </main>
    </Layout>
  );
} 