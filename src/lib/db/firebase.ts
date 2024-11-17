import { Auth } from "firebase/auth";
import { deleteObject, FirebaseStorage, getDownloadURL, ref, StorageError, uploadBytes } from "firebase/storage";
import { addDoc, collection, deleteDoc, doc, DocumentData, Firestore, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";

interface UploadFileResponse {
  success: boolean;
  message: string;
  data: {
    downloadURL: string;
    fixedPath: string;
  } | null;
}

interface DeleteFileResponse {
  success: boolean;
  message: string;
  error?: StorageError;
}

class FirebaseDB {
  auth: Auth;
  storage: FirebaseStorage;
  db: Firestore;

  constructor(storage: FirebaseStorage, db: Firestore) {
    this.storage = storage;
    this.db = db;
  }

  async exists(collection: string, id: string): Promise<boolean> {
    const docRef = doc(this.db, collection, id);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot.exists();
  }

  async fileExists(path: string): Promise<boolean> {
    const storageRef = ref(this.storage, path);

    try {
      await getDownloadURL(storageRef);
      return true;
    } catch (error: any) {
      if (error.code === "storage/object-not-found") {
        return false;
      }
      throw error;
    }
  }

  async addObject<T extends DocumentData>(colName: string, data: T): Promise<T> {
    const docRef = await addDoc(collection(this.db, colName), data);
    return { id: docRef.id, ...data };
  }

  async addObjectWithId<T extends DocumentData>(colName: string, data: T): Promise<T> {
    const id = doc(collection(this.db, colName)).id;
    await setDoc(doc(this.db, colName, id), { ...data, id });
    return { ...data, id };
  }

  async setObject<T extends DocumentData>(collection: string, id: string, data: T) {
    await setDoc(doc(this.db, collection, id), data);
  }

  async getObject<T>(collection: string, id: string): Promise<T | undefined> {
    const docSnap = await getDoc(doc(this.db, collection, id));
    return docSnap.data() as T;
  }

  async updateObject<T extends DocumentData>(collection: string, id: string, data: T) {
    await updateDoc(doc(this.db, collection, id), data);
  }

  async deleteObject(collection: string, id: string) {
    await deleteDoc(doc(this.db, collection, id));
  }

  async findObject<T extends DocumentData>(colName: string, field: string, value: string): Promise<T> {
    const docs = await getDocs(query(collection(this.db, colName), where(field, "==", value)));
    if (docs.empty) {
      throw new Error("Document not found");
    }
    return docs.docs[0].data() as T;
  }

  async findObjects<T>(colName: string, field: string, value: string): Promise<T[]> {
    const docs = await getDocs(query(collection(this.db, colName), where(field, "==", value)));
    return docs.docs.map((doc) => doc.data() as T);
  }

  async getCollection<T>(colName: string): Promise<T[]> {
    const docs = await getDocs(collection(this.db, colName));
    return docs.docs.map((doc) => doc.data() as T);
  }

  async getCollectionWithIds<T>(colName: string): Promise<({ id: string; } & T)[]> {
    const docs = await getDocs(collection(this.db, colName));
    return docs.docs.map((doc) => ({ id: doc.id, ...doc.data() as T }));
  }

  async checkIfFileExists(path: string): Promise<boolean> {
    const storageRef = ref(this.storage, path);
    try {
      await getDownloadURL(storageRef);
      return true;
    } catch (error: any) {
      if (error.code === "storage/object-not-found") {
        return false;
      }
      throw error;
    }
  }

  async generateUniqueFilePath(path: string, replace = false): Promise<string> {
    if (replace) return path;
    let fixedPath = path;
    let counter = 0;
    while (await this.checkIfFileExists(fixedPath)) {
      counter++;
      fixedPath = `${path}-${counter}`;
    }
    return fixedPath;
  }

  async uploadFile(file: File, path: string, replace = false): Promise<UploadFileResponse> {
    try {
      const fixedPath = await this.generateUniqueFilePath(path, replace);
      const storageRef = ref(this.storage, fixedPath);

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
  }

  async deleteFile(path: string): Promise<DeleteFileResponse> {
    if (!path || path === "") return { success: true, message: "File does not exist" };
    const storageRef = ref(this.storage, path);
    try {
      await deleteObject(storageRef);
      return { success: true, message: "Successfully deleted the file" };
    } catch (error) {
      return { success: false, message: "Failed to delete the file", error };
    }
  }
}

export default FirebaseDB;