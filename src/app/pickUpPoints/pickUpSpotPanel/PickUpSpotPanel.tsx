"use client";
import React, { useState } from "react";
import styles from "./PickUpSpotPanel.module.css";
import { PickUpSpot } from "@/interfaces/PickUpSpot";
import { pacifico } from "@/app/fonts";
import { CgDetailsMore } from "react-icons/cg";
import { IoIosArrowBack } from "react-icons/io";
import WelcomePanel from "../../home/marketPanel/welcomePanel/WelcomePanel";
import { useTranslations } from "next-intl";
import SmallButton from "@/components/buttons/SmallButton";

enum Page {
  SPOT_DETAILS = "spotDetails",
  DESCRIPTION = "description",
}

export interface PickUpSpotPanelProps {
  spot: PickUpSpot | null;
}
export function PickUpSpotPanel({ spot }: PickUpSpotPanelProps) {
  const [page, setPage] = useState<Page>(Page.SPOT_DETAILS);
  const t = useTranslations();
  const renderSpotDetails = () => {
    if (!spot) {
      return null;
    }
    const { name, adress, openingHours, description, features } = spot;
    return (
      <div className={styles.pageContainer}>
        <span className={styles.title}>{name}</span>
        <div className={styles.info}>
          <p className={styles.infoLabel}>{t("pickUp_address")}</p>
          <p>{adress}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoLabel}>{t("pickUp_openingHours")}</p>
          <p>{openingHours}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoLabel}>{t("pickUp_description")}</p>
          <div className={styles.description}>
            <p className={styles.descriptionGeneral}>{description}</p>
            <p className={`${pacifico.className} ${styles.featuresTitle}`}>
              {t("pickUp_whatYoullFind")}
            </p>
            {features.map((f) => (
              <div className={styles.feature} key={f.name}>
                <p className={styles.featureName}>{f.name}</p>
                <p className={styles.featureDescription}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.button}>
          <SmallButton
            text={t("list_showNext")}
            ariaLabel={t("list_showNext")}
            icon={<CgDetailsMore />}
            aria-expanded={page === Page.DESCRIPTION}
            onClick={() => setPage(Page.DESCRIPTION)}
          />
        </div>
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
          <div className={styles.button}>
            <SmallButton
              text={t("buttons_goBack")}
              ariaLabel={t("buttons_goBackToDetails")}
              icon={<IoIosArrowBack />}
              aria-expanded={page === Page.SPOT_DETAILS}
              onClick={() => setPage(Page.SPOT_DETAILS)}
            />
          </div>
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
