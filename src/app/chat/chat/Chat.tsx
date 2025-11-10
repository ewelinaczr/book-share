"use client";
import cn from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
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

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSocketEmission = useCallback((msg: PrivateMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!session?.token) return;

    socketRef.current = io("http://localhost:4000", {
      auth: {
        accessToken: session.token,
      },
    });
    socketRef.current?.on("private message", handleSocketEmission);
    return () => {
      socketRef.current?.off("private message", handleSocketEmission);
      socketRef.current?.disconnect();
    };
  }, [session]);

  const sendMessage = () => {
    // Emit message to server via socket
    if (message.trim() && selectedChatUserId.trim()) {
      const newMessage: PrivateMessage = {
        from: currentUserId!,
        to: selectedChatUserId,
        message: message,
        timestamp: new Date().toISOString(),
      };
      socketRef.current?.emit("private message", newMessage);
      setMessage("");
    }
  };

  if (!messages || !selectedChatUserId) {
    return <div className={styles.container} />;
  }

  return (
    <div className={styles.container}>
      <ul className={styles.list} ref={listRef}>
        {messages.map((msg, i) => {
          const isOwnMessage = msg.from === currentUserId;
          return (
            <li
              key={i}
              className={cn(
                styles.listItem,
                isOwnMessage ? styles.own : styles.received
              )}
            >
              {msg.message}
            </li>
          );
        })}
      </ul>
      <div className={styles.action}>
        <TextArea
          value={message}
          placeholder="Write your message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className={styles.buttons}>
          <Button
            type="submit"
            ariaLabel="Attach file to message"
            buttonType={ButtonType.SECONDARY}
            onClick={sendMessage}
            customStyles={{ width: "15rem" }}
          >
            <div className={styles.buttonIcon}>
              <div className={styles.iconAttach}>
                <MdAttachFile />
              </div>
              Attach
            </div>
          </Button>
          <Button
            type="submit"
            ariaLabel="Send message"
            buttonType={ButtonType.PRIMARY}
            onClick={sendMessage}
            customStyles={{ width: "15rem" }}
          >
            <div className={styles.buttonIcon}>
              <div className={styles.iconSend}>
                <BsSend />
              </div>
              Send
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
