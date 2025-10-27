import Button, { ButtonType } from "@/components/buttons/Button";
import { useTranslations } from "next-intl";
import styles from "./LogInForm.module.css";

export function LoginActions({ isSubmitting }: { isSubmitting: boolean }) {
  const t = useTranslations();

  return (
    <div className={styles.buttonContainer}>
      <Button
        type="submit"
        ariaLabel={t("buttons_logIn")}
        disabled={isSubmitting}
        buttonType={ButtonType.PRIMARY}
      >
        {isSubmitting ? t("login_loggingIn") : t("buttons_logIn")}
      </Button>
    </div>
  );
}
