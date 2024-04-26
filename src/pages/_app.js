import { useEffect, useState } from 'react';
import { Header } from '@components/common/Header';
import { Navbar } from '@components/common/Navbar';
import { Footer } from '@components/common/Footer';
import { getSession } from '@components/helper';
import { SessionContext } from '@hooks/useSessionContext';
import Logger, { LoggerContext } from '@util/logger';
import '@styles/index.css';

export default function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null);
  const logger = new Logger();

  useEffect(() => {
    logger.setSession(session);
  }, [session]);

  useEffect(() => {
    async function fetchSession() {
      const currSession = await getSession();
      setSession(currSession);
    }
    fetchSession();
  }, []);

  return (
    <LoggerContext.Provider value={logger}>
      <SessionContext.Provider value={{ session, isGuest: session ? session.email.length === 0 : true, setSession }}>
        <Header />
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </SessionContext.Provider>
    </LoggerContext.Provider>
  );
}
