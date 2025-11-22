"use client";
import { useEffect, useState } from "react";
import { useGetChatHistoryQuery, useGetChatPartnersQuery } from "@/api/chatApi";
import { useTranslations } from "next-intl";
import Users from "./chat/Users";
import Chat from "./chat/Chat";
import styles from "./Chat.module.css";
import Button, { ButtonType } from "@/components/buttons/Button";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";

export interface PrivateMessage {
  from: string;
  to: string;
  message: string;
  timestamp?: string;
}

export default function Messages() {
  const [selectedChatUserId, setSelectedChatUserId] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<PrivateMessage[]>([]);
  const t = useTranslations();

  const {
    data: messages,
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useGetChatHistoryQuery(selectedChatUserId, {
    skip: !selectedChatUserId,
  });

  const {
    data: partners,
    isLoading: isChatPartnersLoading,
    error: chatPartnersError,
  } = useGetChatPartnersQuery();

  const isLoading = isMessagesLoading || isChatPartnersLoading;
  const isError = messagesError || chatPartnersError;

  useEffect(() => {
    // Clear messages when selected user changes
    setChatMessages([]);
  }, [selectedChatUserId]);

  useEffect(() => {
    // One-time initial sync
    if (!chatMessages.length && messages) {
      setChatMessages(messages);
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <section className={styles.errorContainer}>
        <div>{t("chat_error")}</div>
      </section>
    );
  }

  return (
    <div className={styles.container}>
      {!selectedChatUserId ? (
        <Users
          chatUsers={partners}
          selectedChatUserId={selectedChatUserId}
          setSelectedChatUserId={(id: string) => setSelectedChatUserId(id)}
        />
      ) : null}
      {selectedChatUserId ? (
        <div>
          <div className={styles.buttonWrapper}>
            <Button
              type="submit"
              ariaLabel="Attach file to message"
              buttonType={ButtonType.SECONDARY}
              onClick={() => setSelectedChatUserId("")}
              customStyles={{
                width: "15rem",
                marginBottom: "2rem",
              }}
            >
              Close
            </Button>
          </div>
          <Chat
            messages={chatMessages}
            selectedChatUserId={selectedChatUserId}
            setChatMessages={setChatMessages}
          />
        </div>
      ) : null}
    </div>
  );
}
