import Button, { ButtonType } from "@/components/buttons/Button";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import styles from "./LogInForm.module.css";

export function GoogleLoginButton({ isSubmitting }: { isSubmitting: boolean }) {
  const t = useTranslations();

  return (
    <Button
      type="button"
      ariaLabel={t("login_signUpWithGoogle")}
      disabled={isSubmitting}
      buttonType={ButtonType.SECONDARY}
      onClick={() =>
        signIn("google", {
          callbackUrl: "/",
          prompt: "select_account",
        })
      }
    >
      <div className={styles.googleButton}>
        <img
          className={styles.googleIcon}
          src="/google.png"
          alt="Google logo"
        />
        {t("login_signUpWithGoogle")}
      </div>
    </Button>
  );
}
