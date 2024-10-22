import { Footer } from "@components/Footer";
import { Header } from "@components/Header";
import { Navbar } from "@components/Navbar";
import { Toaster } from "@components/ui/toaster";
import { APIProvider } from "@hooks/useAPI";
import { AuthProvider } from "@hooks/useAuth";
import { CacheProvider } from "@hooks/useCache";
import { LoggerProvider } from "@hooks/useLogger";
import { ThemeProvider } from "@hooks/useTheme";
import "src/global.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <LoggerProvider>
        <CacheProvider>
          <APIProvider>
            <ThemeProvider>
              <Header />
              <Navbar />
              <Component {...pageProps} />
              <Footer />
              <Toaster />
            </ThemeProvider>
          </APIProvider>
        </CacheProvider>
      </LoggerProvider>
    </AuthProvider>
  );
}
