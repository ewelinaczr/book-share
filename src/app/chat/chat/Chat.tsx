"use client";
import cn from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { PrivateMessage } from "../page";
import { BsSend } from "react-icons/bs";
import { MdAttachFile } from "react-icons/md";
import Button, { ButtonType } from "@/components/buttons/Button";
import TextArea from "@/components/textArea/TextArea";
import styles from "./Chat.module.css";

export interface ChatProps {
  messages: PrivateMessage[];
  selectedChatUserId: string;
  setChatMessages: React.Dispatch<React.SetStateAction<PrivateMessage[]>>;
}

export default function Chat({
  messages,
  selectedChatUserId,
  setChatMessages,
}: ChatProps) {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const currentUserId = session?.user.id;
  const socketRef = useRef<Socket | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const t = useTranslations();

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSocketEmission = useCallback(
    (msg: PrivateMessage) => {
      if (msg.from !== currentUserId) {
        setChatMessages((prev) => [...prev, msg]);
      }
    },
    [currentUserId, setChatMessages]
  );

  useEffect(() => {
    if (!session?.token) return;

    socketRef.current = io(
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
      {
        auth: { accessToken: session.token },
      }
    );
    socketRef.current?.on("private message", handleSocketEmission);
    return () => {
      socketRef.current?.off("private message", handleSocketEmission);
      socketRef.current?.disconnect();
    };
  }, [session, handleSocketEmission]);

  const sendMessage = () => {
    if (message.trim() && selectedChatUserId.trim() && currentUserId) {
      const newMessage: PrivateMessage = {
        from: currentUserId,
        to: selectedChatUserId,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };

      socketRef.current?.emit(
        "private message",
        newMessage,
        (response: any) => {
          if (response?.status === "ok") {
            setChatMessages((prev) => [...prev, response.data || newMessage]);
            setMessage("");
          } else {
            toast.error("Failed to send message");
          }
        }
      );
    }
  };

  if (!messages || !selectedChatUserId) {
    return <div className={styles.container} />;
  }

  return (
    <div className={styles.container}>
      <ul className={cn(styles.list, styles.scrollContainer)} ref={listRef}>
        {messages.map((msg, i) => {
          const currentMsgDate = new Date(msg.timestamp ?? "");
          const prevMsgDate =
            i > 0 ? new Date(messages[i - 1].timestamp ?? "") : null;

          const isNewDay =
            !prevMsgDate ||
            currentMsgDate.toDateString() !== prevMsgDate.toDateString();

          const timeString = currentMsgDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          const dateString = currentMsgDate.toLocaleDateString("en-US", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
          });

          const isOwnMessage = msg.from === currentUserId;

          return (
            <li key={i}>
              {isNewDay && (
                <div className={styles.dateDivider}>
                  <p className={styles.timestamp}>{dateString}</p>
                </div>
              )}
              <div
                className={cn(
                  styles.listItemWrapper,
                  isOwnMessage ? styles.itemOwn : styles.itemReceived
                )}
              >
                <p className={styles.timestamp}>{timeString}</p>
                <div
                  className={cn(
                    styles.listItem,
                    isOwnMessage ? styles.own : styles.received
                  )}
                >
                  {msg.message}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className={styles.action}>
        <TextArea
          value={message}
          placeholder="Write your message"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <div className={styles.buttons}>
          <Button
            type="button" // Changed from submit to button
            ariaLabel="Attach file"
            buttonType={ButtonType.SECONDARY}
            onClick={() => {}}
            customStyles={{ width: "15rem" }}
          >
            <div className={styles.buttonIcon}>
              <MdAttachFile /> {t("chat_attach")}
            </div>
          </Button>
          <Button
            type="button"
            ariaLabel="Send message"
            buttonType={ButtonType.PRIMARY}
            onClick={sendMessage}
            customStyles={{ width: "15rem" }}
          >
            <div className={styles.buttonIcon}>
              <BsSend /> {t("chat_send")}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
