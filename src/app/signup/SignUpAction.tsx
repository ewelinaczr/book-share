import Button, { ButtonType } from "@/components/buttons/Button";
import { useTranslations } from "next-intl";
import styles from "../login/LogInForm.module.css";

export function SignupActions({ isSubmitting }: { isSubmitting: boolean }) {
  const t = useTranslations();

  return (
    <div className={styles.buttonContainer}>
      <Button
        type="submit"
        ariaLabel={t("signup_signUpButton")}
        disabled={isSubmitting}
        buttonType={ButtonType.PRIMARY}
      >
        {isSubmitting ? t("signup_signingUp") : t("signup_signUpButton")}
      </Button>
    </div>
  );
}
