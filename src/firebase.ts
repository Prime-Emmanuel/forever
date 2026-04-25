import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

/**
 * Logs a user activity to Firestore for the activity feed.
 */
export const logActivity = async (
  type: string,
  userId: string,
  userName: string,
  partnerName: string,
  message: string
) => {
  try {
    await addDoc(collection(db, 'activities'), {
      type,
      userId,
      userName,
      partnerName,
      message,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to log activity', error);
  }
};
