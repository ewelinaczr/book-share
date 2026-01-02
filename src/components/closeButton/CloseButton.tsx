import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import styles from "./CloseButton.module.css";

function CloseButton({ handleClose }: { handleClose: () => void }) {
  return (
    <div className={styles.closButtonContainer}>
      <button onClick={handleClose} className={styles.closeButton}>
        <span className={styles.buttonIcon}>
          <IoCloseOutline />
        </span>
      </button>
    </div>
  );
}

export default CloseButton;
