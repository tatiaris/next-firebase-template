import fs from 'firebase-admin';

if (fs.apps.length === 0) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
  fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
  });
}

const db = fs.firestore();

export const getDocId = async (colName: string, query: []) => {
  const snapshot = await db.collection(colName).where(query[0], query[1], query[2]).get();
  return snapshot.docs[0].id;
};

export const findOneObject = async (colName: string, id: string = null, query: [] = null) => {
  const byId = id && id.length > 0;
  const ref = byId ? db.collection(colName).doc(id) : db.collection(colName);
  const snapshot = await (byId ? ref.get() : ref.where(query[0], query[1], query[2]).get());
  const snapshotExists = (snapshot.empty !== undefined && !snapshot.empty) || snapshot.exists;
  return snapshotExists ? (byId ? { ...snapshot.data(), id: snapshot.id } : { ...snapshot.docs[0].data(), id: snapshot.docs[0].id }) : null;
};

export const insertOneObject = async (colName: string, newObject: any, id: string = null) => {
  const byId = id && id.length > 0;
  const ref = byId ? db.collection(colName).doc(id) : db.collection(colName);
  const res = await (byId ? ref.set(newObject) : ref.add(newObject));
  return res.id !== undefined ? res.id : null;
};

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
    allObjs.push({...obj.data(), id: obj.id});
  });
  return allObjs;
};
