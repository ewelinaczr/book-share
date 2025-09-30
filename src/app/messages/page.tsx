"use client";
import { useEffect, useState } from "react";
import { useGetChatHistoryQuery, useGetChatPartnersQuery } from "@/api/chatApi";
import Users from "./chat/Users";
import Chat from "./chat/Chat";
import styles from "./messages.module.css";

export interface PrivateMessage {
  from: string;
  to: string;
  message: string;
  timestamp?: string;
}

function Messages() {
  const [selectedChatUserId, setSelectedChatUserId] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<PrivateMessage[]>([]);

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

  return (
    <div className={styles.container}>
      <Users
        chatUsers={partners}
        selectedChatUserId={selectedChatUserId}
        setSelectedChatUserId={(id: string) => setSelectedChatUserId(id)}
      />
      <Chat
        messages={chatMessages}
        selectedChatUserId={selectedChatUserId}
        setChatMessages={setChatMessages}
      />
    </div>
  );
}

export default Messages;
