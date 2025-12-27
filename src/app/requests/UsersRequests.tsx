import React from "react";
import { useGetRequestsMineQuery } from "@/api/marketApi";
import { MarketBook, RequestMarketBook } from "@/interfaces/MarketBook";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import RequestCard from "./RequestCard";
import Header from "@/components/headers/Header";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import styles from "./Requests.module.css";

const UsersRequests: React.FC = () => {
  const { data: requests, isLoading, isError } = useGetRequestsMineQuery();
  const t = useTranslations();
  const { data: session } = useSession();
  const currentUserId = session?.user.id;

  if (isLoading) {
    return (
      <div>
        <Header label={t("requests_mine")} />
        <div className={styles.loaderContainer}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <section className={styles.errorContainer}>
        <Header label={t("requests_mine")} />
        <div>{t("requests_error")}</div>
      </section>
    );
  }

  if (!requests || requests.length === 0)
    return (
      <div>
        <Header label={t("requests_mine")} />
        <p>{t("requests_empty")}</p>
      </div>
    );

  return (
    <>
      <Header label={t("requests_mine")} />
      <ul className={styles.requestsList}>
        {requests.map((book: MarketBook) =>
          book.pendingRequests
            .filter((req) => req.userId._id === currentUserId)
            ?.map((req: RequestMarketBook) => (
              <li key={req._id}>
                <RequestCard request={req} book={book} />
              </li>
            ))
        )}
      </ul>
    </>
  );
};

export default UsersRequests;
