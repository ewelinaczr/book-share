"use client";

import React from "react";
import { useTranslations } from "next-intl";
import UsersRequests from "./UsersRequests";
import IncomingRequestsList from "./IncomingRequests";
import styles from "./Requests.module.css";

function RequestsPage() {
  const t = useTranslations();

  return (
    <main className={styles.container}>
      <UsersRequests />
      <IncomingRequestsList />
    </main>
  );
}

export default RequestsPage;
