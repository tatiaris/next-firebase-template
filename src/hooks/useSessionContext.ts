import { createContext } from 'react';

export const SessionContext = createContext({
  session: null,
  isGuest: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSession: (session) => {}
});
