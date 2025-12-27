import React from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import styles from "./LogInRedirect.module.css";

function LogInRedirect() {
  const { data: session } = useSession();
  const currentUserId = session?.user.id;
  const t = useTranslations();
  const router = useRouter();

  if (currentUserId) {
    return null;
  }
  return (
    <div>
      <button className={styles.button} onClick={() => router.push("/login")}>
        {t("navigation_logIn")}
      </button>
      {t("welcome_logIn")}
    </div>
  );
}

export default LogInRedirect;
