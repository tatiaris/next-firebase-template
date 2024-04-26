import { createContext } from "react";

export const SessionContext = createContext({
  session: null,
  isGuest: true,
  setSession: (session) => { },
});