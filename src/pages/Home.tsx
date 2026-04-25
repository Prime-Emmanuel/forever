import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { motion } from 'motion/react';
import { Heart, Compass, WalletCards, ArrowRight, Sparkles, Image as ImageIcon, Star, Clock, CalendarDays } from 'lucide-react';
import { Link } from 'react-router';
import { format, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { PartnerStatusCard } from '../components/PartnerStatusCard';

export function Home() {
  const { currentUser, goals, notes, contributions, users } = useAppContext();
  
  const partner = users.find(u => u.id !== currentUser?.id);
  const totalSavings = contributions.reduce((acc, c) => acc + c.amount, 0);

  // Time Together (Up Counter)
  const startDate = new Date('2025-10-20T00:00:00');
  const [timeTogether, setTimeTogether] = useState({ years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Anniversary Countdown
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Daily Question / Quote generator based on day of year
  const startOfYear = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date().getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  const DAILY_SPARKS = [
    "What is your favorite memory of us from this past month?",
    "When did you first realize you were falling for me?",
    "What's one thing I do that always makes you smile without fail?",
    "If we could go anywhere right now, where would it be and why?",
    "What song reminds you of us and why?",
    "What's your favorite physical feature of mine?",
    "Describe our perfect lazy Sunday together.",
  ];
  
  const todaysSpark = DAILY_SPARKS[dayOfYear % DAILY_SPARKS.length];

  useEffect(() => {
    const update = () => {
      const now = new Date();
      
      // Update Time Together
      let totalMonths = differenceInMonths(now, startDate);
      let years = Math.floor(totalMonths / 12);
      let months = totalMonths % 12;
      
      let dateAfterMonths = new Date(startDate);
      dateAfterMonths.setFullYear(dateAfterMonths.getFullYear() + years);
      dateAfterMonths.setMonth(dateAfterMonths.getMonth() + months);
      
      let totalDays = differenceInDays(now, dateAfterMonths);
      let weeks = Math.floor(totalDays / 7);
      let days = totalDays % 7;
      
      let dateAfterDays = new Date(dateAfterMonths);
      dateAfterDays.setDate(dateAfterDays.getDate() + totalDays);
      
      let hours = differenceInHours(now, dateAfterDays);
      
      let dateAfterHours = new Date(dateAfterDays);
      dateAfterHours.setHours(dateAfterHours.getHours() + hours);
      
      let minutes = differenceInMinutes(now, dateAfterHours);
      
      let dateAfterMinutes = new Date(dateAfterHours);
      dateAfterMinutes.setMinutes(dateAfterMinutes.getMinutes() + minutes);
      
      let seconds = differenceInSeconds(now, dateAfterMinutes);

      setTimeTogether({ years, months, weeks, days, hours, minutes, seconds });

      // Update Anniversary Countdown
      let nextAnniv = new Date(now.getFullYear(), 11, 20); // Month is 0-indexed, so 11 = December
      if (now.getTime() > nextAnniv.getTime()) {
        nextAnniv.setFullYear(nextAnniv.getFullYear() + 1);
      }
      const cDiff = nextAnniv.getTime() - now.getTime();
      setCountdown({
        days: Math.floor(cDiff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((cDiff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((cDiff / 1000 / 60) % 60),
        seconds: Math.floor((cDiff / 1000) % 60)
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-rose-500/10 rounded-full animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />
        
        <motion.div 
          initial="hidden" animate="show" variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles size={16} className="text-orange-400" />
            <span className="text-sm uppercase tracking-widest text-neutral-300 font-medium whitespace-nowrap">
              Welcome to our universe
            </span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="font-serif text-5xl md:text-8xl lg:text-9xl mb-6 md:mb-8 leading-[1.1] tracking-tight">
            Building Our <br />
            <span className="text-gradient font-bold italic animate-[pulse_2s_ease-in-out_infinite] inline-block hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(251,113,133,0.5)]">Forever</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-neutral-300 text-base md:text-2xl font-light max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed">
            Welcome home, <span className="font-medium text-white">{currentUser?.name}</span>. This is your personal sanctuary with <span className="font-medium text-white">{partner?.name}</span> to dream big, save together, and never forget a single moment.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="#the-vision" 
              className="w-full sm:w-auto px-10 py-5 rounded-full bg-white text-black text-lg font-medium hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3"
            >
              Explore Our Life <ArrowRight size={20} />
            </a>
            <Link 
              to="/notes" 
              className="w-full sm:w-auto px-10 py-5 rounded-full border border-white/20 glass-panel text-white text-lg font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
            >
              Leave a Memory <Heart size={20} className="text-rose-400" />
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-neutral-500"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* PARTNER STATUS CARD (NEW) */}
      {partner && (
        <div className="max-w-md mx-auto px-6 -mt-10 relative z-20">
          <PartnerStatusCard partner={partner} />
        </div>
      )}

      {/* NEW SECTION: TIMELINE & COUNTER */}
      <section className="py-12 md:py-20 px-6 max-w-7xl mx-auto relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-dark-card border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none" />
            <div className="flex items-center gap-3 text-rose-400 mb-6">
              <Clock size={24} />
              <span className="uppercase tracking-widest text-sm font-medium">Time Together</span>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 mb-6">
              {timeTogether.years > 0 && (
                <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-3xl md:text-5xl font-serif font-bold text-white mb-1">{timeTogether.years}</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-400">Years</span>
                </div>
              )}
              {timeTogether.months > 0 && (
                <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-3xl md:text-5xl font-serif font-bold text-white mb-1">{timeTogether.months}</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-400">Months</span>
                </div>
              )}
              <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-3xl md:text-5xl font-serif font-bold text-white mb-1">{timeTogether.weeks}</span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-400">Weeks</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-3xl md:text-5xl font-serif font-bold text-white mb-1">{timeTogether.days}</span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-400">Days</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl md:text-4xl font-serif font-bold text-white mb-1">{timeTogether.hours}</span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-400">Hours</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl md:text-4xl font-serif font-bold text-white mb-1">{timeTogether.minutes}</span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-400">Mins</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl md:text-4xl font-serif font-bold text-rose-400 mb-1">{timeTogether.seconds}</span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-400">Secs</span>
              </div>
            </div>

            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Every ticking second spent building, laughing, and growing is another page in our beautiful story.
            </p>
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(251,146,60,0.15)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none" />
            <div className="flex items-center gap-3 text-orange-400 mb-6">
              <CalendarDays size={24} />
              <span className="uppercase tracking-widest text-sm font-medium">Up Next</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif text-white mb-2">Our Anniversary</h3>
            <p className="text-neutral-300 mb-6 text-sm">December 20th</p>
            
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl md:text-3xl font-serif font-bold text-white mb-1">{countdown.days}</span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">Days</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl md:text-3xl font-serif font-bold text-white mb-1">{countdown.hours}</span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">Hours</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl md:text-3xl font-serif font-bold text-white mb-1">{countdown.minutes}</span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">Mins</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                <span className="text-2xl md:text-3xl font-serif font-bold text-orange-400 mb-1">{countdown.seconds}</span>
                <span className="text-[10px] uppercase tracking-widest text-orange-400/70">Secs</span>
              </div>
            </div>

            <div className="inline-flex items-center self-start gap-2 px-5 py-2.5 rounded-full border border-white/20 glass-panel text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer text-white">
              Mark Calendar
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW CARDS (The Vision) */}
      <section id="the-vision" className="pt-16 md:pt-24 pb-16 md:pb-24 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16 text-center"
        >
          <h2 className="font-serif text-4xl md:text-6xl mb-4 md:mb-6">Our Progress</h2>
          <p className="text-neutral-400 text-base md:text-xl font-light max-w-2xl mx-auto">A quick glance at everything we're building and sharing together.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Savings Tile */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 glass-panel p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group border-orange-500/20 hover:border-orange-500/40 transition-colors"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 md:w-64 md:h-64 bg-[radial-gradient(circle,rgba(251,146,60,0.2)_0%,rgba(0,0,0,0)_70%)] group-hover:bg-[radial-gradient(circle,rgba(251,146,60,0.3)_0%,rgba(0,0,0,0)_70%)] rounded-full transition-colors" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start mb-8 md:mb-12">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                  <WalletCards size={24} className="md:w-8 md:h-8" />
                </div>
                <Link to="/budget" className="px-4 py-2 md:px-5 md:py-2 rounded-full border border-white/20 text-xs md:text-sm font-medium hover:bg-white/10 transition-colors text-white">
                  Manage Savings
                </Link>
              </div>
              <div>
                <p className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 font-medium mb-2 md:mb-3">Total Combined Savings</p>
                <p className="text-4xl md:text-7xl font-sans font-bold text-white tracking-tight">
                  {totalSavings.toLocaleString()} <span className="text-xl md:text-2xl text-orange-400 font-medium ml-1 md:ml-2">FCFA</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Tile */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden border-rose-500/20 hover:border-rose-500/40 transition-colors"
          >
             <div className="absolute -bottom-20 -left-20 w-48 h-48 md:w-56 md:h-56 bg-[radial-gradient(circle,rgba(244,63,94,0.2)_0%,rgba(0,0,0,0)_70%)] group-hover:bg-[radial-gradient(circle,rgba(244,63,94,0.3)_0%,rgba(0,0,0,0)_70%)] rounded-full transition-colors" />
             <div className="relative z-10 h-full flex flex-col justify-center text-center">
               <h3 className="font-serif text-5xl md:text-7xl text-white mb-1 md:mb-2">{notes.length}</h3>
               <p className="text-rose-400 font-medium text-sm md:text-lg uppercase tracking-widest mb-6 md:mb-8">Memories Total</p>
               
               <div className="w-full h-[1px] bg-white/10 mb-6 md:mb-8" />
               
               <h3 className="font-serif text-5xl md:text-7xl text-white mb-1 md:mb-2">{goals.length}</h3>
               <p className="text-rose-400 font-medium text-sm md:text-lg uppercase tracking-widest">Active Goals</p>
             </div>
          </motion.div>
        </div>
      </section>

      {/* DAILY CONNECTION SPARK */}
      <section className="py-12 md:py-16 px-6 max-w-4xl mx-auto relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-rose-500/30 text-center relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-dark-bg via-rose-900/10 to-dark-bg"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(244,63,94,0.15)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[radial-gradient(circle,rgba(251,146,60,0.15)_0%,rgba(0,0,0,0)_70%)] rounded-full pointer-events-none" />
          
          <Sparkles className="text-rose-400 mb-6 w-10 h-10 animate-pulse" />
          <p className="text-sm uppercase tracking-widest text-neutral-400 font-medium mb-4">Daily Connection Spark</p>
          <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-white font-medium italic leading-relaxed z-10">"{todaysSpark}"</h3>
        </motion.div>
      </section>

      {/* OUR STORY TIMELINE */}
      <section className="py-16 md:py-24 px-6 max-w-5xl mx-auto relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-6xl mb-4 md:mb-6">Our Story</h2>
          <p className="text-neutral-400 text-base md:text-xl font-light">The beautiful chapters of us.</p>
        </motion.div>

        <div className="relative border-l-2 border-white/10 ml-6 md:mx-auto md:ml-auto space-y-16 py-8">
          {[
            { title: "Regained Contact", date: "August 2025", desc: "Started discussing back and finding our rhythm." },
            { title: "Engaged", date: "October 2025", desc: "Making the ultimate promise to each other." },
            { title: "First Met", date: "December 20, 2025", desc: "The magical moment we finally met in person." },
            { title: "Second Meeting", date: "February 14, 2026", desc: "A beautiful Valentine's Day together." },
            { title: "Next Meeting", date: "May 15, 2026", desc: "Counting down the days." },
          ].map((milestone, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className={`relative flex flex-col md:flex-row gap-6 md:gap-12 md:items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="absolute -left-[35px] md:static md:left-auto md:-translate-x-0 w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center p-1 border-4 border-dark-bg z-10 flex-shrink-0 md:mx-auto md:w-10 md:h-10">
                <Heart className="text-white fill-white w-4 h-4" />
              </div>
              <div className={`pl-6 md:pl-0 glass-panel p-6 rounded-3xl w-full md:w-[calc(50%-3rem)] ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                <span className="text-orange-400 text-sm font-medium uppercase tracking-widest">{milestone.date}</span>
                <h3 className="font-serif text-2xl text-white mt-2 mb-3">{milestone.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{milestone.desc}</p>
              </div>
            </motion.div>
          ))}
          {/* Vertical line container style for desktop */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-rose-500/50 via-white/10 to-transparent" />
        </div>
      </section>

      {/* NEW SECTION: OUR PROMISES */}
      <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-2 rounded-full border border-rose-500/20 text-rose-300 bg-rose-500/10 mb-4 md:mb-6">
            <Heart size={14} className="fill-rose-300" />
            <span className="text-[10px] md:text-xs uppercase tracking-widest font-medium">The Foundation</span>
          </div>
          <h2 className="font-serif text-4xl md:text-6xl mb-4 md:mb-6">Our Rules</h2>
          <p className="text-neutral-400 text-base md:text-xl font-light max-w-2xl mx-auto">The rules we live by to keep our bond unbreakable.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { title: "Communicate", text: "Always talk it out, even when it's hard." },
            { title: "Dream Big", text: "Support each other's wildest ambitions." },
            { title: "Forgive", text: "Never go to sleep angry. Choose grace." },
            { title: "Celebrate", text: "Enjoy the little wins and everyday moments." }
          ].map((promise, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="glass-panel p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-center hover:-translate-y-2 transition-transform duration-300 border-t border-white/20"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 md:mb-6 text-white font-serif italic text-lg md:text-xl">
                0{index + 1}
              </div>
              <h3 className="text-lg md:text-xl font-medium text-white mb-2 md:mb-3 tracking-wide">{promise.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{promise.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HORIZONTAL GOALS SHOWCASE */}
      <section className="py-12 md:py-16 bg-white/[0.02] border-y border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-transparent to-dark-bg pointer-events-none z-10" />
        <div className="max-w-7xl mx-auto px-6 mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-20">
          <motion.div>
            <h2 className="font-serif text-4xl md:text-6xl mb-2 md:mb-4">Our Dreams</h2>
            <p className="text-neutral-400 text-base md:text-lg">Every step forward is a step together.</p>
          </motion.div>
          <Link to="/goals" className="px-6 py-3 md:px-8 md:py-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium transition-colors inline-flex items-center gap-2 self-start md:self-auto text-sm md:text-base">
            View All Dreams <Compass size={18} className="md:w-5 md:h-5" />
          </Link>
        </div>

        <div className="w-full overflow-x-auto hide-scrollbar px-6 pb-8 md:pb-12">
          <div className="flex gap-6 w-max max-w-7xl mx-auto">
            {goals.filter(g => g.status === 'accepted' || !g.status).length === 0 ? (
              <div className="w-full min-w-[300px] md:min-w-[600px] p-16 rounded-[2.5rem] border border-dashed border-white/20 flex flex-col items-center justify-center text-center">
                <Compass className="text-neutral-600 mb-6" size={48} />
                <p className="text-2xl font-serif text-neutral-400 mb-2">No goals set for now.</p>
                <p className="text-neutral-500">Click 'View All Dreams' to start proposing goals.</p>
              </div>
            ) : (
              goals.filter(g => g.status === 'accepted' || !g.status).map((goal, i) => {
                const progress = goal.targetAmount 
                  ? Math.min(100, Math.round(((goal.currentAmount || 0) / goal.targetAmount) * 100))
                  : 0;

                return (
                  <motion.div 
                    key={goal.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="w-[85vw] md:w-[500px] glass-panel p-8 md:p-10 rounded-[2.5rem] flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white mb-6 backdrop-blur-md">
                        <Star size={24} />
                      </div>
                      <h3 className="font-serif text-3xl md:text-4xl text-white mb-3 tracking-wide truncate">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-6 line-clamp-3">{goal.description}</p>
                      )}
                      {goal.targetAmount && (
                        <p className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 text-orange-400 font-medium text-sm border border-orange-500/20 mb-8 mt-2">
                          🎯 {goal.targetAmount.toLocaleString()} FCFA Goal
                        </p>
                      )}
                    </div>
                    
                    {goal.targetAmount ? (
                      <div className="mt-auto pt-8 border-t border-white/5">
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Current Progress</p>
                            <p className="text-xl text-white font-medium">{(goal.currentAmount || 0).toLocaleString()} <span className="text-sm text-neutral-500">FCFA</span></p>
                          </div>
                          <span className="text-rose-400 font-serif text-2xl">{progress}%</span>
                        </div>
                        <div className="h-3 w-full bg-dark-bg rounded-full overflow-hidden border border-white/10 p-[2px]">
                          <div 
                            className="h-full bg-gradient-to-r from-rose-500 via-orange-500 to-rose-400 rounded-full relative"
                            style={{ width: `${progress}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-neutral-400">
                        <span className="uppercase tracking-widest text-xs font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-neutral-300">
                          Ongoing Pursuit
                        </span>
                        <Compass className="w-5 h-5 opacity-50" />
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* LATEST MEMORIES GALLERY */}
      <section className="py-12 md:py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-serif text-4xl md:text-6xl mb-4 text-white">Recent Notes</h2>
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto">Words that mean the world, securely kept forever.</p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {notes.slice(0, 6).map((note, i) => {
            const author = users.find(u => u.id === note.authorId);
            return (
              <motion.div 
                key={note.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1, duration: 0.6 }}
                className="break-inside-avoid glass-panel p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] hover:bg-white/5 transition-colors border-t border-white/20"
              >
                <Heart size={20} className="text-rose-500 mb-4 md:mb-6 opacity-50" />
                <p className="text-base md:text-xl text-white/90 leading-relaxed font-serif italic mb-6 md:mb-8">
                  "{note.content}"
                </p>
                <div className="flex items-center gap-4 pt-4 md:pt-6 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-dark-bg font-bold font-serif shadow-lg">
                    {author?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-white">{author?.name || 'Unknown'}</p>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">{format(new Date(note.createdAt), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
        
        {notes.length === 0 && (
          <div className="text-center p-12">
            <ImageIcon size={48} className="mx-auto text-neutral-600 mb-6" />
            <p className="text-2xl font-serif text-neutral-500">The wall is blank. Write the first chapter.</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Link to="/notes" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-colors">
            Open Journal <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 text-center border-t border-white/10 bg-black/20">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center">
            <Heart className="text-white fill-white" size={24} />
          </div>
          <h3 className="font-serif text-3xl font-bold tracking-widest text-white mt-4">Forever.</h3>
          <p className="text-neutral-500 uppercase tracking-widest text-sm mt-4">Emma & Mervi's Private Space</p>
          <p className="text-xs text-neutral-600 mt-2">Crafted with love.</p>
        </div>
      </footer>
    </div>
  );
}
