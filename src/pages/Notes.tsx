import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { HeartHandshake, Send } from 'lucide-react';

export function Notes() {
  const { notes, addNote, currentUser, users } = useAppContext();
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;
    addNote({
      content,
      authorId: currentUser.id
    });
    setContent('');
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col pt-12 pb-6 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6 shrink-0">
        <h1 className="font-serif text-4xl text-gradient mb-1">Memories</h1>
        <p className="text-neutral-400 text-sm">Little moments, big love</p>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6 pb-24 flex flex-col-reverse">
        {notes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-500">
            <HeartHandshake size={48} className="mb-4 opacity-20" />
            <p className="font-serif italic">This space is waiting for your sweet words.</p>
          </div>
        ) : (
          notes.map((note, i) => {
            const author = users.find(u => u.id === note.authorId);
            const isMe = author?.id === currentUser?.id;

            return (
              <motion.div 
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1 px-2">
                  <span className="text-[10px] uppercase tracking-wide text-neutral-500">
                    {author?.name} • {format(new Date(note.createdAt), 'h:mm a')}
                  </span>
                </div>
                <div className={`p-4 max-w-[85%] ${
                  isMe 
                    ? 'bg-rose-400 text-dark-bg rounded-2xl rounded-tr-sm' 
                    : 'glass-panel text-white rounded-2xl rounded-tl-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="fixed bottom-24 left-6 right-6 shrink-0 z-40 bg-dark-bg/80 backdrop-blur-lg pt-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            placeholder="Write something sweet..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-full py-4 pl-6 pr-14 outline-none focus:border-rose-400 transition-colors shadow-xl"
          />
          <button 
            type="submit"
            disabled={!content.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-rose-400 text-dark-bg flex items-center justify-center disabled:opacity-50 disabled:bg-neutral-600 disabled:text-neutral-400 transition-all"
          >
            <Send size={16} className="ml-1" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
