import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useGetUserPhotoQuery } from "@/api/userApi";
import { MarketBookStatus } from "@/interfaces/MarketBook";
import { toast } from "react-toastify";
import Button, { ButtonType } from "@/components/buttons/Button";
import TextArea from "@/components/textArea/TextArea";
import styles from "./BookMarketPanel.module.css";

interface MessageOwnerSectionProps {
  ownerName?: string;
  ownerId?: string;
  currentUserId?: string;
  socketRef: React.MutableRefObject<any>;
  status?: MarketBookStatus;
}

export default function MessageOwnerSection({
  ownerName,
  ownerId,
  currentUserId,
  socketRef,
  status,
}: MessageOwnerSectionProps) {
  const t = useTranslations();
  const [message, setMessage] = useState("");

  const {
    data: photoDataUrl,
    isLoading,
    isError,
  } = useGetUserPhotoQuery(ownerId ?? "", { skip: !ownerId });

  const sendMessage = () => {
    if (!message.trim() || !ownerId || !currentUserId) return;
    socketRef.current?.emit(
      "private message",
      {
        from: currentUserId,
        to: ownerId.toString(),
        message,
        timestamp: new Date().toISOString(),
      },
      (response: { status: string; error: string }) => {
        if (response.status === "ok") {
          toast.success(t("chat_sendSuccess"));
        } else {
          toast.error(t("chat_sendError"));
        }
      },
    );
    setMessage("");
  };

  const getMessagePlaceholder = () => {
    switch (status) {
      case MarketBookStatus.BORROW:
        return t("market_message_borrow");
      case MarketBookStatus.CLAIM:
        return t("market_message_claim");
      case MarketBookStatus.TRADE:
        return t("market_message_trade");
      default:
        return "";
    }
  };

  const renderOwnerInfo = () => {
    return (
      <div className={styles.info}>
        <p className={styles.infoLabel}>{t("market_owner")}</p>
        <div className={styles.profileContainer}>
          <div className={styles.profilePhoto}>
            {photoDataUrl && !isLoading && !isError ? (
              <img
                src={photoDataUrl}
                alt="Profile photo"
                className={styles.image}
              />
            ) : (
              <div className={styles.imagePlaceholder} />
            )}
          </div>
          <span>{ownerName}</span>
        </div>
      </div>
    );
  };

  const renderMessageInput = () => {
    return (
      <div className={styles.info}>
        <p className={styles.infoLabel}>{t("market_contactOwner")}</p>
        <TextArea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={getMessagePlaceholder()}
        />
      </div>
    );
  };

  return (
    <div className={styles.section}>
      {renderOwnerInfo()}
      {renderMessageInput()}
      <Button
        type="submit"
        ariaLabel={t("chat_sendToOwnerAria")}
        buttonType={ButtonType.PRIMARY}
        onClick={sendMessage}
        customStyles={{ marginTop: "0.6rem" }}
      >
        {ownerName ? t("market_messageOwner", { owner: ownerName }) : ""}
      </Button>
    </div>
  );
}
