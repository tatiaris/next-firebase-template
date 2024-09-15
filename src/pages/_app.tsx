import { Header } from '@components/Header';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import { LoggerProvider } from '@hooks/useLogger';
import { AuthProvider } from '@hooks/useAuth';
import { APIProvider } from '@hooks/useAPI';
import { CacheProvider } from '@hooks/useCache';
import { ThemeProvider } from '@hooks/useTheme';
import '@styles/index.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <LoggerProvider>
        <CacheProvider>
          <APIProvider>
            <ThemeProvider>
              <Header />
              <Navbar />
              <main>
                <Component {...pageProps} />
              </main>
              <Footer />
            </ThemeProvider>
          </APIProvider>
        </CacheProvider>
      </LoggerProvider>
    </AuthProvider>
  );
}
