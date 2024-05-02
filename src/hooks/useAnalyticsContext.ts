import { createContext } from 'react';

export const AnalyticsContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beacon: (eventName: string, eventParams: any) => {}
});
