import Link from "next/link";
import styles from "./Navigation.module.css";

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
      </ul>
    </nav>
  );
}
