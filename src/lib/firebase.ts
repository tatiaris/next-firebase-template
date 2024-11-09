import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
  getMetadata,
  StorageError,
} from "firebase/storage";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
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
  getFirestore,
  QueryFieldFilterConstraint,
} from "firebase/firestore";
import { config } from "src/config";

export const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string,
);

export const app = initializeApp(firebaseConfig, config.name);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);
const db = getFirestore(app);

type DataFunction = (...params: any[]) => Promise<any>;

export const signInWithGooglePopup = async () => {
  await signInWithPopup(auth, googleProvider);
};

export const signInWithEmailPassword = async (
  email: string,
  password: string,
) => {
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
};

export const signOutFromGoogle = async () => {
  signOut(auth).catch((error) => {
    console.error("Error signOut:", error);
    throw new Error("Could not sign out");
  });
};

export const awaitData = async (func: DataFunction, ...params: any[]) => {
  try {
    const response = await func(...params);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

const handleFirestoreError = (actionName: string, error: FirestoreError) => {
  console.error("Error firestoreError", error);
  throw new Error(`${actionName}: ${error.code} - ${error.message}`);
};

export const addObjectToCollection = async (col: string, obj: object): Promise<any> => {
  const [docRef, error] = (await awaitData(
    addDoc,
    collection(db, col),
    obj,
  )) as [DocumentReference, FirestoreError];
  if (error) handleFirestoreError("addObjectToCollection", error);
  return { id: docRef.id, ...obj };
};

export const getCollection = async (col: string): Promise<QuerySnapshot> => {
  const [docs, error] = (await awaitData(getDocs, collection(db, col))) as [
    QuerySnapshot,
    FirestoreError,
  ];
  if (error) handleFirestoreError("getCollection", error);
  return docs;
};

export const getCollectionWithIds = async (col: string): Promise<any> => {
  const [docs, error] = (await awaitData(getDocs, collection(db, col))) as [
    QuerySnapshot,
    FirestoreError,
  ];
  if (error) handleFirestoreError("getCollectionWithIds", error);
  return docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export const addObjectWithId = async (col: string, obj: object) => {
  const id = doc(collection(db, col)).id;
  const [setDocError] = (await awaitData(setDoc, doc(db, col, id), {
    ...obj,
    id,
  })) as [FirestoreError];
  if (setDocError) handleFirestoreError("addObjectWithId", setDocError);
  return id;
};

export const setObjectById = async (col: string, id: string, obj: object) => {
  const [setDocError] = (await awaitData(setDoc, doc(db, col, id), obj)) as [
    FirestoreError,
  ];
  if (setDocError) handleFirestoreError("setObjectById", setDocError);
};

export const getCount = async (col: string): Promise<number> => {
  const [snapshot, getCountError] = (await awaitData(
    getCountFromServer,
    collection(db, col),
  )) as [
      AggregateQuerySnapshot<{ count: AggregateField<number> }>,
      FirestoreError,
    ];
  if (getCountError) handleFirestoreError("getCount", getCountError);
  return snapshot.data().count;
};

export const updateObjectById = async (
  colName: string,
  id: string,
  updatedValues: object,
): Promise<any> => {
  const [, updateDocError] = (await awaitData(
    updateDoc,
    doc(db, colName, id),
    updatedValues,
  ));
  if (updateDocError) handleFirestoreError("updateObjectById", updateDocError);
  return updatedValues;
};

export const updateOrAddObjectById = async (
  colName: string,
  id: string,
  updatedValues: object,
) => {
  const docRef = doc(db, colName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateObjectById(colName, id, updatedValues);
  }
  await setDoc(docRef, updatedValues);
};

export const deleteDocById = async (col: string, id: string): Promise<string> => {
  const [deleteDocError] = (await awaitData(deleteDoc, doc(db, col, id))) as [FirestoreError];
  if (deleteDocError) handleFirestoreError("deleteDocById", deleteDocError);
  return id;
};

export const deleteDocsByFilter = async (
  colName: string,
  filter: QueryCompositeFilterConstraint,
  ...filters: QueryNonFilterConstraint[]
) => {
  const [querySnapshot, deleteDocsError] = (await awaitData(
    getDocs,
    query(collection(db, colName), filter, ...filters),
  )) as [QuerySnapshot, FirestoreError];
  if (deleteDocsError)
    handleFirestoreError("deleteDocsByFilter", deleteDocsError);
  const batch = writeBatch(db);
  querySnapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
};

export const findObjectsByFilter = async (
  colName: string,
  filter: QueryCompositeFilterConstraint,
  ...filters: QueryNonFilterConstraint[]
) => {
  const [querySnapshot, findObjectsError] = (await awaitData(
    getDocs,
    query(collection(db, colName), filter, ...filters),
  )) as [QuerySnapshot, FirestoreError];
  if (findObjectsError)
    handleFirestoreError("findObjectsByFilter", findObjectsError);
  return querySnapshot.docs.map((doc) => doc.data());
};

export const findObjectById = async (
  colName: string,
  id: string,
): Promise<object | null> => {
  const [snapshot, findObjectError] = (await awaitData(
    getDoc,
    doc(db, colName, id),
  )) as [DocumentSnapshot, FirestoreError];
  if (findObjectError) handleFirestoreError("findObjectById", findObjectError);
  const data = snapshot.exists() ? snapshot.data() : null;
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
    await getDownloadURL(storageRef);
    return true;
  } catch (error: any) {
    if (error.code === "storage/object-not-found") {
      return false;
    }
    throw error;
  }
};

/**
 * Upload a file to Firebase Storage.
 * @param {File} file - The file to upload.
 * @param {string} path - The path where the file should be uploaded.
 * @param {boolean} [replace=false] - Whether to replace the file if it already exists.
 * @returns {Promise<UploadFileResponse>} - A promise that resolves to the upload response.
 */
export interface UploadFileResponse {
  success: boolean;
  message: string;
  data: {
    downloadURL: string;
    fixedPath: string;
  } | null;
}
export const uploadFile = async (
  file: File,
  path: string,
  replace = false
): Promise<UploadFileResponse> => {
  try {
    const fixedPath = await generateUniqueFilePath(path, replace);
    const storageRef = ref(storage, fixedPath);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return {
      success: true,
      message: "Successfully uploaded the file",
      data: { downloadURL, fixedPath },
    };
  } catch (error) {
    console.error("uploadFile error:", error);
    return {
      success: false,
      message: "File could not be uploaded",
      data: null,
    };
  }
};

/**
 * Generate a unique file path if the file already exists.
 * @param {string} path - The base path for the file.
 * @param {boolean} replace - Whether to replace the file if it already exists.
 * @returns {Promise<string>} - A promise that resolves to the unique file path.
 */
const generateUniqueFilePath = async (
  path: string,
  replace: boolean
): Promise<string> => {
  if (replace) return path;

  let fixedPath = path;
  let counter = 0;

  while (await checkIfFileExists(fixedPath)) {
    counter++;
    fixedPath = `${path}-${counter}`;
  }

  return fixedPath;
};

interface DeleteFileResponse {
  success: boolean;
  message: string;
  error?: StorageError;
}
export const deleteFile = async (path: string): Promise<DeleteFileResponse> => {
  if (!path || path === "") return { success: true, message: "File does not exist" };
  const storageRef = ref(storage, path);
  try {
    await deleteObject(storageRef);
    return { success: true, message: "Successfully deleted the file" };
  } catch (error) {
    return { success: false, message: "Failed to delete the file", error };
  }
};

export const deleteCollection = async (col: string) => {
  const querySnapshot = await getDocs(collection(db, col));
  const batch = writeBatch(db);
  querySnapshot.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
};

// Helper function to fetch a document and its subcollections
export const getDocumentWithSubcollections = async (
  colName: string,
  id: string,
  subcollections: string[],
) => {
  const documentRef = doc(db, colName, id);
  const [documentSnapshot, getDocumentError] = (await awaitData(
    getDoc,
    documentRef,
  )) as [DocumentSnapshot, FirestoreError];

  if (getDocumentError)
    handleFirestoreError("getDocumentWithSubcollections", getDocumentError);

  const documentData = documentSnapshot.exists()
    ? documentSnapshot.data()
    : null;
  const subcollectionData = await Promise.all(
    subcollections.map(async (subcollection) => {
      const subcollectionRef = collection(documentRef, subcollection);
      const [subcollectionSnapshot, getSubcollectionError] = (await awaitData(
        getDocs,
        subcollectionRef,
      )) as [QuerySnapshot, FirestoreError];

      if (getSubcollectionError)
        handleFirestoreError(
          "getDocumentWithSubcollections",
          getSubcollectionError,
        );

      return {
        [subcollection]: subcollectionSnapshot.docs.map((doc) => doc.data()),
      };
    }),
  );

  return { ...documentData, ...Object.assign({}, ...subcollectionData) };
};

export const exists = async (colName: string, id: string): Promise<boolean> => {
  const docRef = doc(db, colName, id);
  const docSnapshot = await getDoc(docRef);
  return docSnapshot.exists();
};

export const existsByFilter = async (
  colName: string,
  filter: QueryFieldFilterConstraint,
  ...filters: QueryNonFilterConstraint[]
): Promise<boolean> => {
  const querySnapshot = await getDocs(
    query(collection(db, colName), filter, ...filters),
  );
  return !querySnapshot.empty;
};
