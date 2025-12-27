"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import UsersRequests from "./UsersRequests";
import IncomingRequestsList from "./IncomingRequests";
import Header from "@/components/headers/Header";
import LogInRedirect from "@/components/loginRedirect/LogInRedirect";
import styles from "./Requests.module.css";

function page() {
  const t = useTranslations();
  const { data: session } = useSession();
  const currentUserId = session?.user.id;

  if (!currentUserId) {
    return (
      <main className={styles.container}>
        <Header label={t("requests_books")} />
        <LogInRedirect />
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <UsersRequests />
      <IncomingRequestsList />
    </main>
  );
}

export default page;
