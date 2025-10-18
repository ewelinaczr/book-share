"use client";
import React from "react";
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
  if (!chatUsers) {
    return <div aria-live="polite">No conversations available</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Messages</div>
      {chatUsers.map((user) => {
        const isSelected =
          user.googleId === selectedChatUserId ||
          user._id === selectedChatUserId;
        return (
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
        );
      })}
    </div>
  );
}

export default Users;
