import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useStore from '../utils/store';

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { 
    currentMedia, 
    activeFilter, 
    setActiveFilter, 
    sortOrder, 
    setSortOrder,
  } = useStore();
  const router = useRouter();

  // 페이지 경로에 따른 필터 설정
  useEffect(() => {
    // 페이지에 따라 자동으로 필터 설정
    if (router.pathname === '/news' || router.pathname.startsWith('/news/')) {
      setActiveFilter('news');
    } else if (router.pathname === '/station' || router.pathname.startsWith('/station/')) {
      setActiveFilter('station');
    } else if (router.pathname === '/') {
      // 홈페이지는 현재 필터 유지 (변경 필요 없음)
    } else {
      // 다른 페이지(스토어, 커뮤니티 등)는 필터 설정하지 않음
      // 사용자가 다시 뉴스나 스테이션으로 이동할 때 적절한 필터가 설정됨
    }
  }, [router.pathname, setActiveFilter]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const isActive = (path) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`) 
      ? 'text-accent border-b-2 border-accent' 
      : 'text-foreground hover:text-accent';
  };

  const isFilterActive = (filter) => {
    return activeFilter === filter ? 'text-accent font-bold' : 'text-foreground hover:text-accent';
  };

  const isSortActive = (sort) => {
    return sortOrder === sort ? 'text-accent font-bold' : 'text-foreground hover:text-accent';
  };

  const navigateHome = () => {
    router.push('/');
    // 무조건 필터를 'all'로 설정
    setActiveFilter('all');
  };
  
  // 각 메뉴 항목에 대한 클릭 핸들러
  const handleNavClick = (e, targetPath, filterValue) => {
    // 항상 필터값 설정
    if (filterValue) {
      setActiveFilter(filterValue);
    }
    
    if (router.pathname === '/' && filterValue) {
      // 홈페이지에서는 필터만 변경
      e.preventDefault();
    }
    
    // 모바일 메뉴가 열려있으면 닫기
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary/90 backdrop-blur-sm sticky top-0 z-50 shadow-md">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <Link 
              href="/" 
              className="text-2xl font-heading font-bold text-foreground px-2 py-1 hover:text-accent transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                navigateHome();
              }}
            >
              Ostrozon
            </Link>
            
            <div className="hidden md:flex space-x-8">
              <Link 
                href="/news" 
                className={`${isActive('/news')} font-medium transition-colors duration-200`}
                onClick={(e) => handleNavClick(e, '/news', 'news')}
              >
                뉴스
              </Link>
              <Link 
                href="/station" 
                className={`${isActive('/station')} font-medium transition-colors duration-200`}
                onClick={(e) => handleNavClick(e, '/station', 'station')}
              >
                스테이션
              </Link>
              <Link 
                href="/community" 
                className={`${isActive('/community')} font-medium transition-colors duration-200`}
              >
                커뮤니티
              </Link>
              <Link 
                href="/marketplace" 
                className={`${isActive('/marketplace')} font-medium transition-colors duration-200`}
              >
                스토어
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-secondary/20 hover:bg-secondary/40 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <div className="relative">
                <button 
                  className="p-2 rounded-full bg-secondary/20 hover:bg-secondary/40 transition-colors duration-200"
                  onClick={toggleFilter}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-primary border border-secondary/30 rounded-md shadow-lg z-10">
                    <div className="py-2 px-4 border-b border-secondary/20">
                      <p className="text-sm font-medium text-gray-300">컨텐츠 필터</p>
                    </div>
                    <div className="py-2">
                      <div 
                        className={`px-4 py-2 text-sm cursor-pointer ${isFilterActive('all')}`}
                        onClick={() => {
                          setActiveFilter('all');
                          setIsFilterOpen(false);
                        }}
                      >
                        전체
                      </div>
                      <div 
                        className={`px-4 py-2 text-sm cursor-pointer ${isFilterActive('news')}`}
                        onClick={() => {
                          setActiveFilter('news');
                          setIsFilterOpen(false);
                        }}
                      >
                        뉴스
                      </div>
                      <div 
                        className={`px-4 py-2 text-sm cursor-pointer ${isFilterActive('station')}`}
                        onClick={() => {
                          setActiveFilter('station');
                          setIsFilterOpen(false);
                        }}
                      >
                        스테이션
                      </div>
                    </div>
                    
                    <div className="py-2 px-4 border-t border-b border-secondary/20">
                      <p className="text-sm font-medium text-gray-300">정렬</p>
                    </div>
                    <div className="py-2">
                      <div 
                        className={`px-4 py-2 text-sm cursor-pointer ${isSortActive('latest')}`}
                        onClick={() => {
                          setSortOrder('latest');
                          setIsFilterOpen(false);
                        }}
                      >
                        최신순
                      </div>
                      <div 
                        className={`px-4 py-2 text-sm cursor-pointer ${isSortActive('popular')}`}
                        onClick={() => {
                          setSortOrder('popular');
                          setIsFilterOpen(false);
                        }}
                      >
                        인기순
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button className="md:hidden p-2 rounded-full bg-secondary/20 hover:bg-secondary/40 transition-colors duration-200" onClick={toggleMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  href="/news" 
                  className={`${isActive('/news')} font-medium transition-colors duration-200`}
                  onClick={(e) => handleNavClick(e, '/news', 'news')}
                >
                  뉴스
                </Link>
                <Link 
                  href="/station" 
                  className={`${isActive('/station')} font-medium transition-colors duration-200`}
                  onClick={(e) => handleNavClick(e, '/station', 'station')}
                >
                  스테이션
                </Link>
                <Link 
                  href="/community" 
                  className={`${isActive('/community')} font-medium transition-colors duration-200`}
                >
                  커뮤니티
                </Link>
                <Link 
                  href="/marketplace" 
                  className={`${isActive('/marketplace')} font-medium transition-colors duration-200`}
                >
                  스토어
                </Link>

                <div className="py-2 px-2 border-t border-secondary/30 mt-2">
                  <p className="text-sm font-medium text-gray-300 mb-2">정렬</p>
                  <div className="flex space-x-2">
                    <button 
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        sortOrder === 'latest' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => setSortOrder('latest')}
                    >
                      최신순
                    </button>
                    <button 
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        sortOrder === 'popular' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => setSortOrder('popular')}
                    >
                      인기순
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      
      <div className="flex-grow">
        {children}
      </div>
      
      <footer className="bg-primary py-4 border-t border-zinc-800">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <span className="font-heading font-bold text-foreground">Ostrozon</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400">&copy; {new Date().getFullYear()}</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <Link href="/about" className="text-gray-400 hover:text-accent transition-colors">소개</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-accent transition-colors">개인정보처리방침</Link>
              <Link href="/terms" className="text-gray-400 hover:text-accent transition-colors">이용약관</Link>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
