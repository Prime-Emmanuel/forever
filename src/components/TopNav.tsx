import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from "react-router";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Menu, X, Smile, MapPin, Activity } from "lucide-react";
import { useAppContext } from '../store/AppContext';

const MOODS = ['Happy', 'Loved', 'Stressed', 'Tired', 'Excited', 'Relaxed'];
const POSITIONS = ['Home', 'At Work', 'On Site', 'With Friends', 'Meeting', 'Family'];

export function TopNav() {
  const location = useLocation();
  const { currentUser, updateProfile } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Don't show nav on splash or login pages
  if (['/', '/login'].includes(location.pathname)) return null;

  const links = [
    { name: "Home", path: "/home" },
    { name: "Our Goals", path: "/goals" },
    { name: "Timeline", path: "/meetings" },
    { name: "Savings", path: "/budget" },
    { name: "Memories", path: "/notes" }
  ];

  return (
    <>
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 transition-all duration-300">
        <div className="bg-dark-bg/40 backdrop-blur-3xl rounded-full border-[1.5px] border-white/60 shadow-[0_8px_32px_rgba(255,255,255,0.15)] px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <Link to="/home" className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Heart className="text-white fill-white animate-pulse w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="font-serif text-xl md:text-2xl font-bold tracking-wide text-white">
              Forever<span className="text-rose-400">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 relative" ref={dropdownRef}>
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300",
                    isActive ? "text-white" : "text-neutral-400 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill-top"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
            
            {currentUser && (
              <div className="ml-4 pl-4 border-l border-white/10 flex items-center gap-3 relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-rose-500 p-[2px] transition-transform hover:scale-105 shadow-lg shadow-rose-500/20"
                >
                  <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center font-serif text-sm">
                    {currentUser.name.charAt(0)}
                  </div>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                      className="absolute top-14 right-0 w-80 glass-panel bg-dark-card/95 backdrop-blur-3xl border border-white/20 p-6 rounded-[2rem] shadow-2xl z-50 flex flex-col gap-6"
                    >
                      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-rose-500 p-[2px]">
                          <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center font-serif text-lg">
                            {currentUser.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-white">{currentUser.name}</p>
                          <Link to="/profile" onClick={() => setProfileDropdownOpen(false)} className="text-xs text-rose-400 hover:text-rose-300">View Full Profile</Link>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 font-medium ml-1">
                          <Smile size={14} className="text-rose-400" /> Mood
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {MOODS.map(mood => (
                            <button
                              key={mood}
                              onClick={() => updateProfile({ mood })}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex-grow text-center",
                                currentUser.mood === mood 
                                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-105" 
                                  : "bg-white/5 text-neutral-300 hover:bg-white/10"
                              )}
                            >
                              {mood}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 font-medium ml-1">
                          <MapPin size={14} className="text-orange-400" /> Position
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {POSITIONS.map(pos => (
                            <button
                              key={pos}
                              onClick={() => updateProfile({ position: pos })}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex-grow text-center",
                                currentUser.position === pos 
                                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-105" 
                                  : "bg-white/5 text-neutral-300 hover:bg-white/10"
                              )}
                            >
                              {pos}
                            </button>
                          ))}
                        </div>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-dark-bg/95 backdrop-blur-3xl pt-24 px-6 pb-20 md:hidden overflow-y-auto hide-scrollbar"
          >
            <div className="flex flex-col gap-4">
              {/* Profile Overview Mobile */}
              {currentUser && (
                <div className="glass-panel p-6 rounded-[2rem] border border-white/10 mb-2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-rose-500 p-[2px]">
                      <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center font-serif text-lg">
                        {currentUser.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-white">{currentUser.name}</p>
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-xs text-rose-400">View Full Profile</Link>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-3 flex items-center gap-2">
                        <Smile size={14} className="text-rose-400" /> Mood
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {MOODS.map(mood => (
                          <button
                            key={mood}
                            onClick={() => updateProfile({ mood })}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-[10px] font-medium transition-all duration-300",
                              currentUser.mood === mood 
                                ? "bg-rose-500 text-white" 
                                : "bg-white/5 text-neutral-300"
                            )}
                          >
                            {mood}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-3 flex items-center gap-2">
                        <MapPin size={14} className="text-orange-400" /> Position
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {POSITIONS.map(pos => (
                          <button
                            key={pos}
                            onClick={() => updateProfile({ position: pos })}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-[10px] font-medium transition-all duration-300",
                              currentUser.position === pos 
                                ? "bg-orange-500 text-white" 
                                : "bg-white/5 text-neutral-300"
                            )}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {links.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={link.name}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-6 py-4 rounded-2xl text-xl font-serif transition-colors",
                        isActive ? "bg-rose-500/20 text-rose-300 border border-rose-500/20" : "text-neutral-300 glass-panel"
                      )}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
