"use client";
import React from "react";
import { useTranslations } from "next-intl";
import styles from "./Users.module.css";

export interface UsersProps {
  chatUsers: { _id: string; name: string; googleId: string }[];
  selectedChatUserId: string;
  setSelectedChatUserId: (id: string) => void;
}
function Users({
  chatUsers,
  selectedChatUserId,
  setSelectedChatUserId,
}: UsersProps) {
  const t = useTranslations();

  if (!chatUsers) {
    return <div>{t("chat_noMessages")}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>{t("chat_messages")}</div>
      <ul className={styles.list}>
        {chatUsers.map((user) => {
          const isSelected =
            user.googleId === selectedChatUserId ||
            user._id === selectedChatUserId;
          return (
            <li key={user._id}>
              <button
                key={user._id}
                type="button"
                className={isSelected ? styles.selected : styles.item}
                onClick={() => setSelectedChatUserId(user.googleId ?? user._id)}
                aria-pressed={isSelected}
                aria-label={`Open conversation with ${user.name}`}
              >
                {user.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Users;
