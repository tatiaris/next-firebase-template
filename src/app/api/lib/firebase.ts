import fs from "firebase-admin";
import {
  DocumentData,
  Firestore,
  QuerySnapshot,
  WhereFilterOp,
} from "@google-cloud/firestore";

if (fs.apps.length === 0) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string,
  );
  const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG as string);
  fs.initializeApp({
    credential: fs.credential.cert(serviceAccount),
    storageBucket: firebaseConfig.storageBucket,
  });
}

export const db: Firestore = fs.firestore();
export const auth = fs.auth();

export const getSampleData = async () => {
  const collections = await db.listCollections();
  const samples = {};
  for (const col of collections) {
    const snapshot = await db.collection(col.id).limit(1).get();
    snapshot.forEach((obj) => {
      samples[col.id] = { ...obj.data(), id: obj.id };
    });
  }
  return samples;
};

export const getDocId = async (
  colName: string,
  field: string,
  operator: WhereFilterOp,
  value: any,
) => {
  const snapshot = await db
    .collection(colName)
    .where(field, operator, value)
    .get();
  return snapshot.docs[0].id;
};

export const getIdByField = async (
  colName: string,
  field: string,
  operator: WhereFilterOp,
  value: any,
) => {
  const snapshot = await db
    .collection(colName)
    .where(field, operator, value)
    .get();
  return snapshot.docs[0].id;
};

export const addObjectToCollection = async (col: string, obj: object) => {
  const docRef = await db.collection(col).add(obj);
  return docRef.id;
};

export const getCollection = async (
  col: string,
): Promise<QuerySnapshot<DocumentData>> => {
  const snapshot = await db.collection(col).get();
  return snapshot;
};

export const addObjectWithId = async (col: string, obj: object) => {
  const id = db.collection(col).doc().id;
  await db
    .collection(col)
    .doc(id)
    .set({ ...obj, id });
  return id;
};

export const setObjectById = async (col: string, id: string, obj: object) => {
  await db.collection(col).doc(id).set(obj);
};

export const getCount = async (col: string): Promise<number> => {
  const snapshot = await db.collection(col).get();
  return snapshot.size;
};

export const updateObjectById = async (
  colName: string,
  id: string,
  updatedValues: object,
) => {
  await db.collection(colName).doc(id).update(updatedValues);
};

export const updateOrAddObjectById = async (
  colName: string,
  id: string,
  updatedValues: object,
) => {
  // check if the document exists
  const doc = await db.collection(colName).doc(id).get();
  if (!doc.exists) {
    await setObjectById(colName, id, updatedValues);
  }
  await db.collection(colName).doc(id).update(updatedValues);
};

export const deleteDocById = async (col: string, id: string) => {
  // check if the document exists
  const doc = await db.collection(col).doc(id).get();
  if (!doc.exists) {
    return;
  }
  await db.collection(col).doc(id).delete();
};

export const deleteDocsByFilter = async (
  colName: string,
  field: string,
  operator: WhereFilterOp,
  value: any,
) => {
  const snapshot = await db
    .collection(colName)
    .where(field, operator, value)
    .get();
  if (snapshot.empty) {
    return;
  }
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};

export const findObjectsByFilter = async (
  colName: string,
  field: string,
  operator: WhereFilterOp,
  value: any,
) => {
  const snapshot = await db
    .collection(colName)
    .where(field, operator, value)
    .get();
  return snapshot.docs.map((doc) => doc.data());
};

export const findObjectByFilter = async (
  colName: string,
  field: string,
  operator: WhereFilterOp,
  value: any,
): Promise<object | null> => {
  const snapshot: QuerySnapshot<DocumentData> = await db
    .collection(colName)
    .where(field, operator, value)
    .limit(1)
    .get();

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { ...doc.data(), id: doc.id };
  } else {
    return null;
  }
};

export const findObjectById = async (
  colName: string,
  id: string,
): Promise<DocumentData | null | undefined> => {
  const snapshot = await db.collection(colName).doc(id).get();
  const data = snapshot.exists ? snapshot.data() : null;
  return data;
};

export const deleteCollection = async (colName: string) => {
  const snapshot = await db.collection(colName).get();
  snapshot.docs.forEach((doc) => {
    doc.ref.delete();
  });
};

export const deleteFile = async (path: string) => {
  await fs.storage().bucket().file(path).delete();
};
