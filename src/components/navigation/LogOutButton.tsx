import React from "react";
import Button, { ButtonType } from "../buttons/Button";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";

export default function LogOutButton() {
  const t = useTranslations();

  const handleLogout = async () => {
    try {
      signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <li key="logOutButton">
      <Button
        type="button"
        ariaLabel={t("navigation_logOut")}
        buttonType={ButtonType.SECONDARY}
        onClick={handleLogout}
      >
        {t("navigation_logOut")}
      </Button>
    </li>
  );
}
