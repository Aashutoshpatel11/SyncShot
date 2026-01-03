
"use client"
import React, { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchImages } from '../api';
import useStore from '../store';
import Feed from '../components/Feed';
import ImageView from '../components/ImageView';
import { UnsplashImage } from '../types';

const App: React.FC = () => {
  const { initializeUser, user } = useStore();
  const [ selectedImage, setSelectedImage ] = useState<UnsplashImage | null>(null);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['images'],
    queryFn: fetchImages,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {return lastPage.length > 0 ? allPages.length + 1 : undefined;},
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Feed />

      <div className="md:ml-[25%] p-4 md:p-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Sync Shot</h1>
          {user && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: user.color }} />
              <span className="text-sm font-medium text-gray-600">{user.nickname}</span>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.pages.map((page) =>
            page.map((img) => (
              <div 
                key={img.id} 
                onClick={() => setSelectedImage(img)}
                className="group relative aspect-3/4 overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-all"
              >
                <img 
                  src={img.urls.small} 
                  alt={img.alt_description} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More Images' : 'End of Gallery'}
          </button>
        </div>
      </div>

      {selectedImage && (
        <ImageView 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
};

export default App;