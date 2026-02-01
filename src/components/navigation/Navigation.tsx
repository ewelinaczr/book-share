import AppName from "./AppName";
import NavLinks from "./NavLinks";
import NavIconLinks from "./NavIconLinks";
import MobileNav from "./MobileNav";
import styles from "./Navigation.module.css";

export default function Navigation() {
  return (
    <nav className={styles.navigationBar}>
      <AppName />
      <NavLinks />
      <NavIconLinks />
      <MobileNav />
    </nav>
  );
}
