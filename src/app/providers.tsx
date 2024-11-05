"use client";
import { Footer } from "@components/Footer";
import { Navbar } from "@components/Navbar";
import { Toaster } from "@components/ui/toaster";
import { APIProvider } from "@hooks/useAPI";
import { AuthProvider } from "@hooks/useAuth";
import { CacheProvider } from "@hooks/useCache";
import { LoggerProvider } from "@hooks/useLogger";
import { ThemeProvider } from "@hooks/useTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "src/global.css";

const queryClient = new QueryClient();

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoggerProvider>
          <CacheProvider>
            <APIProvider>
              <ThemeProvider>
                <html lang="en">
                  <body>
                    <Navbar />
                    {children}
                    <Footer />
                    <Toaster />
                  </body>
                </html>
              </ThemeProvider>
            </APIProvider>
          </CacheProvider>
        </LoggerProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
