import { createContext, useContext, useEffect, useState } from "react";
import { Auth, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User } from "firebase/auth";
import { FirebaseApp, initializeApp } from "firebase/app";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Firestore, getFirestore } from "firebase/firestore";
import { config } from "src/config";
import FirebaseDB from "@lib/db/firebase";

const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string);

export const FirebaseContext = createContext<{
  app: FirebaseApp;
  auth: Auth;
  storage: FirebaseStorage;
  firestore: Firestore;
  db: FirebaseDB;
  user: User | null;
  isLoading: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}>({
  app: {} as FirebaseApp,
  auth: {} as Auth,
  storage: {} as FirebaseStorage,
  firestore: {} as Firestore,
  db: {} as FirebaseDB,
  user: null,
  isLoading: true,
  isGuest: true,
  signInWithGoogle: async () => { },
  signInWithEmailPassword: async () => { },
  signOutUser: async () => { },
});

export const FirebaseProvider = ({ children }) => {
  const app = initializeApp(firebaseConfig, config.name);
  const auth = getAuth(app);
  const storage = getStorage(app);
  const firestore = getFirestore(app);
  const db = new FirebaseDB(storage, firestore);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const googleAuthProvider = new GoogleAuthProvider();

  async function signInWithGoogle() {
    await signInWithPopup(auth, googleAuthProvider);
  }

  async function signInWithEmailPassword(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        throw error;
      }
    }
  }

  async function signOutUser() {
    signOut(auth).catch((error) => {
      console.error("Error signOut:", error);
      throw new Error("Could not sign out");
    });
  }

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });
  }, []);

  return (
    <FirebaseContext.Provider value={{
      app,
      auth,
      storage,
      firestore,
      db,
      user,
      isLoading,
      isGuest: !user,
      signInWithGoogle,
      signInWithEmailPassword,
      signOutUser,
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default function useFirebase() {
  return useContext(FirebaseContext);
}
