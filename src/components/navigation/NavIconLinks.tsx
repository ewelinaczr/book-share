"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import cn from "classnames";
import { navIconLinks } from "./navigationConfig";
import { PiHandWavingLight } from "react-icons/pi";
import { useNextStep } from "nextstepjs";
import { useGetRequestsToMeQuery } from "@/api/marketApi";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import ThemeButton from "../themeButton/ThemeButton";
import LogInButtons from "./LogInButtons";
import styles from "./Navigation.module.css";

function NavIconLinks() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { startNextStep } = useNextStep();

  // Only fetch requests if the user is logged in to save resources
  const { data: requests } = useGetRequestsToMeQuery(undefined, {
    skip: !session,
  });

  const hasRequests = useMemo(() => (requests?.length ?? 0) > 0, [requests]);

  return (
    <ul className={styles.navIconLinks}>
      {navIconLinks.map((link) => {
        const isActive = pathname === link.path;
        const showBadge = link.id === "requests" && hasRequests;

        return (
          <li
            id={link.onboardingId ?? ""}
            key={link.name}
            className={cn(
              styles.navIconLink,
              isActive ? styles.navIconLinkNameSelected : styles.navLinkName
            )}
          >
            <Link
              href={link.path}
              className={styles.round}
              prefetch={false}
              aria-label={link.name}
            >
              <div aria-hidden="true">{link.icon}</div>
            </Link>

            {showBadge && <div className={styles.notification} />}
          </li>
        );
      })}

      {/* Onboarding Trigger */}
      <li key="onboarding" className={styles.navIconLink}>
        <button
          className={cn(styles.round, styles.onboardingIcon)}
          id="nextstep-step1"
          onClick={() => startNextStep("mainTour")}
          aria-label="Start Tour"
        >
          <PiHandWavingLight />
        </button>
      </li>

      {/* Theme Toggle */}
      <li key="theme" className={styles.navIconLink}>
        <ThemeButton />
      </li>

      {/* Auth State */}
      {!session && <LogInButtons />}
    </ul>
  );
}

export default NavIconLinks;
