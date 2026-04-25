import { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Star, ArrowLeft } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router';
import { cn } from '../lib/utils';

export function Birthday() {
  const { birthdayUnlocked, currentUser } = useAppContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  if (!birthdayUnlocked) {
    return <Navigate to="/more" replace />;
  }

  const reasons = [
    "The way your eyes light up when you smile",
    "How you make every day feel like an adventure",
    "Your incredibly kind heart",
    "The simple moments just lying next to you"
  ];

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-dark-bg text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div className="absolute top-6 left-6 z-50">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-900/40 via-dark-bg to-dark-bg pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            key="intro"
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5 }}
          >
            <Sparkles className="text-rose-300 mb-6 mx-auto animate-pulse" size={32} />
            <h1 className="font-serif text-5xl italic font-light leading-tight mb-6">
              This is just <br /> for you.
            </h1>
            <button 
              onClick={() => setStep(1)}
              className="mt-8 px-8 py-3 rounded-full border border-rose-300/30 text-rose-300 hover:bg-rose-300 hover:text-dark-bg transition-colors tracking-widest text-xs uppercase"
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div 
            key="hero"
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-xs uppercase tracking-widest text-rose-300 mb-4">Happy Birthday</h2>
            <h1 className="font-serif text-6xl mb-6 text-gradient">
              My Love, <br />
              {currentUser?.name === 'Mervi' ? 'Emma' : 'Mervi'}
            </h1>
            <p className="text-neutral-300 max-w-sm mx-auto leading-relaxed mb-12">
              Every day with you is a gift. I wanted to make something special to capture just a fraction of how much you mean to me.
            </p>
            <button 
              onClick={() => setStep(2)}
              className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.4)] animate-bounce"
            >
              <Heart size={24} fill="currentColor" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="reasons"
            className="absolute inset-0 flex flex-col p-8 pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-3xl mb-12 text-center">Reasons I Love You</h2>
            <div className="space-y-4">
              {reasons.map((r, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.4 }}
                  className="glass-panel p-6 rounded-2xl flex gap-4 items-center"
                >
                  <Star className="text-rose-400 shrink-0" size={20} />
                  <p className="text-lg font-serif italic text-white/90">{r}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              onClick={() => setStep(3)}
              className="mt-auto mx-auto px-8 py-3 bg-white text-black rounded-full font-medium"
            >
              One more thing
            </motion.button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="finale"
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-8"
            >
              <Heart size={80} className="text-rose-500" fill="currentColor" />
            </motion.div>
            <h2 className="font-serif text-4xl mb-6">Here's to us.</h2>
            <p className="text-xl text-neutral-300 italic max-w-sm mb-12 leading-relaxed">
              Happy Birthday, my forever person.<br />I love you more than words can say.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-neutral-500 uppercase tracking-widest text-xs hover:text-white transition-colors"
            >
              Return Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
