import { headers } from "src/lib/constants";

export const sum = (a: number, b: number): number => {
  return a + b;
};

export const getCookie = (c_name: string): string => {
  let c_value = " " + document.cookie;
  let c_start = c_value.indexOf(" " + c_name + "=");
  if (c_start == -1) {
    c_value = null;
  } else {
    c_start = c_value.indexOf("=", c_start) + 1;
    let c_end = c_value.indexOf(";", c_start);
    if (c_end == -1) {
      c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start, c_end));
  }
  return c_value;
};

export const navigatePath = (path: string): void => {
  location.href = path;
};

export const refreshPage = () => {
  location.reload();
};

/* SINGLE OBJECT CRUD */

export const addOneToDatabase = async (collection: string, newObject: any) => {
  const res = await fetch(`/api/admin/${collection}`, {
    method: "POST",
    headers: headers["POST"],
    body: JSON.stringify({ newObject }),
  });
  const resJson = res.json();
  return resJson;
};

export const updateOneInDatabase = async (
  collection: string,
  objectId: string,
  updatedKeysAndVals: any,
) => {
  const res = await fetch(`/api/admin/${collection}/${objectId}`, {
    method: "PUT",
    headers: headers["PUT"],
    body: JSON.stringify({ objectId, updatedKeysAndVals }),
  });
  const resJson = res.json();
  return resJson;
};

export const deleteOneFromDatabase = async (collection: string, id: string) => {
  const res = await fetch(`/api/admin/${collection}/${id}`, {
    method: "DELETE",
  });
  const resJson = res.json();
  return resJson;
};

export const getOneFromDatabase = async (collection: string, id: string) => {
  const res = await fetch(`/api/admin/${collection}/${id}`);
  const resData = await res.json();
  return resData;
};

export const queryOneFromDatabase = async (
  collection: string,
  key: string,
  value: string,
) => {
  const res = await fetch(`/api/admin/${collection}/query`, {
    method: "POST",
    headers: headers["POST"],
    body: JSON.stringify({ key, value }),
  });
  const resJson = res.json();
  return resJson;
};

export const getSamplesFromDatabase = async () => {
  const res = await fetch(`/api/admin/samples`);
  const resData = await res.json();
  return resData;
};

/* ALL OBJECTS CRUD */

export const getAllFromCollection = async (collection: string) => {
  const collectionResponse = await fetch(`/api/admin/${collection}`);
  const collectionData = await collectionResponse.json();
  return collectionData ? collectionData : null;
};

export const updateAllInCollection = async (
  collection: string,
  updatedKeysAndVals: any,
) => {
  return null;
};

export const deleteAllFromCollection = async (collection: string) => {
  return null;
};

/* MULTIPLE OBJECTS CRUD */

export const addMultipleToCollection = async (
  collection: string,
  newObjects: any[],
) => {
  return null;
};

export const updateMultipleInCollection = async (
  collection: string,
  objectIds: string[],
  updatedKeysAndVals: any[],
) => {
  return null;
};

export const deleteMultipleFromCollection = async (
  collection: string,
  ids: string[],
) => {
  return null;
};

export const getMultipleFromCollection = async (
  collection: string,
  id: string,
) => {
  return null;
};
