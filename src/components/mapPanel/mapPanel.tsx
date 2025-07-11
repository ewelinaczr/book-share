"use client";

import { useState } from "react";
import styles from "./MapPanel.module.css";
import bookPointersMock from "./bookPointersMock";

import { MapWrapper } from "../map/MapWrapper";
import { MapPopup } from "../mapPopup/MapPopup";

export function MapPanel() {
  const [previewIndex, setPreviewIndex] = useState<number | undefined>(
    undefined
  );

  return (
    <div className={styles.container}>
      <div>Map / List</div>
      <MapWrapper setPreviewIndex={setPreviewIndex} />
      <MapPopup
        preview={
          previewIndex !== undefined
            ? bookPointersMock[previewIndex]
            : undefined
        }
      />
    </div>
  );
}
