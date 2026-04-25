import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppContext } from '../store/AppContext';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export function Splash() {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentUser) {
        navigate('/home');
      } else {
        navigate('/login');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate, currentUser]);

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-900/40 via-transparent to-transparent opacity-70" />
      
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="relative z-10 text-center flex flex-col items-center justify-center"
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center shadow-[0_0_50px_rgba(244,63,94,0.6)] mb-8"
        >
          <Heart className="text-white fill-white" size={32} />
        </motion.div>
        
        <h1 className="font-serif text-6xl md:text-8xl text-white font-bold tracking-wide mb-4">
          Forever<span className="text-rose-500">.</span>
        </h1>
        <p className="text-xl md:text-2xl text-rose-200 font-light tracking-widest font-serif italic">
          Emma & Mervi
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-16 text-xs tracking-[0.3em] uppercase text-neutral-400"
      >
        A Private Universe
      </motion.div>
    </motion.div>
  );
}
