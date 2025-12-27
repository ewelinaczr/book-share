"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Header from "@/components/headers/Header";
import ProfilePhoto from "@/components/photoUpload/ProfilePhoto";
import styles from "./Profile.module.css";

function page() {
  const t = useTranslations();
  const { data: session } = useSession();

  return (
    <main className={styles.container}>
      <div className={styles.setting}>
        <Header label={t("profile_title")} />
        <ProfilePhoto />
        <div className={styles.inputContainer}>
          <p>{t("profile_name")}</p>
          <input
            type="text"
            disabled
            value={session?.user.name ?? ""}
            className={styles.input}
          />
        </div>
        <div className={styles.inputContainer}>
          <p>{t("profile_email")}</p>
          <input
            type="text"
            disabled
            value={session?.user.email ?? ""}
            className={styles.input}
          />
        </div>
      </div>
    </main>
  );
}

export default page;
