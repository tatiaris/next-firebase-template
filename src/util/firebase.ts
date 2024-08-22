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
  where,
  orderBy,
  startAfter,
  limit,
  getFirestore,
  runTransaction,
  onSnapshot
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

// Helper function to get a single document from a collection based on a field and its value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getObjectByField = async (colName: string, field: string, value: any): Promise<object | null> => {
  const [snapshot, getObjectError] = (await awaitData(getDocs, query(collection(db, colName), where(field, '==', value)))) as [QuerySnapshot, FirestoreError];
  if (getObjectError) handleFirestoreError('getObjectByField', getObjectError);

  const [firstDoc] = snapshot.docs;
  return firstDoc ? firstDoc.data() : null;
};

// Helper function to update a document based on a field and its value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateObjectByField = async (colName: string, field: string, value: any, updatedValues: object) => {
  const [updateDocError] = (await awaitData(updateDoc, doc(collection(db, colName), ((await getObjectByField(colName, field, value)) as { id: string })?.id), updatedValues)) as [FirestoreError];
  if (updateDocError) handleFirestoreError('updateObjectByField', updateDocError);
};

// Helper function to delete a document based on a field and its value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteObjectByField = async (colName: string, field: string, value: any) => {
  const docToDelete = (await getObjectByField(colName, field, value)) as { id: string };
  if (docToDelete) {
    const [deleteDocError] = (await awaitData(deleteDoc, doc(collection(db, colName), docToDelete.id))) as [FirestoreError];
    if (deleteDocError) handleFirestoreError('deleteObjectByField', deleteDocError);
  }
};

// Helper function to add or update a document based on a field and its value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addOrUpdateObjectByField = async (colName: string, field: string, value: any, obj: object) => {
  const existingDoc = await getObjectByField(colName, field, value);

  if (existingDoc) {
    await updateObjectByField(colName, field, value, obj);
  } else {
    await addObjectToCollection(colName, obj);
  }
};

// Helper function to get a paginated collection
export const getPaginatedCollection = async (colName: string, pageSize: number, startAfterDoc?: DocumentSnapshot) => {
  const collectionRef = collection(db, colName);
  const q = query(collectionRef, orderBy('__name__'), startAfter(startAfterDoc), limit(pageSize));

  const [querySnapshot, getPaginatedError] = (await awaitData(getDocs, q)) as [QuerySnapshot, FirestoreError];
  if (getPaginatedError) handleFirestoreError('getPaginatedCollection', getPaginatedError);

  return {
    docs: querySnapshot.docs.map((doc) => doc.data()),
    lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
  };
};

// Helper function to perform a transaction on a document
export const runFirebaseTransaction = async (colName: string, id: string, transactionCallback: (data: object | null) => object) => {
  const firestore = getFirestore();

  const result = await runTransaction(firestore, async (transaction) => {
    const docRef = doc(collection(db, colName), id);
    const docSnapshot = await transaction.get(docRef);
    const data = docSnapshot.exists() ? docSnapshot.data() : null;

    const updatedData = transactionCallback(data);

    transaction.set(docRef, updatedData);

    return updatedData;
  });

  return result;
};

// Helper function to batch write multiple documents
export const batchWrite = async (colName: string, data: object[]) => {
  const batch = writeBatch(db);

  data.forEach((obj: { id: string }) => {
    const docRef = doc(collection(db, colName), obj.id);
    batch.set(docRef, obj);
  });

  const [batchWriteError] = (await awaitData(batch.commit, batch)) as [FirestoreError];
  if (batchWriteError) handleFirestoreError('batchWrite', batchWriteError);
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

// Helper function to listen for real-time updates on a document
export const subscribeToDocument = (colName: string, id: string, callback: (data: object | null) => void) => {
  const documentRef = doc(db, colName, id);
  const unsubscribe = onSnapshot(documentRef, (docSnapshot) => {
    const data = docSnapshot.exists() ? docSnapshot.data() : null;
    callback(data);
  });

  return unsubscribe;
};

const fetchQueryResults = async (query: QuerySnapshot) => {
  const results: UserObjectDB[] = [];
  query.forEach((doc) => {
    const userData = doc.data() as UserObjectDB;
    results.push(userData);
  });
  return results;
};

export const searchUsers = async (searchTerm: string): Promise<UserObjectDB[]> => {
  if (!searchTerm.trim()) {
    return [];
  }

  const searchQuery = searchTerm.trim().toLowerCase();
  const users: UserObjectDB[] = [];

  try {
    const usersRef = collection(db, Collections.User);

    const usernameQuery = query(usersRef, where('username', '>=', searchQuery), where('username', '<=', searchQuery + '\uf8ff'));

    const nameQuery = query(usersRef, where('name', '>=', searchQuery), where('name', '<=', searchQuery + '\uf8ff'));

    const [usernameSnapshot, nameSnapshot] = await Promise.all([getDocs(usernameQuery), getDocs(nameQuery)]);

    const usersByUsername = await fetchQueryResults(usernameSnapshot);
    const usersByName = await fetchQueryResults(nameSnapshot);

    const userIds = new Set(usersByUsername.map((u) => u.id));

    users.push(...usersByUsername);
    users.push(...usersByName.filter((user) => !userIds.has(user.id)));

    return users;
  } catch (error) {
    console.error('Error searching users: ', error);
    return [];
  }
};

export const exists = async (colName: string, id: string): Promise<boolean> => {
  const docRef = doc(db, colName, id);
  const docSnapshot = await getDoc(docRef);
  return docSnapshot.exists();
};
