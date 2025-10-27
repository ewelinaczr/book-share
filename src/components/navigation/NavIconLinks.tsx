"use client";
import React from "react";
import Link from "next/link";
import { navIconLinks } from "./navigationConfig";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import ThemeButton from "../themeButton/ThemeButton";
import LogInButtons from "./LogInButtons";
import LogOutButton from "./LogOutButton";
import styles from "./Navigation.module.css";

function NavIconLinks() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const renderAuthButtons = () => {
    return session ? <LogOutButton /> : <LogInButtons />;
  };

  return (
    <ul className={styles.navIconLinks}>
      {navIconLinks.map((link) => (
        <li
          key={link.name}
          className={`${styles.navIconLink} ${
            link.path === pathname
              ? styles.navIconLinkNameSelected
              : styles.navLinkName
          }`}
        >
          <Link href={link.path} className={styles.round}>
            <div>{link.icon}</div>
          </Link>
        </li>
      ))}
      <li key="theme" className={styles.navIconLink}>
        <ThemeButton />
      </li>
      {renderAuthButtons()}
    </ul>
  );
}

export default NavIconLinks;
