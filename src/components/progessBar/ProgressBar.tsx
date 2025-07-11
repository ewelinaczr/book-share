import React from "react";
import styles from "./ProgessBar.module.css";

interface ProgressBarProps {
  startDate: string;
  deadline: string;
}

function ProgressBar({ startDate, deadline }: ProgressBarProps) {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(deadline);

  const totalMs = end.getTime() - start.getTime();
  const elapsedMs = today.getTime() - start.getTime();
  const totalDays = Math.ceil(totalMs / (1000 * 3600 * 24));
  const elapsedDays = Math.max(0, Math.ceil(elapsedMs / (1000 * 3600 * 24)));
  const daysLeft = Math.max(0, totalDays - elapsedDays);

  const progress = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));

  return (
    <div className={styles.container}>
      <div className={styles.progress} style={{ width: `${progress}%` }} />
      <div className={styles.label}>{daysLeft} days left</div>
    </div>
  );
}

export default ProgressBar;
