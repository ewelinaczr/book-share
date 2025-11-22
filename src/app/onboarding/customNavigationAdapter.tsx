"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { NavigationAdapter } from "nextstepjs";

export function useCustomNavigationAdapter(): NavigationAdapter {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => setCurrentPath(pathname), [pathname]);

  const push = useCallback(
    (to: string) => {
      router.push(to);
      setCurrentPath(to);
    },
    [router]
  );

  const getCurrentPath = useCallback(() => currentPath, [currentPath]);

  return { push, getCurrentPath };
}
