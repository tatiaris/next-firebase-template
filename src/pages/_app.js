import { useEffect, useState } from 'react';
import { Header } from '@components/Header';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import Logger, { LoggerContext } from '@util/logger';
import { SessionContext, useSession } from '@hooks/useSession';
import { APIContext, useAPI } from '@hooks/useAPI.ts';
import { CacheContext, useCache } from '@hooks/useCache';
import { ThemeContext } from '@hooks/useTheme';

import '@styles/index.css';

export default function MyApp({ Component, pageProps }) {
  const api = useAPI();
  const sessionData = useSession(api);
  const cache = useCache();
  const [session, setSession] = useState(null);
  const logger = new Logger();

  useEffect(() => {
    logger.setSession(session);
  }, [session]);

  function setInitialTheme() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.body.classList.add(theme);
    } else {
      localStorage.setItem('theme', 'light');
      document.body.classList.add('light');
    }
  }

  function setTheme(newTheme = null) {
    const theme = localStorage.getItem('theme');
    if (newTheme) {
      document.body.classList.remove(theme);
      document.body.classList.add(newTheme);
      localStorage.setItem('theme', newTheme);
    } else {
      document.body.classList.remove(theme);
      document.body.classList.add(theme === 'light' ? 'dark' : 'light');
      localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light');
    }
  }

  useEffect(() => {
    setInitialTheme();
  }, []);

  return (
    <LoggerContext.Provider value={logger}>
      <SessionContext.Provider value={{ session, setSession, isGuest: session ? session.email.length === 0 : true }}>
        <ThemeContext.Provider value={{ setTheme }}>
          <Header />
          <Navbar />
          <main>
            <Component {...pageProps} />
          </main>
          <Footer />
        </ThemeContext.Provider>
      </SessionContext.Provider>
    </LoggerContext.Provider>
  );
}
