import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Plus, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal, currentUser, users } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [description, setDescription] = useState('');

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await addGoal({
      title,
      description,
      targetAmount: target ? Number(target) : undefined,
      currentAmount: 0,
      status: 'pending',
      createdBy: currentUser.id
    });
    setTitle('');
    setTarget('');
    setDescription('');
    setIsAdding(false);
  };

  const handleAccept = async (id: string) => {
    await updateGoal(id, { status: 'accepted' });
  };

  const handleDecline = async (id: string) => {
    await deleteGoal(id);
  };

  return (
    <motion.div 
      className="min-h-screen px-6 pt-12 pb-24 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl text-gradient mb-1">Our Goals</h1>
          <p className="text-neutral-400 text-sm">Dreams we are building</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shadow-white/5",
            isAdding ? "bg-dark-card border border-dark-border rotate-45" : "bg-white text-black"
          )}
        >
          <Plus size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ height: 0, opacity: 0, scale: 0.95 }}
            animate={{ height: "auto", opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            className="overflow-hidden mb-8"
            onSubmit={handleSubmit}
          >
            <div className="glass-panel p-6 rounded-3xl space-y-4 border border-rose-500/20">
              <input
                autoFocus
                placeholder="What's our new goal? (e.g. Paris Trip)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-lg font-serif border-b border-white/10 py-2 outline-none focus:border-rose-400 placeholder:text-neutral-600 text-white"
              />
              <input
                type="number"
                placeholder="Target Amount in FCFA (Optional)"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-rose-400 placeholder:text-neutral-600 text-sm text-white"
              />
              <textarea
                placeholder="Description / Details (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-rose-400 placeholder:text-neutral-600 text-sm text-white min-h-[60px]"
              />
              <button 
                type="submit"
                disabled={!title}
                className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium py-3 rounded-xl disabled:opacity-50 transition-colors shadow-lg shadow-rose-500/20"
              >
                Propose Goal
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {goals.map((goal, i) => {
          const progress = goal.targetAmount 
            ? Math.min(100, Math.round(((goal.currentAmount || 0) / goal.targetAmount) * 100))
            : 0;
            
          const isPending = goal.status === 'pending';
          const isMine = goal.createdBy === currentUser.id;
          const author = users.find(u => u.id === goal.createdBy);

          return (
            <motion.div 
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "glass-panel p-6 md:p-8 rounded-[2rem] border transition-all duration-300",
                isPending ? "border-orange-500/30 bg-orange-500/5 shadow-[0_0_30px_rgba(249,115,22,0.1)]" : "border-white/10"
              )}
            >
              {isPending && (
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium mb-4 text-orange-400 bg-orange-400/10 self-start px-3 py-1.5 rounded-full inline-flex">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  {isMine ? "Waiting for Partner Approval" : `${author?.name || 'Partner'} Proposed a Goal`}
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                    isPending ? "bg-orange-500/20 text-orange-400" : "bg-gradient-to-br from-rose-500/20 to-purple-500/20 text-rose-400"
                  )}>
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-white">{goal.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1">{format(goal.createdAt, 'MMM d, yyyy')}</p>
                  </div>
                </div>
                {goal.targetAmount && (
                  <div className="text-right">
                    <span className="text-sm font-medium text-rose-400 block">{goal.targetAmount.toLocaleString()} FCFA</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Target</span>
                  </div>
                )}
              </div>
              
              {!isPending ? (
                goal.targetAmount ? (
                  <div className="mt-6 bg-dark-bg/50 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between text-xs text-neutral-400 mb-3 font-medium">
                      <span className="text-white">{(goal.currentAmount || 0).toLocaleString()} FCFA raised</span>
                      <span className="text-rose-400">{progress}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-dark-bg rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-rose-500 to-orange-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex">
                     <div className="px-4 py-2 rounded-xl bg-dark-bg/80 border border-white/5 text-neutral-400 text-xs uppercase tracking-wider font-medium">
                       Ongoing dream
                     </div>
                  </div>
                )
              ) : (
                !isMine && (
                  <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                    <button 
                      onClick={() => handleAccept(goal.id)}
                      className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rose-500/20"
                    >
                      <Check size={18} /> Accept
                    </button>
                    <button 
                      onClick={() => handleDecline(goal.id)}
                      className="px-6 bg-white/5 hover:bg-white/10 text-neutral-300 font-medium py-3 rounded-xl border border-white/10 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                )
              )}
            </motion.div>
          );
        })}
        {goals.length === 0 && !isAdding && (
          <div className="glass-panel p-12 text-center text-neutral-500 mt-12 text-lg font-serif italic rounded-[2rem] border-dashed border-white/20">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
            What's our next big adventure?
          </div>
        )}
      </div>
    </motion.div>
  );
}
