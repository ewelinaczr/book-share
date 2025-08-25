import { useEffect, useState } from "react";
import styles from "./Notification.module.css";

type NotificationProps = {
  message: string;
  status: "success" | "error";
};

const Notification: React.FC<NotificationProps> = ({ message, status }) => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const notificationClass =
    status === "success"
      ? styles.notificationSuccess
      : styles.notificationError;

  return <div className={notificationClass}>{message}</div>;
};

export default Notification;
