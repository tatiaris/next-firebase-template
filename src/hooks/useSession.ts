import { useState, useEffect, createContext } from 'react';
import { API } from './useAPI';
import { Session } from 'src/lib/types';

export const SessionContext = createContext<ReturnType<typeof useSession>>({
  session: null,
  setSession: () => {},
  isGuest: null,
  setIsGuest: () => {},
  unreadNotificationsCount: 0,
  setUnreadNotificationsCount: () => {}
});

export function useSession(api: API) {
  const [session, setSession] = useState<Session>(undefined);
  const [isGuest, setIsGuest] = useState<boolean>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);

  async function loadSession() {
    const currSession = await api.fetchSession();
    setSession(currSession);
    setIsGuest(currSession ? false : true);
    const unreadCount = await api.getUnreadNotificationsCount();
    setUnreadNotificationsCount(unreadCount);
  }

  useEffect(() => {
    loadSession();
  }, []);

  return { session, setSession, unreadNotificationsCount, setUnreadNotificationsCount, isGuest, setIsGuest };
}
