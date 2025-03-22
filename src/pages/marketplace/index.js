import Head from 'next/head';
import Layout from '../../components/Layout';
import { mockMarketplaceData } from '../../utils/mockData';
import Link from 'next/link';
import Image from 'next/image';

export default function Marketplace() {
  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '원';
  };

  return (
    <Layout>
      <Head>
        <title>스토어 - Ostrozon</title>
        <meta name="description" content="Ostrozon 공식 스토어 - 전자음악 관련 상품" />
      </Head>
      
      <main className="container-custom py-6">
        {/* 상품 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockMarketplaceData.map(item => (
            <Link href={`/marketplace/${item.slug}`} key={item.id}>
              <div className="group">
                {/* 상품 이미지 */}
                <div className="relative aspect-square bg-zinc-900 mb-3 overflow-hidden">
                  <Image
                    src={item.mainImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Pre-order 배지 (item에 preOrder 필드가 true인 경우 표시) */}
                  {item.id === 'item-2' && (
                    <div className="absolute top-0 left-0 bg-black px-3 py-1">
                      <span className="text-xs uppercase">pre-order</span>
                    </div>
                  )}
                </div>
                
                {/* 상품 정보 */}
                <h3 className="text-sm font-medium uppercase mb-1">
                  {item.title}
                </h3>
                <div className="text-sm">
                  {item.id === 'item-1' ? 'SOLD OUT' : formatPrice(item.price)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
} 