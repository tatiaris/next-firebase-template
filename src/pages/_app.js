import { useEffect, useState } from 'react';
import { Header } from '@components/Header';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import { getSession } from 'src/lib/helper';
import { SessionContext } from '@hooks/useSessionContext';
import { ThemeContext } from '@hooks/useThemeContext';
import Logger, { LoggerContext } from '@util/logger';
import '@styles/index.css';

export default function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null);
  const logger = new Logger();

  useEffect(() => {
    logger.setSession(session);
  }, [session]);

  async function fetchSession() {
    const currSession = await getSession();
    setSession(currSession);
  }

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
    fetchSession();
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
