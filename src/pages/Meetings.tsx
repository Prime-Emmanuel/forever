import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Calendar, Plus, MapPin, X, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { format, isPast, isToday, differenceInDays } from 'date-fns';

export function Meetings() {
  const { meetings, addMeeting, deleteMeeting, currentUser, users } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'meeting' | 'trip'>('meeting');

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    await addMeeting({
      title,
      description,
      type,
      date,
      createdBy: currentUser.id
    });
    setTitle('');
    setDescription('');
    setDate('');
    setIsAdding(false);
  };

  const getDaysUntil = (dateStr: string) => {
    const targetDate = new Date(dateStr);
    if (isToday(targetDate)) return 0;
    return differenceInDays(targetDate, new Date());
  };

  const upcomingMeetings = meetings.filter(m => !isPast(new Date(m.date)) || isToday(new Date(m.date)));
  const pastMeetings = meetings.filter(m => isPast(new Date(m.date)) && !isToday(new Date(m.date)));

  return (
    <motion.div 
      className="min-h-screen px-6 pt-12 pb-24 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="font-serif text-5xl mb-3 text-white">Our Timeline</h1>
          <p className="text-neutral-400">Marking the days until we're together again.</p>
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
            initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
            animate={{ height: 'auto', opacity: 1, overflow: 'visible' }}
            exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
            className="mb-12"
            onSubmit={handleSubmit}
          >
            <div className="glass-panel p-6 rounded-3xl space-y-4 border border-rose-500/20 max-w-xl mx-auto">
              <div className="flex gap-2 p-1 bg-dark-bg/50 rounded-2xl mb-4 border border-white/5">
                <button
                  type="button"
                  onClick={() => setType('meeting')}
                  className={cn("flex-1 py-2 text-sm rounded-xl transition-colors font-medium flex items-center justify-center gap-2", type === 'meeting' ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white")}
                >
                  <Calendar size={16} /> Meeting
                </button>
                <button
                  type="button"
                  onClick={() => setType('trip')}
                  className={cn("flex-1 py-2 text-sm rounded-xl transition-colors font-medium flex items-center justify-center gap-2", type === 'trip' ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white")}
                >
                  <Plane size={16} /> Trip
                </button>
              </div>

              <input
                autoFocus
                placeholder={type === 'meeting' ? "Date night? Visit?" : "Where to?"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-lg font-serif border-b border-white/10 py-2 outline-none focus:border-rose-400 placeholder:text-neutral-600 text-white"
                required
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-rose-400 placeholder:text-neutral-600 text-sm text-white [color-scheme:dark]"
                required
              />
              <input
                placeholder="Location or short description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-rose-400 placeholder:text-neutral-600 text-sm text-white"
              />
              <button 
                type="submit"
                disabled={!title || !date}
                className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium py-3 rounded-xl disabled:opacity-50 transition-colors shadow-lg shadow-rose-500/20 mt-4"
              >
                Plan it
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {meetings.length === 0 && !isAdding && (
        <div className="glass-panel p-12 text-center text-neutral-500 mt-12 text-lg font-serif italic rounded-[2rem] border-dashed border-white/20">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
          No future meetings mapped out... yet.
        </div>
      )}

      {upcomingMeetings.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-medium uppercase tracking-widest text-rose-400 mb-6 flex items-center gap-2">
            <Clock size={16} /> Upcoming
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingMeetings.map((meeting, i) => {
              const days = getDaysUntil(meeting.date);
              const author = users.find(u => u.id === meeting.createdBy);
              return (
                <motion.div 
                  key={meeting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-6 rounded-[2rem] border border-white/10 relative overflow-hidden group"
                >
                  <button 
                    onClick={() => deleteMeeting(meeting.id)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-red-500/20 text-neutral-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={16} />
                  </button>

                  <div className="flex gap-4">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
                      <span className="text-xs text-rose-400 font-medium uppercase">{format(new Date(meeting.date), 'MMM')}</span>
                      <span className="text-xl font-serif text-white">{format(new Date(meeting.date), 'd')}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 text-neutral-400">
                        {meeting.type === 'trip' ? <Plane size={14} /> : <Calendar size={14} />}
                        <span className="text-xs uppercase tracking-widest">{meeting.type}</span>
                      </div>
                      <h3 className="text-xl font-serif text-white mb-2">{meeting.title}</h3>
                      {meeting.description && (
                        <p className="text-sm text-neutral-400 mb-4 flex items-start gap-1">
                          <MapPin size={14} className="mt-0.5 shrink-0" />
                          <span>{meeting.description}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-sm text-neutral-500">
                    <span>Added by {author?.name || 'Partner'}</span>
                    <span className="bg-rose-500/10 text-rose-300 px-3 py-1 rounded-full font-medium border border-rose-500/20">
                      {days === 0 ? "Today!" : `${days} day${days !== 1 ? 's' : ''} left`}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {pastMeetings.length > 0 && (
        <div>
          <h2 className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
            <Clock size={16} /> Past Memories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
            {pastMeetings.map((meeting) => (
              <div key={meeting.id} className="glass-panel p-6 rounded-[2rem] border border-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-dark-bg flex items-center justify-center text-neutral-500 shrink-0">
                     {meeting.type === 'trip' ? <Plane size={20} /> : <Calendar size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-neutral-300">{meeting.title}</h3>
                    <p className="text-xs text-neutral-500">{format(new Date(meeting.date), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
