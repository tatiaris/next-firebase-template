import { Footer } from '@components/footer';
import { Header } from '@components/header';
import { Navbar } from '@components/navbar';
import { APIProvider } from '@hooks/useAPI';
import { AuthProvider } from '@hooks/useAuth';
import { CacheProvider } from '@hooks/useCache';
import { LoggerProvider } from '@hooks/useLogger';
import { ThemeProvider } from '@hooks/useTheme';
import 'src/global.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <LoggerProvider>
        <CacheProvider>
          <APIProvider>
            <ThemeProvider>
              <div className="bg-background">
                <Header />
                <Navbar />
                <main className="px-4">
                  <Component {...pageProps} />
                </main>
                <Footer />
              </div>
            </ThemeProvider>
          </APIProvider>
        </CacheProvider>
      </LoggerProvider>
    </AuthProvider>
  );
}
