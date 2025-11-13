"use client";
import React from "react";
import Link from "next/link";
import cn from "classnames";
import { navIconLinks } from "./navigationConfig";
import { PiHandWavingLight } from "react-icons/pi";
import { useNextStep } from "nextstepjs";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import ThemeButton from "../themeButton/ThemeButton";
import LogInButtons from "./LogInButtons";
import LogOutButton from "./LogOutButton";
import styles from "./Navigation.module.css";

function NavIconLinks() {
  const { data: session } = useSession();
  const { startNextStep } = useNextStep();
  const pathname = usePathname();

  const renderAuthButtons = () => {
    return session ? <LogOutButton /> : <LogInButtons />;
  };

  return (
    <ul className={styles.navIconLinks}>
      {navIconLinks.map((link) => (
        <li
          key={link.name}
          id={link.onboardingId ?? ""}
          className={cn(
            styles.navIconLink,
            link.path === pathname
              ? styles.navIconLinkNameSelected
              : styles.navLinkName
          )}
        >
          <Link href={link.path} className={styles.round}>
            <div>{link.icon}</div>
          </Link>
        </li>
      ))}
      <li key="onboarding" className={styles.navIconLink}>
        <button
          className={cn(styles.round, styles.onboardingIcon)}
          id="nextstep-step1"
          onClick={() => startNextStep("mainTour")}
        >
          <PiHandWavingLight />
        </button>
      </li>
      <li key="theme" className={styles.navIconLink}>
        <ThemeButton />
      </li>
      {renderAuthButtons()}
    </ul>
  );
}

export default NavIconLinks;
