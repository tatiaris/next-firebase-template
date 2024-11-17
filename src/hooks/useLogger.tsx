import { createContext, useContext, useState } from "react";
import useFirebase from "./useFirebase";

// Logger context interface
interface Logger {
  log: LogMethod;
  error: LogMethod;
  warn: LogMethod;
  info: LogMethod;
  debug: LogMethod;
}

type LogMethod = (message: any, ...optionalParams: any[]) => void;

export const LoggerContext = createContext<Logger>({
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
});

export const LoggerProvider = ({ children }) => {
  const { user } = useFirebase();
  const [analytics, setAnalytics] = useState(null);

  const logMethod =
    (method: LogMethod) =>
      (message: any, ...optionalParams: any[]) => {
        method({
          time: new Date().toISOString(),
          session: user,
          message,
          ...optionalParams,
        });
      };

  const logger: Logger = {
    log: logMethod(console.log),
    error: logMethod(console.error),
    warn: logMethod(console.warn),
    info: logMethod(console.info),
    debug: logMethod(console.debug),
  };

  const event = (name: string, params: any) => {
    // if (process.env.NODE_ENV !== 'production' && app) {
    //   logEvent(analytics, name, params);
    // }
  };

  return (
    <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>
  );
};

export const useLogger = () => {
  return useContext(LoggerContext);
};
