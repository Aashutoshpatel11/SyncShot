import React from 'react';
import { db } from '../db';
import { DBComment, DBReaction } from '../types';

type FeedItem = 
  | (DBComment & { type: 'comment' }) 
  | (DBReaction & { type: 'reaction' });

const Feed: React.FC = () => {
  const { isLoading, error, data } = db.useQuery({
    comments: { $: { limit: 10 } },
    reactions: { $: { limit: 10, } },
  });

  if (isLoading) return <div className="p-4 text-gray-500">Loading feed...</div>;
  if (error) return <div className="p-4 text-red-500">Feed Error</div>;

  const comments = (data?.comments || []) as DBComment[];
  const reactions = (data?.reactions || []) as DBReaction[];

  const feedItems: FeedItem[] = [
    ...comments.map(c => ({ ...c, type: 'comment' } as const)),
    ...reactions.map(r => ({ ...r, type: 'reaction' } as const))
  ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 15);

  return (
    <div className="w-full md:w-1/4 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto fixed left-0 top-0 hidden md:block p-4">
      <h2 className="font-bold text-xl mb-4 text-gray-800">Live Activity</h2>
      <div className="space-y-3">
        {feedItems.map((item) => (
          <div key={item.id} className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 text-sm animate-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: item.userColor || '#ccc' }}
              />
              <span className="font-semibold text-gray-700">{item.userName}</span>
            </div>
            <p className="text-gray-600">
              {item.type === 'reaction' 
                ? `reacted with ${item.emoji}` 
                : `commented: "${item.text}"`}
            </p>
            <span className="text-xs text-gray-400 mt-1 block">
              {new Date(item.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;