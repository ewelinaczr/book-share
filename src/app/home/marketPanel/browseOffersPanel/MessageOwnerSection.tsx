import React, { useState } from "react";
import Button, { ButtonType } from "@/components/buttons/Button";
import { useTranslations } from "next-intl";
import TextArea from "@/components/textArea/TextArea";
import styles from "./BookMarketPanel.module.css";

interface MessageOwnerSectionProps {
  ownerName?: string;
  ownerId?: string;
  currentUserId?: string;
  socketRef: React.MutableRefObject<any>;
}

export default function MessageOwnerSection({
  ownerName,
  ownerId,
  currentUserId,
  socketRef,
}: MessageOwnerSectionProps) {
  const t = useTranslations();
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim() || !ownerId || !currentUserId) return;
    socketRef.current?.emit("private message", {
      from: currentUserId,
      to: ownerId.toString(),
      message,
      timestamp: new Date().toISOString(),
    });
    setMessage("");
  };

  return (
    <div className={styles.section}>
      <div className={styles.info}>
        <p className={styles.infoLabel}>{t("market_contactOwner")}</p>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("market_typeYourMessage")}
        />
      </div>
      <Button
        type="submit"
        ariaLabel={t("chat_sendToOwnerAria")}
        buttonType={ButtonType.PRIMARY}
        onClick={sendMessage}
      >
        {ownerName ? t("market_messageOwner", { owner: ownerName }) : ""}
      </Button>
    </div>
  );
}
