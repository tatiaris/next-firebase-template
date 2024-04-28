import { WhereFilterOp } from '@google-cloud/firestore';
import fs from 'firebase-admin';

if (fs.apps.length === 0) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
  fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
  });
}

const db = fs.firestore();

export const getDocId = async (colName: string, query: [string, WhereFilterOp, string]) => {
  const snapshot = await db.collection(colName).where(query[0], query[1], query[2]).get();
  return snapshot.docs[0].id;
};

export const findOneObject = async (colName: string, id: string = null, query: [string, WhereFilterOp, string] = null): Promise<any> => {
  const byId = id && id.length > 0;
  if (!byId && !query) {
    throw new Error("Invalid query parameters");
  }
  else if (byId) {
    const ref = db.collection(colName).doc(id);
    const snapshot = await ref.get();
    return snapshot.exists ? { ...snapshot.data(), id: snapshot.id } : null;
  }
  else {
    const ref = db.collection(colName).where(query[0], query[1], query[2]);
    const snapshot = await ref.get();
    return snapshot.empty ? null : { ...snapshot.docs[0].data(), id: snapshot.docs[0].id };
  }
}

export const insertOneObject = async (colName: string, newObject: any, id: string = null) => {
  const byId = id && id.length > 0;
  if (byId) {
    const ref = db.collection(colName).doc(id);
    await ref.set(newObject);
    return id;
  }
  else {
    const ref = db.collection(colName);
    const res = await ref.add(newObject);
    return res.id;
  }
}

export const updateOneObject = async (colName: string, id: string, updatedKeysAndVals) => {
  try {
    const ref = db.collection(colName).doc(id);
    const resId = await ref.update(updatedKeysAndVals);
    return resId;
  } catch (error) {
    throw Error(`406 - Object not found ${id}`);
  }
};

export const deleteOneObject = async (colName: string, id: string) => {
  try {
    const ref = db.collection(colName).doc(id);
    const res = await ref.delete();
    return res;
  } catch (error) {
    throw Error(`406 - Object not found ${id}`);
  }
};

export const deepDeleteOneObject = async (colName: string, id: string) => {
  try {
    const ref = db.collection(colName).doc(id);
    const res = await ref.delete();
    return res;
  } catch (error) {
    throw Error(`406 - Object not found ${id}`);
  }
};

export const getAllObjects = async (colName: string) => {
  const snapshot = await db.collection(colName).get();
  const allObjs = [];
  snapshot.forEach((obj) => {
    allObjs.push({ ...obj.data(), id: obj.id });
  });
  return allObjs;
};

export const getSampleData = async () => {
  const collections = await db.listCollections();
  const samples = {};
  for (const col of collections) {
    const snapshot = await db.collection(col.id).limit(1).get();
    snapshot.forEach((obj) => {
      samples[col.id] = ({ ...obj.data(), id: obj.id });
    });
  }
  return samples;
}
