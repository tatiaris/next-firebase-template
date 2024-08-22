import { useEffect, useState } from 'react';
import { Header } from '@components/Header';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import Logger, { LoggerContext } from '@util/logger';
import { APIContext, useAPI } from '@hooks/useAPI.ts';
import { CacheContext, useCache } from '@hooks/useCache';
import { ThemeContext, useTheme } from '@hooks/useTheme';
import { useAuth, AuthContext } from '@hooks/useAuth';

import '@styles/index.css';

export default function MyApp({ Component, pageProps }) {
  const api = useAPI();
  const cache = useCache();
  const theme = useTheme();
  const logger = new Logger();
  const auth = useAuth();

  function setInitialTheme() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.body.classList.add(theme);
    } else {
      localStorage.setItem('theme', 'light');
      document.body.classList.add('light');
    }
  }

  useEffect(() => {
    setInitialTheme();
  }, []);

  if (auth.isLoading) return <></>;

  return (
    <LoggerContext.Provider value={logger}>
      <AuthContext.Provider value={auth}>
        <APIContext.Provider value={api}>
          <CacheContext.Provider value={cache}>
            <ThemeContext.Provider value={theme}>
              <Header />
              <Navbar />
              <main>
                <Component {...pageProps} />
              </main>
              <Footer />
            </ThemeContext.Provider>
          </CacheContext.Provider>
        </APIContext.Provider>
      </AuthContext.Provider>
    </LoggerContext.Provider>
  );
}
