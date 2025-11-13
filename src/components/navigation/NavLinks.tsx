"use client";
import Link from "next/link";
import React from "react";
import { navLinks } from "./navigationConfig";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

function NavLinks() {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <ul className={styles.navLinks}>
      {navLinks.map((link) => (
        <li key={link.name}>
          <Link href={`${link.path}`}>
            <div className={styles.navLink} id={link.onboardingId}>
              <p
                className={
                  link.path === pathname
                    ? styles.navLinkNameSelected
                    : styles.navLinkName
                }
              >
                {t(`navigation_${link.id}`)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default NavLinks;
