"use client";

import React from "react";
import { useTranslations } from "next-intl";
import UsersRequests from "./UsersRequests";
import styles from "./Requests.module.css";
import IncomingRequestsList from "./IncomingRequests";

function page() {
  const t = useTranslations();

  return (
    <main className={styles.container}>
      <UsersRequests />
      <IncomingRequestsList />
    </main>
  );
}

export default page;
