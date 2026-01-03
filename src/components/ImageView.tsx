import React, { useState, FormEvent } from 'react';
import { db } from '../db';
import useStore from '../store';
import { UnsplashImage } from '../types';
import { X } from 'lucide-react'; 

interface ImageViewProps {
  image: UnsplashImage;
  onClose: () => void;
}

const ImageView: React.FC<ImageViewProps> = ({ image, onClose }) => {
  const user = useStore((state) => state.user);
  const [commentText, setCommentText] = useState<string>('');

  const { data } = db.useQuery({
    comments: { $: { where: { imageId: image.id } } },
    reactions: { $: { where: { imageId: image.id } } },
  });

  const addReaction = async (emoji: string) => {
    if (!user) return;
    await db.transact(
      db.tx.reactions[crypto.randomUUID()].update({
        imageId: image.id,
        emoji,
        userName: user.nickname,
        userColor: user.color,
        createdAt: Date.now(),
      })
    );
  };

  const addComment = (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    db.transact(
      db.tx.comments[crypto.randomUUID()].update({
        imageId: image.id,
        text: commentText,
        userName: user.nickname,
        userColor: user.color,
        createdAt: Date.now(),
      })
    );
    setCommentText('');
  };

  const emojiCounts = (data?.reactions || []).reduce<Record<string, number>>((acc, curr) => {
    acc[curr.emoji] = (acc[curr.emoji] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <button onClick={onClose} className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full">
        <X size={24} />
      </button>
      
      <div className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row">
        <div className="md:w-2/3 bg-black flex items-center justify-center">
          <img src={image.urls.regular} alt={image.alt_description} className="max-h-[60vh] md:max-h-full w-auto object-contain" />
        </div>

        <div className="md:w-1/3 flex flex-col h-[50vh] md:h-auto">
          <div className="p-4 border-b">
            <h3 className="font-bold text-gray-800 mb-2">Reactions</h3>
            <div className="flex gap-2">
              {['🔥', '❤️', '👍', '🎉'].map(emoji => (
                <button 
                  key={emoji}
                  onClick={() => addReaction(emoji)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-lg transition-colors flex items-center gap-1"
                >
                  <span>{emoji}</span>
                  <span className="text-xs font-bold text-gray-600">{emojiCounts[emoji] || 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(data?.comments || []).map(comment => (
              <div key={comment.id} className="text-sm">
                <span className="font-bold" style={{ color: comment.userColor }}>{comment.userName}: </span>
                <span className="text-gray-700">{comment.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={addComment} className="p-4 border-t bg-gray-50">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImageView;