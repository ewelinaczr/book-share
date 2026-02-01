import Button, { ButtonType } from "@/components/buttons/Button";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import styles from "../login/LogInForm.module.css";

export function GoogleSignupButton({
  isSubmitting,
}: {
  isSubmitting: boolean;
}) {
  const t = useTranslations();

  return (
    <Button
      type="button"
      ariaLabel={t("signup_signInWithGoogle")}
      disabled={isSubmitting}
      buttonType={ButtonType.SECONDARY}
      onClick={() => signIn("google")}
    >
      <div className={styles.googleButton}>
        <img
          className={styles.googleIcon}
          src="/google.png"
          alt="Google logo"
        />
        {t("signup_signInWithGoogle")}
      </div>
    </Button>
  );
}
