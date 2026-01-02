"use client";
import styles from "./Navigation.module.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navIconLinks, navLinks } from "./navigationConfig";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { IoIosMenu } from "react-icons/io";
import { IoCloseCircleSharp } from "react-icons/io5";
import ThemeButton from "../themeButton/ThemeButton";
import LogInButtons from "./LogInButtons";

function MobileNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  // Automatically close menu when the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const renderMobileNavCloseButton = () => {
    return (
      <li key={"closeButton"} className={styles.mobileCloseButtonWrapper}>
        <button
          type="button"
          aria-label="Close navigation menu"
          className={styles.mobileCloseButton}
          onClick={() => setIsMenuOpen(false)}
        >
          <IoCloseCircleSharp />
        </button>
      </li>
    );
  };

  const renderMobileNavItems = () => {
    return [...navLinks, ...navIconLinks].map((link) => {
      return (
        <li key={link.name} className={styles.mobileNavIconLink}>
          <Link
            href={link.path}
            className={styles.mobileLink}
            prefetch={false}
            onClick={() => setIsMenuOpen(false)}
          >
            <div> {t(`navigation_${link.id}`)}</div>
          </Link>
        </li>
      );
    });
  };

  const renderAuthButtons = () => {
    return session ? null : <LogInButtons />;
  };

  return (
    <div className={styles.hamburgerMenu}>
      <button
        type="button"
        aria-label={
          isMenuOpen ? t("navigation_closeMenu") : t("navigation_openMenu")
        }
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={styles.hamburgerMenu}
      >
        <IoIosMenu />
      </button>
      {isMenuOpen ? (
        <div className={styles.mobileContainer}>
          <div
            className={styles.mobileContentBlur}
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <ul className={styles.mobileNavIconLinks}>
            {renderMobileNavCloseButton()}
            {renderMobileNavItems()}
            <li key="theme" className={styles.navIconLink}>
              <ThemeButton />
            </li>
            {renderAuthButtons()}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default MobileNav;
