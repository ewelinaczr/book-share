"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetChatHistoryQuery, useGetChatPartnersQuery } from "@/api/chatApi";
import { useTranslations } from "next-intl";
import { IoChevronBackCircle } from "react-icons/io5";
import Users from "./chat/Users";
import Chat from "./chat/Chat";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import styles from "./Chat.module.css";

export interface PrivateMessage {
  _id?: string;
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
  } = useGetChatPartnersQuery(undefined);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Clear messages when selected user changes
    setChatMessages([]);
  }, [selectedChatUserId]);

  useEffect(() => {
    const userFromQuery = searchParams?.get("user") ?? "";
    if (userFromQuery && userFromQuery !== selectedChatUserId) {
      setSelectedChatUserId(userFromQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedChatUserId) {
      router.replace(`/chat?user=${selectedChatUserId}`);
    } else {
      router.replace(`/chat`);
    }
  }, [selectedChatUserId, router]);

  useEffect(() => {
    if (messages) {
      setChatMessages(messages);
    }
  }, [messages]);

  const isLoading = isMessagesLoading || isChatPartnersLoading;
  const isError = messagesError || chatPartnersError;

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
      <Users
        chatUsers={partners}
        selectedChatUserId={selectedChatUserId}
        setSelectedChatUserId={(id: string) => setSelectedChatUserId(id)}
      />
      {selectedChatUserId ? (
        <div className={styles.chatWrapper}>
          <div className={styles.buttonWrapper}>
            <button
              className={styles.backButton}
              onClick={() => setSelectedChatUserId("")}
            >
              <IoChevronBackCircle className={styles.backButtonIcon} />
            </button>
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
