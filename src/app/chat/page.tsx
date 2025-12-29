"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetChatHistoryQuery, useGetChatPartnersQuery } from "@/api/chatApi";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Users from "./chat/Users";
import Chat from "./chat/Chat";
import styles from "./Chat.module.css";
import Button, { ButtonType } from "@/components/buttons/Button";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import Header from "@/components/headers/Header";
import LogInRedirect from "@/components/loginRedirect/LogInRedirect";

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
  const { data: session } = useSession();
  const currentUserId = session?.user.id;

  const {
    data: messages,
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useGetChatHistoryQuery(selectedChatUserId, {
    skip: !selectedChatUserId || !currentUserId,
  });

  const {
    data: partners,
    isLoading: isChatPartnersLoading,
    error: chatPartnersError,
  } = useGetChatPartnersQuery(undefined, { skip: !currentUserId });

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
    // One-time initial sync
    if (!chatMessages.length && messages) {
      setChatMessages(messages);
    }
  }, [messages]);

  const isLoading = isMessagesLoading || isChatPartnersLoading;
  const isError = messagesError || chatPartnersError;

  if (!currentUserId) {
    return (
      <main className={styles.container}>
        <Header label={t("chat_messages")} />
        <LogInRedirect />
      </main>
    );
  }

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
