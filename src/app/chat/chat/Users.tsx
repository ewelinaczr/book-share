"use client";
import React from "react";
import { useTranslations } from "next-intl";
import styles from "./Users.module.css";

interface User {
  _id: string;
  name: string;
  googleId: string;
}

export interface UsersProps {
  chatUsers: User[];
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

  const isUserSelected = (user: User) => {
    return (
      user.googleId === selectedChatUserId || user._id === selectedChatUserId
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{t("chat_messages")}</div>
      <ul className={styles.list}>
        {chatUsers.map((user) => {
          return (
            <li key={user._id}>
              <button
                key={user._id}
                type="button"
                className={isUserSelected(user) ? styles.selected : styles.item}
                onClick={() => setSelectedChatUserId(user.googleId ?? user._id)}
                aria-pressed={isUserSelected(user)}
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
