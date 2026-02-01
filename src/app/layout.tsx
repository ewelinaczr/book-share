import type { Metadata } from "next";
import { Providers } from "@/providers/Providers";
import { NextIntlClientProvider } from "next-intl";
import { ToastContainer } from "react-toastify";
import OnboardingWrapper from "./onboarding/OnboardingWrapper";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "BookShare — Share and Discover Books Locally",
  description:
    "BookShare helps you discover, borrow, and exchange books with people in your community",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
        <link rel="mask-icon" href="/favicon.svg" color="#FEBA45" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <NextIntlClientProvider>
          <Providers>
            <OnboardingWrapper>
              <div className={"page-wrapper"}>
                <Navigation />
                <main>{children}</main>
                <ToastContainer
                  position="bottom-center"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
                <Footer />
              </div>
            </OnboardingWrapper>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
