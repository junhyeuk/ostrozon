import Head from 'next/head';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CardGrid from '../components/CardGrid';
import { mockNewsData, mockStationData } from '../utils/mockData';
import useStore from '../utils/store';

export default function Home() {
  const { activeFilter, sortOrder } = useStore();
  
  // Combine and sort data based on filters
  const getCombinedData = () => {
    let data = [];
    
    if (activeFilter === 'all' || activeFilter === 'news') {
      data = [...data, ...mockNewsData];
    }
    
    if (activeFilter === 'all' || activeFilter === 'station') {
      data = [...data, ...mockStationData];
    }
    
    // Sort data
    if (sortOrder === 'latest') {
      data.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (sortOrder === 'popular') {
      data.sort((a, b) => b.viewCount - a.viewCount);
    }
    
    return data;
  };
  
  return (
    <Layout>
      <Head>
        <title>Ostrozon - 언더그라운드 전자음악 커뮤니티</title>
        <meta name="description" content="언더그라운드 전자음악에 특화된 서브컬처 지향의 플랫폼" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container-custom py-8">
        <CardGrid items={getCombinedData()} />
      </main>
    </Layout>
  );
}
