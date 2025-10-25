import type { Metadata } from "next";
import { Providers } from "@/providers/Providers";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";

import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "BookShare — Share and Discover Books Locally",
  description:
    "BookShare helps you discover, borrow, and exchange books with people in your community",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <body>
        <NextIntlClientProvider>
          <Providers>
            <Navigation />
            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
