import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL, getMetadata, StorageError } from 'firebase/storage';
import { GoogleAuthProvider, getAuth, sendSignInLinkToEmail, signInWithEmailLink, signInWithPopup, signOut } from 'firebase/auth';
import { Collections, headers } from 'src/lib/constants';
import { navigatePath } from 'src/lib/helper';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  QueryCompositeFilterConstraint,
  QueryNonFilterConstraint,
  QuerySnapshot,
  setDoc,
  updateDoc,
  writeBatch,
  FirestoreError,
  AggregateQuerySnapshot,
  AggregateField,
  getFirestore
} from 'firebase/firestore';
import { UserObjectDB } from 'src/lib/types';

export const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string);

export const app = initializeApp(firebaseConfig, 'frontend');
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);
const db = getFirestore(app);

interface UploadFileResponse {
  success: boolean;
  message: string;
  data: {
    downloadURL: string;
    fixedPath: string;
  } | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataFunction = (...params: any[]) => Promise<any>;

export const signInWithGoogle = async () => {
  signInWithPopup(auth, googleProvider).catch((error) => {
    console.error('Error signInWithGoogle:', error);
    throw new Error('Could not sign in with Google');
  });
};

export const signOutFromGoogle = async () => {
  signOut(auth).catch((error) => {
    console.error('Error signOut:', error);
    throw new Error('Could not sign out');
  });
};

export const signInWithGoogleEmailAuth = async (email: string, redirect = '/home') => {
  signInWithEmailLink(auth, email, window.location.href)
    .then(async (res) => {
      const user = res.user;
      const credential = GoogleAuthProvider.credentialFromResult(res);
      const idToken = await user.getIdToken();
      const authRes = await fetch(`/api/auth/google`, {
        method: 'POST',
        headers: headers['POST'],
        body: JSON.stringify({ user, credential: { ...credential, idToken } })
      });
      const authData = await authRes.json();
      console.log('authData:', authData);
      if (authData.success) {
        navigatePath(redirect);
      }
    })
    .catch((error) => {
      console.error('Error signInWithGoogleEmailAuth:', error);
    });
};

export const sendSignInWithEmailLink = async (email: string, setEmailSent: React.Dispatch<React.SetStateAction<boolean>>, redirect = '/') => {
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: process.env.NEXT_PUBLIC_BASE_URL + redirect + '?email=' + email,
    // This must be true.
    handleCodeInApp: true
  };
  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      // The link was successfully sent. Inform the user.
      setEmailSent(true);
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', email);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error sendSignInWithEmailLink:', errorCode, errorMessage);
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const awaitData = async (func: DataFunction, ...params: any[]) => {
  try {
    const response = await func(...params);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

const handleFirestoreError = (actionName: string, error: FirestoreError) => {
  console.error('Error firestoreError', error);
  throw new Error(`${actionName}: ${error.code} - ${error.message}`);
};

export const addObjectToCollection = async (col: string, obj: object) => {
  const [docRef, error] = (await awaitData(addDoc, collection(db, col), obj)) as [DocumentReference, FirestoreError];
  if (error) handleFirestoreError('addObjectToCollection', error);
  return docRef.id;
};

export const getCollection = async (col: string): Promise<QuerySnapshot> => {
  const [docs, error] = (await awaitData(getDocs, collection(db, col))) as [QuerySnapshot, FirestoreError];
  if (error) handleFirestoreError('getCollection', error);
  return docs;
};

export const addObjectWithId = async (col: string, obj: object) => {
  const id = doc(collection(db, col)).id;
  const [setDocError] = (await awaitData(setDoc, doc(db, col, id), { ...obj, id })) as [FirestoreError];
  if (setDocError) handleFirestoreError('addObjectWithId', setDocError);
  return id;
};

export const setObjectById = async (col: string, id: string, obj: object) => {
  const [setDocError] = (await awaitData(setDoc, doc(db, col, id), obj)) as [FirestoreError];
  if (setDocError) handleFirestoreError('setObjectById', setDocError);
};

export const getCount = async (col: string): Promise<number> => {
  const [snapshot, getCountError] = (await awaitData(getCountFromServer, collection(db, col))) as [AggregateQuerySnapshot<{ count: AggregateField<number> }>, FirestoreError];
  if (getCountError) handleFirestoreError('getCount', getCountError);
  return snapshot.data().count;
};

export const updateObjectById = async (colName: string, id: string, updatedValues: object) => {
  const [updateDocError] = (await awaitData(updateDoc, doc(db, colName, id), updatedValues)) as [FirestoreError];
  if (updateDocError) handleFirestoreError('updateObjectById', updateDocError);
};

export const updateOrAddObjectById = async (colName: string, id: string, updatedValues: object) => {
  const docRef = doc(db, colName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateObjectById(colName, id, updatedValues);
  }
  await setDoc(docRef, updatedValues);
};

export const deleteDocById = async (col: string, id: string) => {
  const [deleteDocError] = (await awaitData(deleteDoc, doc(db, col, id))) as [FirestoreError];
  if (deleteDocError) handleFirestoreError('deleteDocById', deleteDocError);
};

export const deleteDocsByFilter = async (colName: string, filter: QueryCompositeFilterConstraint, ...filters: QueryNonFilterConstraint[]) => {
  const [querySnapshot, deleteDocsError] = (await awaitData(getDocs, query(collection(db, colName), filter, ...filters))) as [QuerySnapshot, FirestoreError];
  if (deleteDocsError) handleFirestoreError('deleteDocsByFilter', deleteDocsError);
  const batch = writeBatch(db);
  querySnapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
};

export const findObjectsByFilter = async (colName: string, filter: QueryCompositeFilterConstraint, ...filters: QueryNonFilterConstraint[]) => {
  const [querySnapshot, findObjectsError] = (await awaitData(getDocs, query(collection(db, colName), filter, ...filters))) as [QuerySnapshot, FirestoreError];
  if (findObjectsError) handleFirestoreError('findObjectsByFilter', findObjectsError);
  return querySnapshot.docs.map((doc) => doc.data());
};

export const findObjectById = async (colName: string, id: string): Promise<object | null> => {
  const [snapshot, findObjectError] = (await awaitData(getDoc, doc(db, colName, id))) as [DocumentSnapshot, FirestoreError];
  if (findObjectError) handleFirestoreError('findObjectById', findObjectError);
  const data = snapshot.exists()
    ? (snapshot.data() as UserObjectDB)
    : colName === Collections.User
      ? ({
          id,
          username: 'deleted_user',
          name: 'Deleted User',
          picture: 'https://via.placeholder.com/150'
        } as UserObjectDB)
      : null;
  return data;
};

/**
 * Check if a file exists in Firebase Storage.
 * @param {string} filePath - The path of the file to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the file exists, false otherwise.
 */
export const checkIfFileExists = async (filePath: string): Promise<boolean> => {
  const storageRef = ref(storage, filePath);
  try {
    await getMetadata(storageRef);
    return true;
  } catch (error) {
    if (error instanceof StorageError && error.code === 'storage/object-not-found') {
      return false;
    }
    throw error; // Re-throw other errors
  }
};

/**
 * Upload a file to Firebase Storage.
 * @param {File} file - The file to upload.
 * @param {string} path - The path where the file should be uploaded.
 * @param {boolean} [replace=false] - Whether to replace the file if it already exists.
 * @returns {Promise<UploadFileResponse>} - A promise that resolves to the upload response.
 */
export const uploadFile = async (file: File, path: string, replace = false): Promise<UploadFileResponse> => {
  try {
    const fixedPath = await generateUniqueFilePath(path, replace);
    const storageRef = ref(storage, fixedPath);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return { success: true, message: 'Successfully uploaded the file', data: { downloadURL, fixedPath } };
  } catch (error) {
    console.error('uploadFile error:', error);
    return { success: false, message: 'File could not be uploaded', data: null };
  }
};

/**
 * Generate a unique file path if the file already exists.
 * @param {string} path - The base path for the file.
 * @param {boolean} replace - Whether to replace the file if it already exists.
 * @returns {Promise<string>} - A promise that resolves to the unique file path.
 */
const generateUniqueFilePath = async (path: string, replace: boolean): Promise<string> => {
  if (replace) return path;

  let fixedPath = path;
  let counter = 0;

  while (await checkIfFileExists(fixedPath)) {
    counter++;
    fixedPath = `${path}-${counter}`;
  }

  return fixedPath;
};

export const deleteFile = async (path: string): Promise<{ success: boolean; message: string }> => {
  const storageRef = ref(storage, path);
  try {
    await deleteObject(storageRef);
    return { success: true, message: 'Successfully deleted the file' };
  } catch (error) {
    return { success: false, message: 'Failed to delete the file' };
  }
};

export const deleteCollection = async (col: string) => {
  const querySnapshot = await getDocs(collection(db, col));
  const batch = writeBatch(db);
  querySnapshot.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
};

// Helper function to fetch a document and its subcollections
export const getDocumentWithSubcollections = async (colName: string, id: string, subcollections: string[]) => {
  const documentRef = doc(db, colName, id);
  const [documentSnapshot, getDocumentError] = (await awaitData(getDoc, documentRef)) as [DocumentSnapshot, FirestoreError];

  if (getDocumentError) handleFirestoreError('getDocumentWithSubcollections', getDocumentError);

  const documentData = documentSnapshot.exists() ? documentSnapshot.data() : null;
  const subcollectionData = await Promise.all(
    subcollections.map(async (subcollection) => {
      const subcollectionRef = collection(documentRef, subcollection);
      const [subcollectionSnapshot, getSubcollectionError] = (await awaitData(getDocs, subcollectionRef)) as [QuerySnapshot, FirestoreError];

      if (getSubcollectionError) handleFirestoreError('getDocumentWithSubcollections', getSubcollectionError);

      return {
        [subcollection]: subcollectionSnapshot.docs.map((doc) => doc.data())
      };
    })
  );

  return { ...documentData, ...Object.assign({}, ...subcollectionData) };
};

const fetchQueryResults = async (query: QuerySnapshot) => {
  const results: UserObjectDB[] = [];
  query.forEach((doc) => {
    const userData = doc.data() as UserObjectDB;
    results.push(userData);
  });
  return results;
};

export const exists = async (colName: string, id: string): Promise<boolean> => {
  const docRef = doc(db, colName, id);
  const docSnapshot = await getDoc(docRef);
  return docSnapshot.exists();
};
