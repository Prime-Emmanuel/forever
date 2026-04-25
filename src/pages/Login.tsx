import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppContext } from '../store/AppContext';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';

export function Login() {
  const { loginWithGoogle, currentUser } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const success = await loginWithGoogle();
    if (success) {
      navigate('/home');
    } else {
      setError('Failed to login with Google.');
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col p-6 items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-rose-900/10 via-dark-bg to-dark-bg" />

      <div className="w-full max-w-sm relative z-10 glass-panel p-8 rounded-[2.5rem] flex flex-col items-center">
        <h1 className="font-serif text-5xl mb-3 text-center text-gradient">Welcome</h1>
        <p className="text-neutral-400 text-center text-sm mb-12 font-light">
          Sign in to access your shared space
        </p>

        {error && <p className="text-rose-400 text-sm mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-black font-medium rounded-2xl py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors shadow-xl"
        >
          <LogIn size={18} />
          {loading ? "Signing in..." : "Continue with Google"}
        </button>
      </div>
    </motion.div>
  );
}
