import { AuthProvider } from '@/hooks/useAuth';
import { LoggerProvider } from '@/hooks/useLogger';
import { CacheProvider } from '@/hooks/useCache';
import { APIProvider } from '@/hooks/useAPI';
import { ThemeProvider } from '@/hooks/useTheme';
import Header from '@/components/header';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
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
