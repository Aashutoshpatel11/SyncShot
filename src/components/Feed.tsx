import React from 'react';
import { db } from '../db';
import { DBComment, DBReaction } from '../types';
import Loader from './Loader';

type FeedItem = 
  | (DBComment & { type: 'comment' }) 
  | (DBReaction & { type: 'reaction' });

interface FeedProps {
  isOpen: boolean;
  onClose: () => void;
}

const Feed= ({ isOpen, onClose }:FeedProps) => {
  const { isLoading, error, data } = db.useQuery({
    comments: { $: { limit: 100 } },
    reactions: { $: { limit: 100 } },
  });

  if (isLoading) return <div className="w-full md:w-1/4 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto fixed left-0 top-0 hidden md:block p-4"><Loader/></div>;
  if (error) return <div className="p-4 text-red-500">Can't Fetch</div>;

  const comments = (data?.comments || []) as DBComment[];
  const reactions = (data?.reactions || []) as DBReaction[];

  const feedItems:FeedItem[] = [
    ...comments.map(c => ({ ...c, type: 'comment' } as const)),
    ...reactions.map(r => ({ ...r, type: 'reaction' } as const))
  ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 15);

  console.log("ITEMS::", feedItems);
  

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}
      <div className={`
        fixed top-0 left-0 h-screen bg-gray-50 border-r border-gray-200 overflow-y-auto z-50 w-full  md:w-1/4 
        dark:bg-gray-900 dark:border-gray-800 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:translate-x-0 md:shadow-none md:block transition-transform duration-300 ease-in-out`}>

        <div className="flex justify-between items-center p-4 =-4">
            <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100"> Live Activity</h2>
            <button 
            onClick={onClose} 
            className="p-2 text-2xl leading-none md:hidden">&times;</button>
        </div>
        <div className="space-y-3 p-4">
          {feedItems.map((item) => (
            <div key={item.id} className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 text-sm animate-fade-in-up dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: item.userColor || '#ccc' }}
                />
                <span className="font-semibold text-gray-700 dark:text-gray-200">{item.userName}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {item.type === 'reaction' 
                  ? `reacted with ${item.emoji}` 
                  : `commented: "${item.text}`}
              </p>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                {new Date(item.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Feed;