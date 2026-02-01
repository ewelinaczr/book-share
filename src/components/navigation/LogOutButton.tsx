import React from "react";
import Button, { ButtonType } from "../buttons/Button";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";

export default function LogOutButton() {
  const t = useTranslations();

  const handleLogout = async () => {
    try {
      // callbackUrl: "/" ensures the user is redirected to home after clearing the session
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error(t("navigation_logOutError"));
    }
  };

  return (
    <li key="logOutButton">
      <Button
        type="button"
        ariaLabel={t("navigation_logOut")}
        buttonType={ButtonType.SECONDARY}
        onClick={handleLogout}
        customStyles={{ minWidth: "10rem" }}
      >
        {t("navigation_logOut")}
      </Button>
    </li>
  );
}
