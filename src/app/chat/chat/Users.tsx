"use client";
import React from "react";
import cn from "classnames";
import { useTranslations } from "next-intl";
import { useGetUserPhotoQuery } from "@/api/userApi";
import Header from "@/components/headers/Header";
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

  const isAnyUserSelected = () => {
    return chatUsers.some(
      (user) =>
        user.googleId === selectedChatUserId || user._id === selectedChatUserId
    );
  };

  return (
    <div
      className={cn(styles.container, {
        [styles.containerDisplay]: isAnyUserSelected(),
      })}
    >
      <Header label={t("chat_messages")} />
      <ul className={styles.list}>
        {chatUsers.map((user) => {
          const {
            data: photoDataUrl,
            isLoading,
            isError,
          } = useGetUserPhotoQuery(user._id ?? "", { skip: !user._id });

          return (
            <li key={user._id}>
              <button
                key={user._id}
                type="button"
                className={cn(styles.item, {
                  [styles.selected]: isUserSelected(user),
                })}
                onClick={() => setSelectedChatUserId(user.googleId ?? user._id)}
                aria-pressed={isUserSelected(user)}
                aria-label={`Open conversation with ${user.name}`}
              >
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
                <span> {user.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Users;
