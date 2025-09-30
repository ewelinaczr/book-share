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
    return <div>No conversations available</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Messages</div>
      {chatUsers.map((user) => (
        <div
          key={user._id}
          className={
            user.googleId === selectedChatUserId ||
            user._id === selectedChatUserId
              ? styles.selected
              : styles.item
          }
          onClick={() => setSelectedChatUserId(user.googleId ?? user._id)}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}

export default Users;
