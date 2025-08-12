"use client";
import React, { useState } from "react";
import styles from "./PickUpSpotPanel.module.css";
import { PickUpSpot } from "@/interfaces/PickUpSpot";
import WelcomePanel from "../welcomePanel/WelcomePanel";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

enum Page {
  SPOT_DETAILS = "spotDetails",
  DESCRIPTION = "description",
}

export interface PickUpSpotPanelProps {
  spot: PickUpSpot | null;
}
export function PickUpSpotPanel({ spot }: PickUpSpotPanelProps) {
  const [page, setPage] = useState<Page>(Page.SPOT_DETAILS);
  const renderSpotDetails = () => {
    if (!spot) {
      return null;
    }
    const { name, adress, openingHours, description, features } = spot;
    return (
      <div className={styles.pageContainer}>
        <span className={styles.title}>{name}</span>
        <div className={styles.info}>
          <p className={styles.infoLabel}>adress</p>
          <p>{adress}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoLabel}>opening hours</p>
          <p>{openingHours}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoLabel}>description</p>
          <div className={styles.description}>
            <p className={styles.descriptionGeneral}>{description}</p>
            <p className={`${pacifico.className} ${styles.featuresTitle}`}>
              What You'll Find Here
            </p>
            {features.map((f) => (
              <div className={styles.feature} key={f.name}>
                <p className={styles.featureName}>{f.name}</p>
                <p className={styles.featureDescription}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
        <span
          className={styles.showMore}
          onClick={() => setPage(Page.DESCRIPTION)}
        >
          Show more
        </span>
      </div>
    );
  };

  const renderDescriptionPage = () => {
    if (!spot) {
      return null;
    }
    const { description, features } = spot;
    return (
      <div className={styles.pageContainer}>
        <div className={styles.info}>
          <p className={styles.infoLabel}>description</p>
          <div
            className={`${styles.fullDescription} ${styles.scrollableElement}`}
          >
            <p className={styles.descriptionGeneral}>{description}</p>
            {features.map((f) => (
              <div className={styles.feature} key={f.name}>
                <p className={styles.featureName}>{f.name}</p>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
          <span
            className={styles.showMore}
            onClick={() => setPage(Page.SPOT_DETAILS)}
          >
            Go back
          </span>
        </div>
      </div>
    );
  };

  const renderPageContent = () => {
    switch (page) {
      case Page.DESCRIPTION:
        return renderDescriptionPage();
      default:
        return renderSpotDetails();
    }
  };

  if (spot) {
    return <div className={styles.container}>{renderPageContent()}</div>;
  } else {
    return (
      <div className={styles.container}>
        <WelcomePanel />
      </div>
    );
  }
}
