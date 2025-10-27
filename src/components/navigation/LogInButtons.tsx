import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Button, { ButtonType } from "../buttons/Button";

function LogInButtons() {
  const t = useTranslations();

  return (
    <>
      <li key="signUpButton">
        <Link href="/signup">
          <Button
            type="button"
            ariaLabel={t("navigation_signUp")}
            buttonType={ButtonType.SECONDARY}
            customStyles={{ minWidth: "10rem" }}
          >
            {t("navigation_signUp")}
          </Button>
        </Link>
      </li>
      <li key="logInButton">
        <Link href="/login">
          <Button
            type="button"
            ariaLabel={t("navigation_logIn")}
            buttonType={ButtonType.PRIMARY}
            customStyles={{ minWidth: "10rem" }}
          >
            {t("navigation_logIn")}
          </Button>
        </Link>
      </li>
    </>
  );
}

export default LogInButtons;
