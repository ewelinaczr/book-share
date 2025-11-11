import React from "react";
import Label from "@/components/label/Label";
import MessageOwnerSection from "./MessageOwnerSection";
import OfferActionSection from "./OfferActionSection";
import { GoogleBooksVolumeInfo } from "@interfaces/Book";
import { MarketBookStatus } from "@interfaces/MarketBook";
import styles from "./BookMarketPanel.module.css";

interface ActionPageProps {
  volumeInfo: GoogleBooksVolumeInfo;
  status?: MarketBookStatus;
  ownerName?: string;
  ownerId?: string;
  currentUserId?: string;
  socketRef: React.MutableRefObject<any>;
  onExchange: () => void;
}

export default function ActionPage({
  volumeInfo,
  status,
  ownerName,
  ownerId,
  currentUserId,
  socketRef,
  onExchange,
}: ActionPageProps) {
  const { title, authors } = volumeInfo;

  return (
    <section className={styles.pageContainer}>
      <div className={styles.label}>
        <Label label={status} />
      </div>
      <div className={styles.info}>
        <p className={styles.title}>{title}</p>
        {authors?.map((a) => (
          <p key={a}>{a}</p>
        ))}
      </div>
      <OfferActionSection status={status} onExchange={onExchange} />
      <MessageOwnerSection
        ownerName={ownerName}
        ownerId={ownerId}
        currentUserId={currentUserId}
        socketRef={socketRef}
      />
    </section>
  );
}
