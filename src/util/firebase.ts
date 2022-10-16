import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { headers } from '@/components/constants';
import { navigatePath } from '@/components/helper';

const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string);

const app = initializeApp(firebaseConfig, 'frontend');
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (redirect = '/') => {
  const res = await signInWithPopup(auth, googleProvider);
  const user = res.user;
  const data = user ? await signupGoogleUser(user) : { success: false, message: 'Something went wrong', data: null };
  if (data.success) navigatePath(redirect);
  return data;
};

const storage = getStorage(app);

const checkIfFileExists = async (filePath: string): Promise<Boolean> => {
  const storageRef = ref(storage, filePath);
  try {
    await getDownloadURL(storageRef);
    return true;
  } catch (error) {
    return false;
  }
}

export const uploadFile = async (file, path, replace = false) => {
  try {
    let i = 0;
    let fixedPath = path;
    let exists = await checkIfFileExists(fixedPath);
    while (!replace && exists) {
      i++;
      fixedPath = `${path}-${i}`;
      exists = await checkIfFileExists(fixedPath);
    }
    const storageRef = ref(storage, fixedPath);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return { sucess: true, message: 'Successfully uploaded the file', data: { downloadURL, fixedPath } };
  } catch (error) {
    return { sucess: false, message: 'File could not be uploaded', data: null };
  }
};

export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return { success: true, message: 'Successfully deleted the file' };
  } catch (error) {
    return { success: false, message: 'Failed to delete the file' };
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
