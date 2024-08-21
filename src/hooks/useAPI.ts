import { useState, useEffect, useCallback, createContext } from 'react';
import { and, where } from 'firebase/firestore';
import { Session, UserObjectDB } from 'src/lib/types';
import { findObjectsByFilter } from '@util/firebase';
import { Collections } from 'src/lib/constants';

export const APIContext = createContext<ReturnType<typeof useAPI>>({
  fetchSession: async () => null,
  getUnreadNotificationsCount: async () => 0,
  fetchProfileByUsername: async () => null,
  fetchProfileById: async () => null
});

export type API = ReturnType<typeof useAPI>;

export function useAPI() {
  const fetchIdFromUsername = async (username: string): Promise<string> => {
    const user = (await findObjectsByFilter(Collections.User, and(where('username', '==', username)))) as UserObjectDB[];
    if (user.length === 0) return undefined;
    return user[0].id;
  };

  const fetchSession = useCallback(async (): Promise<Session> => {
    const response = await fetch(`/api/auth/session`);
    const resJson = await response.json();
    const session = resJson.session;
    if ('username' in session) {
      return session;
    }
    return null;
  }, []);

  const getUnreadNotificationsCount = useCallback(async (): Promise<number> => {
    return 1;
  }, []);

  const fetchProfileByUsername = async (username: string): Promise<UserObjectDB> => {
    const id = await fetchIdFromUsername(username);
    const res = await fetch(`/api/user/${id}/profile`);
    const resData = await res.json();
    if (!resData.success) {
      console.error('Error getAllUserDataByUsername:', resData);
      return null;
    }
    return resData.data;
  };

  const fetchProfileById = async (id: string): Promise<UserObjectDB> => {
    const res = await fetch(`/api/user/${id}/profile`);
    const resData = await res.json();
    if (!resData.success) {
      console.error('Error getAllUserDataByUsername:', resData);
      return null;
    }
    return resData.data;
  };

  return {
    fetchSession,
    getUnreadNotificationsCount,
    fetchProfileByUsername,
    fetchProfileById
  };
}
