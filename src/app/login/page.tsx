"use client";

import React, { Suspense } from "react";
import { LogInForm } from "./LogInFormNew";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";

function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LogInForm />
    </Suspense>
  );
}

export default LoginPage;
