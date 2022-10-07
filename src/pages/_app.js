import { useEffect, useState } from 'react';
import { Header } from '@/components/common/Header';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { getSession } from '@/components/helper';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import '@/styles/index.css';

export default function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null);
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true
  });
  const toggleColorScheme = (value) => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  useEffect(() => {
    async function fetchSession() {
      const currSession = await getSession();
      setSession(currSession);
    }
    fetchSession();
  }, []);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withNormalizeCSS withGlobalStyles>
        <Header />
        <Navbar session={session} setSession={setSession} />
        <Component {...pageProps} session={session} />
        <Footer />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
