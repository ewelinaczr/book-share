"use client";

import React from "react";
import { ReduxProvider } from "./ReduxProvider";
import { SessionProvider } from "next-auth/react";
import { PopupProvider } from "./PopupProvider";

type ProvidersProps = { children: React.ReactNode };

export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <SessionProvider>
        <PopupProvider>{children}</PopupProvider>
      </SessionProvider>
    </ReduxProvider>
  );
}
