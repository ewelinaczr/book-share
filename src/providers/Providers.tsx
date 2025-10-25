"use client";

import React from "react";
import { ReduxProvider } from "./ReduxProvider";
import { SessionProvider } from "next-auth/react";

type ProvidersProps = { children: React.ReactNode };

export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <SessionProvider>{children}</SessionProvider>
    </ReduxProvider>
  );
}
