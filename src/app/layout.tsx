import "src/global.css";
import Providers from "./providers";
import { config } from "src/config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: config.name,
  description: config.description,
  authors: config.authors,
  icons: config.favicon,
  keywords: config.keywords,
}

/**
 * Root layout component
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Providers>{children}</Providers>;
}
