"use client";

import Link from "next/link";
import { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoCloseCircleSharp } from "react-icons/io5";
import { abrilFatface, navIconLinks, navLinks } from "./navigationConfig";
import { signOut, useSession } from "next-auth/react";

import styles from "./Navigation.module.css";
import Button, { ButtonType } from "../buttons/Button";

export default function Navigation() {
  const [selectedPage, setSelectedPage] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      signOut({ callbackUrl: "/" });
      setIsMenuOpen(false);
      setSelectedPage("Home");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const renderButton = () => {
    return session ? (
      <li key="logOutButton" className={styles.buttonLink}>
        <Button buttonType={ButtonType.PRIMARY} onClick={handleLogout}>
          Log out
        </Button>
      </li>
    ) : (
      <>
        <li key="signUpButton" className={styles.buttonLink}>
          <Link href="/signup">
            <Button
              buttonType={ButtonType.SECONDARY}
              customStyles={{ minWidth: "10rem" }}
              onClick={() => setSelectedPage("SignUp")}
            >
              Sign up
            </Button>
          </Link>
        </li>
        <li key="logInButton" className={styles.buttonLink}>
          <Link href="/login">
            <Button
              buttonType={ButtonType.PRIMARY}
              customStyles={{ minWidth: "10rem" }}
              onClick={() => setSelectedPage("LogIn")}
            >
              Log In
            </Button>
          </Link>
        </li>
      </>
    );
  };

  const renderAppName = () => {
    return (
      <Link href={"/"} onClick={() => setSelectedPage("Home")}>
        <span className={`${abrilFatface.className} ${styles.title}`}>
          BookShare
        </span>
      </Link>
    );
  };

  const renderNavLinks = () => {
    return (
      <ul className={styles.navLinks}>
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={`/${link.path}`}
              onClick={() => setSelectedPage(link.name)}
            >
              <div className={styles.navLink}>
                <p
                  className={
                    link.name === selectedPage
                      ? styles.navLinkNameSelected
                      : styles.navLinkName
                  }
                >
                  {link.name}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const renderIconNavLinks = () => {
    return (
      <ul className={styles.navIconLinks}>
        {navIconLinks.map((link) => (
          <li key={link.name} className={styles.navIconLink}>
            <Link href={`/${link.path}`} className={styles.round}>
              <div>{link.icon}</div>
            </Link>
          </li>
        ))}
        {renderButton()}
      </ul>
    );
  };

  const renderMobileNavCloseButton = () => {
    return (
      <li key={"closeButton"} className={styles.mobileCloseButtonWrapper}>
        <button
          className={styles.mobileCloseButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          <Link href={`/${link.path}`} className={styles.mobileLink}>
            <div>{link.name}</div>
          </Link>
        </li>
      );
    });
  };

  const renderMobileNavigation = () => {
    return (
      <div className={styles.hamburgerMenu}>
        <IoIosMenu
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={styles.hamburgerMenu}
        />
        {isMenuOpen ? (
          <div className={styles.mobileContainer}>
            <div
              className={styles.mobileContentBlur}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            ></div>
            <ul className={styles.mobileNavIconLinks}>
              {renderMobileNavCloseButton()}
              {renderMobileNavItems()}
              {renderButton()}
            </ul>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <nav className={styles.navigationBar}>
      {renderAppName()}
      {renderNavLinks()}
      {renderIconNavLinks()}
      {renderMobileNavigation()}
    </nav>
  );
}
