import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, WalletCards } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export function Budget() {
  const { contributions, addContribution, currentUser, users } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const total = contributions.reduce((sum, c) => sum + c.amount, 0);

  const getPersonTotal = (personId: string) => 
    contributions.filter(c => c.personId === personId).reduce((sum, c) => sum + c.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !currentUser) return;
    addContribution({
      amount: Number(amount),
      note,
      personId: currentUser.id
    });
    setAmount('');
    setNote('');
    setIsAdding(false);
  };

  return (
    <motion.div 
      className="min-h-screen px-6 pt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl text-gradient mb-1">Our Savings</h1>
          <p className="text-neutral-400 text-sm">Building our future</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
            isAdding ? "bg-dark-card border border-dark-border rotate-45" : "bg-white text-black"
          )}
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="glass-panel p-8 rounded-3xl mb-8 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <WalletCards size={120} />
        </div>
        <span className="text-neutral-400 uppercase tracking-widest text-xs mb-2">Total Balance</span>
        <span className="text-5xl font-light font-serif mb-8 text-white">
          {total.toLocaleString()} FCFA
        </span>
        
        <div className="w-full grid grid-cols-2 gap-4 relative z-10">
          {users.map(user => (
            <div key={user.id} className="text-center p-4 rounded-2xl bg-dark-bg/50 border border-white/5">
              <span className="block font-medium text-sm text-neutral-300 mb-1">{user.name}</span>
              <span className="text-lg font-serif text-rose-300">{getPersonTotal(user.id).toLocaleString()} FCFA</span>
            </div>
          ))}
        </div>
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
            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <input
                autoFocus
                type="number"
                placeholder="Amount (FCFA)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-2xl font-serif border-b border-dark-border py-2 outline-none focus:border-rose-400 placeholder:text-neutral-600"
              />
              <input
                type="text"
                placeholder="What was this for? (Optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-transparent border-b border-dark-border py-2 outline-none focus:border-rose-400 placeholder:text-neutral-600 text-sm"
              />
              <button 
                type="submit"
                disabled={!amount}
                className="w-full bg-rose-400 text-dark-bg font-medium py-3 rounded-xl disabled:opacity-50"
              >
                Add to Savings
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-4 px-2">History</h3>
        {contributions.map((contribution, i) => {
          const person = users.find(u => u.id === contribution.personId);
          return (
            <motion.div 
              key={contribution.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 glass-panel rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-dark-bg flex items-center justify-center font-serif text-sm border border-dark-border">
                  {person?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-medium text-sm text-neutral-200">{contribution.note || 'Savings'}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wide">
                    {format(new Date(contribution.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <span className="font-serif text-lg text-rose-300">+{contribution.amount.toLocaleString()} FCFA</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
