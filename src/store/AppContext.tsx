import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, logActivity } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, onSnapshot, query, addDoc, updateDoc, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firebaseErrors';
import { useToast } from '../context/ToastContext';

export type User = {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  mood?: string;
  position?: string;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: string;
  status: 'pending' | 'accepted';
  createdBy: string;
  createdAt: number;
};

export type Gift = {
  id: string;
  senderId: string;
  receiverId: string;
  itemId: string;
  message: string;
  isRead: boolean;
  createdAt: number;
};

export type Meeting = {
  id: string;
  title: string;
  description: string;
  type: 'trip' | 'meeting';
  date: string;
  createdBy: string;
  createdAt: number;
};

export type Contribution = {
  id: string;
  amount: number;
  personId: string;
  note: string;
  createdAt: number;
};

export type Note = {
  id: string;
  content: string;
  authorId: string;
  createdAt: number;
};

interface AppState {
  currentUser: User | null;
  users: User[];
  goals: Goal[];
  contributions: Contribution[];
  notes: Note[];
  gifts: Gift[];
  meetings: Meeting[];
  birthdayUnlocked: boolean;
}

interface AppContextType extends AppState {
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addContribution: (contribution: Omit<Contribution, 'id' | 'createdAt'>) => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addGift: (gift: Omit<Gift, 'id' | 'createdAt'>) => Promise<void>;
  markGiftAsRead: (id: string) => Promise<void>;
  addMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  unlockBirthday: (password: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [birthdayUnlocked, setBirthdayUnlocked] = useState(false);

  // helper to safely get partner's name
  const partnerName = () => {
    const partner = users.find(u => u.id !== currentUser?.id);
    return partner?.name || 'your queen';
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            const newUser = {
              name: firebaseUser.displayName || 'Anonymous',
              email: firebaseUser.email || '',
              avatarUrl: firebaseUser.photoURL || '',
              bio: '',
              mood: 'Happy',
              position: 'Home'
            };
            await setDoc(userRef, newUser);
          }
          
          const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
            const usersData: User[] = [];
            snapshot.forEach(d => {
              usersData.push({ id: d.id, ...d.data() } as User);
            });
            setUsers(usersData);
            const me = usersData.find(u => u.id === firebaseUser.uid) || null;
            setCurrentUser(me);
            setIsLoaded(true);
          }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));

          const unsubGoals = onSnapshot(query(collection(db, 'goals'), orderBy('createdAt', 'desc')), (snapshot) => {
            const g: Goal[] = [];
            snapshot.forEach(d => g.push({ id: d.id, ...d.data() } as Goal));
            setGoals(g);
          }, (err) => handleFirestoreError(err, OperationType.LIST, 'goals'));

          const unsubNotes = onSnapshot(query(collection(db, 'notes'), orderBy('createdAt', 'desc')), (snapshot) => {
            const n: Note[] = [];
            snapshot.forEach(d => n.push({ id: d.id, ...d.data() } as Note));
            setNotes(n);
          }, (err) => handleFirestoreError(err, OperationType.LIST, 'notes'));

          const unsubContribs = onSnapshot(query(collection(db, 'contributions'), orderBy('createdAt', 'desc')), (snapshot) => {
            const c: Contribution[] = [];
            snapshot.forEach(d => c.push({ id: d.id, ...d.data() } as Contribution));
            setContributions(c);
          }, (err) => handleFirestoreError(err, OperationType.LIST, 'contributions'));

          const unsubGifts = onSnapshot(query(collection(db, 'gifts'), orderBy('createdAt', 'desc')), (snapshot) => {
            const g: Gift[] = [];
            snapshot.forEach(d => g.push({ id: d.id, ...d.data() } as Gift));
            setGifts(g);
          }, (err) => handleFirestoreError(err, OperationType.LIST, 'gifts'));

          const unsubMeetings = onSnapshot(query(collection(db, 'meetings'), orderBy('date', 'asc')), (snapshot) => {
            const m: Meeting[] = [];
            snapshot.forEach(d => m.push({ id: d.id, ...d.data() } as Meeting));
            setMeetings(m);
          }, (err) => handleFirestoreError(err, OperationType.LIST, 'meetings'));

          return () => {
            unsubUsers();
            unsubGoals();
            unsubNotes();
            unsubContribs();
            unsubGifts();
            unsubMeetings();
          };

        } catch (e) {
          handleFirestoreError(e, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setCurrentUser(null);
        setUsers([]);
        setGoals([]);
        setNotes([]);
        setContributions([]);
        setGifts([]);
        setMeetings([]);
        setIsLoaded(true);
      }
    });

    return () => unsubAuth();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setBirthdayUnlocked(false);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.id);
      await updateDoc(userRef, updates);
      showToast('Profile updated', 'success');
      await logActivity(
        'profile_update',
        currentUser.id,
        currentUser.name,
        partnerName(),
        `${currentUser.name} updated their profile`
      );
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${currentUser.id}`);
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'goals'), {
        ...goal,
        createdAt: Date.now()
      });
      showToast('Goal created! 🎯', 'success');
      await logActivity(
        'goal_created',
        currentUser.id,
        currentUser.name,
        partnerName(),
        `${currentUser.name} proposed a goal: ${goal.title}`
      );
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'goals');
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      await updateDoc(doc(db, 'goals', id), updates);
      if (updates.status === 'accepted') {
        showToast('Goal accepted! 💖', 'success');
        if (currentUser) {
          const goal = goals.find(g => g.id === id);
          await logActivity(
            'goal_accepted',
            currentUser.id,
            currentUser.name,
            partnerName(),
            `${currentUser.name} accepted the goal: ${goal?.title || 'a goal'}`
          );
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `goals/${id}`);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'goals', id));
      showToast('Goal deleted', 'info');
      if (currentUser) {
        const goal = goals.find(g => g.id === id);
        await logActivity(
          'goal_deleted',
          currentUser.id,
          currentUser.name,
          partnerName(),
          `${currentUser.name} deleted the goal: ${goal?.title || 'a goal'}`
        );
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `goals/${id}`);
    }
  }

  const addContribution = async (contribution: Omit<Contribution, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'contributions'), {
        ...contribution,
        createdAt: Date.now()
      });
      showToast('Contribution added! 💰', 'success');
      await logActivity(
        'contribution_added',
        currentUser.id,
        currentUser.name,
        partnerName(),
        `${currentUser.name} added a contribution of ${contribution.amount} FCFA`
      );
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'contributions');
    }
  };

  const addNote = async (note: Omit<Note, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'notes'), {
        ...note,
        createdAt: Date.now()
      });
      showToast('Memory saved 💌', 'success');
      await logActivity(
        'note_added',
        currentUser.id,
        currentUser.name,
        partnerName(),
        `${currentUser.name} wrote a new memory`
      );
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'notes');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
      showToast('Note deleted', 'info');
      if (currentUser) {
        await logActivity(
          'note_deleted',
          currentUser.id,
          currentUser.name,
          partnerName(),
          `${currentUser.name} deleted a memory`
        );
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `notes/${id}`);
    }
  }

  const addGift = async (gift: Omit<Gift, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'gifts'), {
        ...gift,
        createdAt: Date.now()
      });
      // Toast is handled inside GlobalGifts.tsx, but we can still log
      showToast('Gift sent! 🎁', 'success');
      await logActivity(
        'gift_sent',
        currentUser.id,
        currentUser.name,
        partnerName(),
        `${currentUser.name} sent a gift to ${partnerName()}`
      );
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'gifts');
    }
  };

  const markGiftAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'gifts', id), { isRead: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `gifts/${id}`);
    }
  };

  const addMeeting = async (meeting: Omit<Meeting, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'meetings'), {
        ...meeting,
        createdAt: Date.now()
      });
      showToast('Meeting scheduled 📅', 'success');
      await logActivity(
        'meeting_scheduled',
        currentUser.id,
        currentUser.name,
        partnerName(),
        `${currentUser.name} scheduled a ${meeting.type}: ${meeting.title}`
      );
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'meetings');
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      const meeting = meetings.find(m => m.id === id);
      await deleteDoc(doc(db, 'meetings', id));
      showToast('Meeting removed', 'info');
      if (currentUser && meeting) {
        await logActivity(
          'meeting_deleted',
          currentUser.id,
          currentUser.name,
          partnerName(),
          `${currentUser.name} removed the meeting: ${meeting.title}`
        );
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `meetings/${id}`);
    }
  };

  const unlockBirthday = (password: string) => {
    if (password === 'forever' || password === 'iloveyou') {
      setBirthdayUnlocked(true);
      showToast('Birthday unlocked! 🎂', 'success');
      if (currentUser) {
        logActivity(
          'birthday_unlocked',
          currentUser.id,
          currentUser.name,
          partnerName(),
          `${currentUser.name} unlocked the birthday page`
        );
      }
      return true;
    }
    return false;
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
        <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      currentUser, users, goals, contributions, notes, gifts, meetings, birthdayUnlocked,
      loginWithGoogle, logout, updateProfile, addGoal, updateGoal, deleteGoal, addContribution, addNote, deleteNote, addGift, markGiftAsRead, addMeeting, deleteMeeting, unlockBirthday
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
