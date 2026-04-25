import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, X, Send } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

const GIFT_ITEMS = [
  { id: 'coffee', icon: '☕', name: 'Virtual Coffee' },
  { id: 'hug', icon: '🫂', name: 'Big Hug' },
  { id: 'rose', icon: '🌹', name: 'A Rose' },
  { id: 'kiss', icon: '💋', name: 'Kisses' },
  { id: 'cake', icon: '🍰', name: 'Sweet Cake' },
  { id: 'wine', icon: '🍷', name: 'Red Wine' },
  { id: 'chocolates', icon: '🍫', name: 'Chocolates' },
  { id: 'tickets', icon: '🎟️', name: 'Movie Tickets' },
  { id: 'ring', icon: '💍', name: 'A Ring' },
  { id: 'teddy', icon: '🧸', name: 'Teddy Bear' },
];

export function GlobalGifts() {
  const { gifts, currentUser, users, addGift, markGiftAsRead } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'received' | 'send'>('received');
  
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [message, setMessage] = useState('');

  if (!currentUser) return null;

  const partner = users.find(u => u.id !== currentUser.id);
  const receivedGifts = gifts.filter(g => g.receiverId === currentUser.id);
  const unreadCount = receivedGifts.filter(g => !g.isRead).length;

  const handleSend = async () => {
    if (!selectedItem || !message.trim() || !partner) return;
    await addGift({
      senderId: currentUser.id,
      receiverId: partner.id,
      itemId: selectedItem,
      message: message.trim(),
      isRead: false
    });
    setSelectedItem('');
    setMessage('');
    setActiveTab('received');
  };

  const openGifts = () => {
    setIsOpen(true);
    receivedGifts.filter(g => !g.isRead).forEach(g => {
      markGiftAsRead(g.id);
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={openGifts}
        className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30 hover:scale-105 transition-transform"
      >
        <Gift className="w-6 h-6 md:w-8 md:h-8 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-dark-bg animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Gifts Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-dark-card border border-white/10 w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="font-serif text-2xl text-white">Gift Box 🎁</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="flex border-b border-white/10">
                <button 
                  onClick={() => setActiveTab('received')}
                  className={cn("flex-1 py-4 text-sm font-medium transition-colors", activeTab === 'received' ? "bg-white/10 text-rose-400" : "text-neutral-400 hover:text-white")}
                >
                  Received Gifts
                </button>
                <button 
                  onClick={() => setActiveTab('send')}
                  className={cn("flex-1 py-4 text-sm font-medium transition-colors", activeTab === 'send' ? "bg-white/10 text-rose-400" : "text-neutral-400 hover:text-white")}
                >
                  Send a Gift
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                {activeTab === 'received' ? (
                  <div className="space-y-4">
                    {receivedGifts.length === 0 ? (
                      <div className="text-center py-10 text-neutral-400">
                        <Gift className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No gifts yet. Tell {partner?.name || 'your partner'} to send you something sweet!</p>
                      </div>
                    ) : (
                      receivedGifts.map(gift => {
                        const itemInfo = GIFT_ITEMS.find(i => i.id === gift.itemId);
                        return (
                          <div key={gift.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex flex-col items-center justify-center flex-shrink-0">
                              <span className="text-3xl">{itemInfo?.icon || '🎁'}</span>
                            </div>
                            <div>
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="text-white font-medium">{itemInfo?.name || 'A Gift'}</h3>
                                <span className="text-xs text-neutral-500">{format(gift.createdAt, 'MMM d')}</span>
                              </div>
                              <p className="text-sm text-neutral-300 italic">"{gift.message}"</p>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-neutral-400 mb-3">Choose an item</p>
                      <div className="flex flex-wrap gap-3">
                        {GIFT_ITEMS.map(item => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedItem(item.id)}
                            className={cn(
                              "px-4 py-3 rounded-xl border transition-all flex flex-col items-center gap-1 min-w-[80px]",
                              selectedItem === item.id 
                                ? "bg-rose-500/20 border-rose-500 text-rose-300" 
                                : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10"
                            )}
                          >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-xs">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 mb-3">Add a sweet note</p>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="I'm thinking of you..."
                        className="w-full bg-dark-bg/50 border border-white/10 rounded-2xl p-4 text-white placeholder-neutral-500 outline-none focus:border-rose-400 resize-none h-24"
                      />
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!selectedItem || !message.trim()}
                      className="w-full bg-rose-500 text-white rounded-xl py-4 font-medium flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} /> Send to {partner?.name || 'Partner'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
