'use client';
import { Footer } from '@components/Footer';
import { Header } from '@components/Header';
import { Navbar } from '@components/Navbar';
import { APIProvider } from '@hooks/useAPI';
import { AuthProvider } from '@hooks/useAuth';
import { CacheProvider } from '@hooks/useCache';
import { LoggerProvider } from '@hooks/useLogger';
import { ThemeProvider } from '@hooks/useTheme';
import 'src/global.css';

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <LoggerProvider>
        <CacheProvider>
          <APIProvider>
            <ThemeProvider>
              <html lang="en">
                <body>
                  <Header />
                  <Navbar />
                  {children}
                  <Footer />
                </body>
              </html>
            </ThemeProvider>
          </APIProvider>
        </CacheProvider>
      </LoggerProvider>
    </AuthProvider>
  );
}
