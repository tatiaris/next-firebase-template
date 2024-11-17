import { Footer } from "@components/Footer";
import { Header } from "@components/Header";
import { Navbar } from "@components/Navbar";
import { Toaster } from "@components/ui/toaster";
import { APIProvider } from "@hooks/useAPI";
import { CacheProvider } from "@hooks/useCache";
import { FirebaseProvider } from "@hooks/useFirebase";
import { LoggerProvider } from "@hooks/useLogger";
import { ThemeProvider } from "@hooks/useTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "src/global.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <FirebaseProvider>
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
      </FirebaseProvider>
    </QueryClientProvider>
  );
}
