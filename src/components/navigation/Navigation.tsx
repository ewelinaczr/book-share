"use client";

import Link from "next/link";
import styles from "./Navigation.module.css";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logoutUser } from "@/api/logoutApi";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Home", path: "home" },
  { name: "My Bookshelf", path: "bookshelf" },
  { name: "Browse", path: "browse" },
];
const navIconLinks = [
  { name: "Notifications", path: "notifications" },
  { name: "Messages", path: "messages" },
  { name: "Profile", path: "profile" },
];

export default function Navigation() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.refresh();
  };

  return (
    <nav className={styles.navigationBar}>
      <ul className={styles.navLinks}>
        {navLinks.map((link) => (
          <li key={link.name} className={styles.navLink}>
            <Link href={`/${link.path}`}>{link.name}</Link>
          </li>
        ))}
      </ul>
      <ul className={styles.navIconLinks}>
        {navIconLinks.map((link) => (
          <li key={link.name} className={styles.navLink}>
            <Link href={`/${link.path}`}>{link.name}</Link>
          </li>
        ))}
        {!loading &&
          (user ? (
            <li className={styles.navLink}>
              <button onClick={handleLogout}>Log out</button>
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
          ))}
      </ul>
    </nav>
  );
}
