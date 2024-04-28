import { Session } from '@components/types';
import { createContext } from 'react';

class Logger {
  session: Session | null;
  constructor() {
    this.session = null;
  }
  setSession(session: Session | null) {
    this.session = session;
  }
  getSessionLogData() {
    return 'id:' + (this.session ? this.session.id : 'guest');
  }
  getTime() {
    return 'time:' + new Date().toISOString();
  }
  log(message: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams, this.getSessionLogData(), new Date().toISOString());
  }
  error(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams, this.getSessionLogData(), new Date().toISOString());
  }
  warn(message: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams, this.getSessionLogData(), new Date().toISOString());
  }
  info(message: any, ...optionalParams: any[]) {
    console.info(message, ...optionalParams, this.getSessionLogData(), new Date().toISOString());
  }
  debug(message: any, ...optionalParams: any[]) {
    console.debug(message, ...optionalParams, this.getSessionLogData(), new Date().toISOString());
  }
}

export const LoggerContext = createContext(null);

export default Logger;
