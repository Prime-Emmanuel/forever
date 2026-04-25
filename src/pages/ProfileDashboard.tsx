import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Gift, Lock, CheckCircle2, User, Heart, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export function ProfileDashboard() {
  const { currentUser, logout, updateProfile, unlockBirthday, users, goals, contributions, notes } = useAppContext();
  const navigate = useNavigate();
  const [showBirthdayLock, setShowBirthdayLock] = useState(false);
  const [bPassword, setBPassword] = useState('');
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [mood, setMood] = useState(currentUser?.mood || '');
  const [position, setPosition] = useState(currentUser?.position || '');

  const partner = users.find(u => u.id !== currentUser?.id);
  const totalSavings = contributions.reduce((acc, c) => acc + c.amount, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBirthdaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockBirthday(bPassword.toLowerCase())) {
      navigate('/birthday');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setBPassword('');
    }
  };

  const saveProfile = () => {
    updateProfile({ bio, mood, position });
    setIsEditing(false);
  };

  return (
    <motion.div 
      className="min-h-screen pt-16 px-6 pb-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-4xl text-gradient">Profile & Dashboard</h1>
        <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/70">
          <Settings size={18} />
        </button>
      </div>

      {/* Profile Header Block */}
      <div className="glass-panel rounded-[2rem] p-6 mb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-rose-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center font-serif text-3xl">
              {currentUser?.name.charAt(0)}
            </div>
          </div>
          <div className="pt-2">
            <h2 className="text-2xl font-serif text-white mb-1">{currentUser?.name}</h2>
            <div className="flex items-center gap-2 text-xs text-rose-300 uppercase tracking-widest">
              <Heart size={12} className="fill-rose-300" />
              <span>Partnered with {partner?.name}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2 text-sm text-neutral-400">
            <span className="uppercase tracking-widest text-[10px]">Your Status</span>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="text-rose-400 hover:text-rose-300 transition-colors">Edit</button>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-3">
              <textarea 
                className="w-full bg-dark-bg/50 border border-white/10 rounded-xl p-3 text-sm resize-none outline-none focus:border-rose-400 text-white"
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write your bio..."
              />
              <input 
                className="w-full bg-dark-bg/50 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-rose-400 text-white"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="Current Mood (e.g. Happy, Sleepy)..."
              />
              <input 
                className="w-full bg-dark-bg/50 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-rose-400 text-white"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Where are you right now? (e.g. At work, In bed)..."
              />
              <button 
                onClick={saveProfile} 
                className="text-xs bg-rose-500 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-rose-400 transition-colors"
              >
                <CheckCircle2 size={14} /> Save
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-neutral-200 italic leading-relaxed">
                {currentUser?.bio ? `"${currentUser.bio}"` : "Add a sweet bio..."}
              </p>
              <div className="flex gap-4">
                <div className="bg-white/5 px-4 py-2 rounded-xl text-xs flex-1">
                  <span className="block text-neutral-500 uppercase tracking-widest mb-1">Mood</span>
                  <span className="text-white">{currentUser?.mood || 'Not set'}</span>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-xl text-xs flex-1">
                  <span className="block text-neutral-500 uppercase tracking-widest mb-1">Location</span>
                  <span className="text-white">{currentUser?.position || 'Not set'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Partner Status Block */}
      {partner && (
        <div className="glass-panel border-rose-500/30 rounded-[2rem] p-6 mb-8 bg-gradient-to-br from-dark-card to-rose-900/10">
          <div className="flex items-center gap-3 mb-4 text-rose-400">
            <Heart size={18} className="fill-rose-400 animate-pulse" />
            <h3 className="uppercase tracking-widest text-xs font-semibold">{partner.name}'s Status</h3>
          </div>
          
          <p className="text-sm text-neutral-200 italic leading-relaxed mb-4">
            {partner.bio ? `"${partner.bio}"` : `${partner.name} hasn't written a bio yet.`}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-bg/50 px-4 py-3 border border-rose-500/20 rounded-xl text-xs">
              <span className="block text-rose-300/60 uppercase tracking-widest mb-1">Mood</span>
              <span className="text-white font-medium">{partner.mood || 'Thinking of you'}</span>
            </div>
            <div className="bg-dark-bg/50 px-4 py-3 border border-rose-500/20 rounded-xl text-xs">
              <span className="block text-rose-300/60 uppercase tracking-widest mb-1">Location</span>
              <span className="text-white font-medium">{partner.position || 'Somewhere wonderful'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <h3 className="font-serif text-2xl mb-4 px-2">Overview</h3>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass-panel p-5 rounded-3xl">
          <p className="text-neutral-400 text-[10px] uppercase tracking-widest mb-1">Goals</p>
          <p className="text-2xl font-serif">{goals.length}</p>
        </div>
        <div className="glass-panel p-5 rounded-3xl">
          <p className="text-neutral-400 text-[10px] uppercase tracking-widest mb-1">Memories</p>
          <p className="text-2xl font-serif">{notes.length}</p>
        </div>
        <div className="col-span-2 glass-panel p-5 rounded-3xl flex justify-between items-center">
          <div>
            <p className="text-neutral-400 text-[10px] uppercase tracking-widest mb-1">Total Contributions</p>
            <p className="text-3xl font-serif text-rose-300">{totalSavings.toLocaleString()} FCFA</p>
          </div>
          <div className="w-12 h-12 rounded-full border border-white/10 flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500">You</span>
            <span className="text-sm font-bold text-white">
              {contributions.filter(c => c.personId === currentUser?.id).reduce((sum, c) => sum + c.amount, 0).toLocaleString()} FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Secret / Settings Sections */}
      <div className="space-y-4">
        {/* Birthday Locked Card */}
        <button 
          onClick={() => setShowBirthdayLock(true)}
          className="w-full relative overflow-hidden rounded-3xl aspect-[2.5/1] text-left group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 mix-blend-overlay" />
          <div className="relative z-10 p-6 h-full flex flex-col justify-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                <Gift size={24} />
              </div>
              <div>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1">Locked Area</p>
                <h3 className="text-white font-serif text-2xl">A Special Surprise ✨</h3>
              </div>
            </div>
          </div>
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-5 glass-panel rounded-3xl text-red-400 hover:bg-red-400/10 transition-colors group"
        >
          <span className="font-medium text-sm">Sign Out securely</span>
          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20">
            <LogOut size={16} />
          </div>
        </button>
      </div>

      {/* Birthday Password Modal */}
      <AnimatePresence>
        {showBirthdayLock && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark-bg/80 backdrop-blur-xl"
          >
           <motion.div 
             initial={{ scale: 0.9, opacity: 0, y: 20 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             exit={{ scale: 0.9, opacity: 0, y: 20 }}
             className="w-full max-w-sm glass-panel bg-dark-card/90 border border-white/10 p-8 rounded-[2.5rem] text-center relative shadow-2xl"
           >
             <button 
               onClick={() => setShowBirthdayLock(false)}
               className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors"
             >
               ✕
             </button>
             <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 mx-auto flex items-center justify-center mb-6 text-rose-400">
               <Lock size={24} />
             </div>
             <h3 className="font-serif text-3xl mb-2 text-white">Secret Code</h3>
             <p className="text-sm text-neutral-400 mb-8 font-light">Enter the magic word to enter the private gallery.</p>
             <form onSubmit={handleBirthdaySubmit}>
               <input
                 autoFocus
                 type="password"
                 placeholder="Password..."
                 className={cn(
                   "w-full bg-dark-bg/50 text-white border rounded-2xl py-4 px-4 text-center mb-6 transition-colors outline-none",
                   error ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-rose-400"
                 )}
                 value={bPassword}
                 onChange={(e) => {
                   setBPassword(e.target.value);
                   setError(false);
                 }}
               />
               <button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white py-4 rounded-xl font-medium shadow-lg hover:opacity-90 transition-opacity">
                 Unlock Surprises
               </button>
             </form>
           </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
