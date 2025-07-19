"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery, useLogoutMutation } from "@/api/userApi";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { BsEnvelope } from "react-icons/bs";
import styles from "./Navigation.module.css";
import Button, { ButtonType } from "../buttons/Button";

const navLinks = [
  { name: "Home", path: "home" },
  { name: "My Bookshelf", path: "bookshelf" },
  { name: "Browse", path: "browse" },
];
const navIconLinks = [
  {
    name: "Notifications",
    path: "notifications",
    icon: <IoNotificationsOutline />,
  },
  { name: "Messages", path: "messages", icon: <BsEnvelope /> },
  { name: "Profile", path: "profile", icon: <FiUser /> },
];

export default function Navigation() {
  const { data, refetch } = useGetCurrentUserQuery();
  const [logout] = useLogoutMutation();
  const router = useRouter();
  const [selectedPage, setSelectedPage] = useState("Home");

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      await refetch(); // Refetch user data after logout
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderButton = () => {
    return data ? (
      <li className={styles.navLink}>
        <Button buttonType={ButtonType.PRIMARY} onClick={handleLogout}>
          Log out
        </Button>
      </li>
    ) : (
      <>
        <li className={styles.navLink}>
          <Link href="/login">Log in</Link>
        </li>
        <li className={styles.navLink}>
          <Link href="/signup">Sign up</Link>
        </li>
      </>
    );
  };

  return (
    <nav className={styles.navigationBar}>
      <ul className={styles.navLinks}>
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={`/${link.path}`}
              onClick={() => setSelectedPage(link.name)}
            >
              <div
                className={`${
                  link.name === selectedPage ? styles.selected : ""
                } ${styles.navLink}`}
              >
                {link.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <ul className={styles.navIconLinks}>
        {navIconLinks.map((link) => (
          <li key={link.name} className={styles.navIconLink}>
            <Link href={`/${link.path}`} className={styles.round}>
              <div className={styles.notification}></div>
              <div>{link.icon}</div>
            </Link>
          </li>
        ))}
        {renderButton()}
      </ul>
    </nav>
  );
}
