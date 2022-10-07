import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import { getAuth, GoogleAuthProvider, signInWithPopup, getRedirectResult, signOut } from 'firebase/auth';
import { headers } from '@/components/constants';
import { navigatePath } from '@/components/helper';

const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string);

const app = initializeApp(firebaseConfig, 'frontend');
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (redirect = '/') => {
  const res = await signInWithPopup(auth, googleProvider);
  const user = res.user;
  const data = user ? await signupGoogleUser(user) : { success: false, data: 'Something went wrong' };
  if (data.success) navigatePath(redirect);
  return data;
};

const storage = getStorage(app);

export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const data = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return { sucess: true, data: downloadURL };
  } catch (error) {
    return { sucess: false, data: 'File could not be uploaded' };
  }
};

export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const data = await deleteObject(storageRef);
    return { success: true, data: 'File deleted' };
  } catch (error) {
    return { success: false, data: 'Something went wrong' };
  }
};

const signupGoogleUser = async (newUser) => {
  const res = await fetch(`/api/auth/google`, {
    method: 'POST',
    headers: headers['POST'],
    body: JSON.stringify({ newUser })
  });
  const data = res.json();
  return data;
};
