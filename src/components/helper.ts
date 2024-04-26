import { headers } from '@components/constants';
import { decode } from 'jsonwebtoken';
import { Session } from './types';

export const sum = (a: number, b: number): number => {
  return a + b;
};

export const getCookie = (c_name: string): string => {
  let c_value = ' ' + document.cookie;
  let c_start = c_value.indexOf(' ' + c_name + '=');
  if (c_start == -1) {
    c_value = null;
  } else {
    c_start = c_value.indexOf('=', c_start) + 1;
    let c_end = c_value.indexOf(';', c_start);
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
    method: 'POST',
    headers: headers['POST'],
    body: JSON.stringify({ newObject })
  });
  const resJson = res.json();
  return resJson;
};

export const updateOneInDatabase = async (collection: string, objectId: string, updatedKeysAndVals: any) => {
  const res = await fetch(`/api/admin/${collection}/${objectId}`, {
    method: 'PUT',
    headers: headers['PUT'],
    body: JSON.stringify({ objectId, updatedKeysAndVals })
  });
  const resJson = res.json();
  return resJson;
};

export const deleteOneFromDatabase = async (collection: string, id: string) => {
  const res = await fetch(`/api/admin/${collection}/${id}`, {
    method: 'DELETE'
  });
  const resJson = res.json();
  return resJson;
};

export const getOneFromDatabase = async (collection: string, id: string) => {
  const res = await fetch(`/api/admin/${collection}/${id}`);
  const resData = await res.json();
  return resData;
};

/* ALL OBJECTS CRUD */

export const getAllFromDatabase = async (collection: string) => {
  const collectionResponse = await fetch(`/api/admin/${collection}`);
  const collectionData = await collectionResponse.json();
  return collectionData ? collectionData : null;
};

export const updateAllInDatabase = async (collection: string, updatedKeysAndVals: any) => {
  return null;
};

export const deleteAllFromDatabase = async (collection: string) => {
  return null;
};

/* MULTIPLE OBJECTS CRUD */

export const addMultipleToDatabase = async (collection: string, newObject: any) => {
  return null;
};

export const updateMultipleInDatabase = async (collection: string, objectId: string, updatedKeysAndVals: any) => {
  return null;
};

export const deleteMultipleFromDatabase = async (collection: string, id: string) => {
  return null;
};

export const getMultipleFromDatabase = async (collection: string, id: string) => {
  return null;
};

/* USER FUNCTIONS */

export const getSession = async (): Promise<Session> => {
  const udata = decode(getCookie('udata'));
  if (udata) return udata['user'];
  const res = await fetch(`/api/auth/session`, { credentials: 'include' });
  const sessionData = await res.json();
  return sessionData.session;
};

export const login = async (email, password, redirect = '/') => {
  try {
    const res = await fetch(`/api/auth/login`, {
      method: 'POST',
      headers: headers['POST'],
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) navigatePath(redirect);
    return data;
  } catch (error) {
    return { success: false, data: 'Internal server error', error };
  }
};

export const logout = async () => {
  try {
    const res = await fetch(`/api/auth/logout`, {
      method: 'POST',
      headers: headers['POST']
    });
    const data = await res.json();
    if (data.success) refreshPage();
    return data;
  } catch (error) {
    return { success: false, data: 'Internal server error', error };
  }
};

export const signupUser = async (newUser, password, redirect = '/') => {
  try {
    const res = await fetch(`/api/auth/signup`, {
      method: 'POST',
      headers: headers['POST'],
      body: JSON.stringify({ newUser, password })
    });
    const data = await res.json();
    if (data.success) navigatePath(redirect);
    return data;
  } catch (error) {
    return { success: false, data: 'Internal server error', error };
  }
};
