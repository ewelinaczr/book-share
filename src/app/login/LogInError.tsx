import { useTranslations } from "next-intl";
import styles from "./LogInForm.module.css";

export function LoginError({ errorKey }: { errorKey: string }) {
  const t = useTranslations();

  if (!errorKey) return null;

  return (
    <div className={styles.error}>
      <p role="alert" id="formError">
        {t("login_invalidCredentials")}
      </p>
    </div>
  );
}
