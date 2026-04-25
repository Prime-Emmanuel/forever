import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Target, WalletCards, HeartHandshake, X, Sparkles, Coins, FileText } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { useLocation } from 'react-router';

export function GlobalFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'goal' | 'budget' | 'note' | null>(null);
  const location = useLocation();
  const { addGoal, addContribution, addNote, currentUser } = useAppContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  if (['/', '/login', '/birthday'].includes(location.pathname)) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (activeModal === 'goal') {
      addGoal({ 
        title, 
        description: description || '', 
        targetAmount: amount ? Number(amount) : undefined,
        currentAmount: 0,
        status: 'accepted',
        createdBy: currentUser.id
      });
    } else if (activeModal === 'budget') {
      addContribution({ amount: Number(amount), note: title, personId: currentUser.id });
    } else if (activeModal === 'note') {
      addNote({ content: title, authorId: currentUser.id });
    }
    closeModal();
  };

  const closeModal = () => {
    setActiveModal(null);
    setTitle('');
    setDescription('');
    setAmount('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[60] flex flex-col items-center gap-3 md:gap-4">
        <AnimatePresence>
          {isOpen && !activeModal && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="flex flex-col gap-2 md:gap-3 mb-2"
            >
              <button 
                onClick={() => setActiveModal('note')}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform group relative"
              >
                <span className="absolute right-14 md:right-16 px-2 py-1 md:px-3 md:py-1 bg-black/80 text-white rounded-lg text-[10px] md:text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Add Memory</span>
                <HeartHandshake className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button 
                onClick={() => setActiveModal('budget')}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform group relative"
              >
                <span className="absolute right-14 md:right-16 px-2 py-1 md:px-3 md:py-1 bg-black/80 text-white rounded-lg text-[10px] md:text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Add Savings</span>
                <WalletCards className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button 
                onClick={() => setActiveModal('goal')}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform group relative"
              >
                <span className="absolute right-14 md:right-16 px-2 py-1 md:px-3 md:py-1 bg-black/80 text-white rounded-lg text-[10px] md:text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Add Goal</span>
                <Target className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 z-50 ${isOpen ? 'bg-white text-black rotate-45' : 'bg-gradient-to-r from-rose-500 to-purple-500 text-white hover:scale-105'}`}
        >
          <Plus className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-dark-bg/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md glass-panel bg-dark-card/90 border border-white/20 p-8 rounded-[2.5rem] relative shadow-2xl"
            >
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <h3 className="font-serif text-3xl mb-6 text-white">
                {activeModal === 'goal' && 'New Adventure'}
                {activeModal === 'budget' && 'Add to Savings'}
                {activeModal === 'note' && 'Save a Memory'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeModal === 'note' && (
                  <textarea
                    autoFocus
                    placeholder="Write something sweet..."
                    className="w-full bg-dark-bg/50 text-white border border-white/10 rounded-2xl p-4 min-h-[120px] outline-none focus:border-rose-400 transition-colors"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                )}
                
                {activeModal === 'goal' ? (
                  <div className="space-y-4 relative">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Sparkles className="h-5 w-5 text-rose-400" />
                      </div>
                      <input
                        autoFocus
                        type="text"
                        placeholder="Goal Title (e.g. Dream House)"
                        className="w-full bg-dark-bg/80 text-white border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-rose-400 transition-colors placeholder:text-neutral-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Coins className="h-5 w-5 text-orange-400" />
                      </div>
                      <input
                        type="number"
                        placeholder="Target Amount in FCFA (Optional)"
                        className="w-full bg-dark-bg/80 text-white border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-rose-400 transition-colors placeholder:text-neutral-500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                        <FileText className="h-5 w-5 text-neutral-400" />
                      </div>
                      <textarea
                        placeholder="Goal Description (Optional)"
                        className="w-full bg-dark-bg/80 text-white border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-rose-400 transition-colors min-h-[120px] placeholder:text-neutral-500"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  activeModal !== 'note' && (
                    <input
                      autoFocus
                      type="text"
                      placeholder="What is this for? (Optional)"
                      className="w-full bg-dark-bg/50 text-white border border-white/10 rounded-2xl py-4 px-4 outline-none focus:border-rose-400 transition-colors"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  )
                )}
                
                {activeModal === 'budget' && (
                  <input
                    type="number"
                    placeholder="Amount (FCFA)"
                    className="w-full bg-dark-bg/50 text-white border border-white/10 rounded-2xl py-4 px-4 outline-none focus:border-rose-400 transition-colors"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                )}
                
                <button 
                  type="submit" 
                  disabled={!title && activeModal !== 'budget'}
                  className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white py-4 rounded-xl font-medium shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
                >
                  Save
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
