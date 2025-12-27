import React from "react";

import { MarketBook, RequestMarketBook } from "@/interfaces/MarketBook";
import { useGetRequestsToMeQuery } from "@/api/marketApi";
import { useTranslations } from "next-intl";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import Header from "@/components/headers/Header";
import IncomingRequestCard from "./IncomingRequestCard";
import styles from "./Requests.module.css";

const IncomingRequestsList: React.FC = () => {
  const { data: requests, isLoading, isError } = useGetRequestsToMeQuery();
  const t = useTranslations();

  if (isLoading) {
    return (
      <div>
        <Header label={t("requests_incoming")} />
        <div className={styles.loaderContainer}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <section className={styles.errorContainer}>
        <Header label={t("requests_incoming")} />
        <div>{t("requests_error")}</div>
      </section>
    );
  }

  if (!requests || requests.length === 0)
    return (
      <div>
        <Header label={t("requests_incoming")} />
        <p>{t("requests_empty")}</p>
      </div>
    );

  return (
    <>
      <Header label={t("requests_incoming")} />
      <ul className={styles.requestsList}>
        {requests.map((book: MarketBook) =>
          book.pendingRequests?.map((req: RequestMarketBook) => (
            <li key={req._id}>
              <IncomingRequestCard request={req} book={book} />
            </li>
          ))
        )}
      </ul>
    </>
  );
};

export default IncomingRequestsList;
