import { useEffect, useState } from 'react';
import { Header } from '@/components/common/Header';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { getSession } from '@/components/helper';
import '@/styles/index.css';

export default function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      const currSession = await getSession();
      setSession(currSession);
    }
    fetchSession();
  }, []);

  return (
    <>
      <Header />
      <Navbar session={session} setSession={setSession} />
      <Component {...pageProps} session={session} />
      <Footer />
    </>
  );
}
