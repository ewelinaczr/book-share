import React from "react";
import cn from "classnames";
import { IoIosArrowBack } from "react-icons/io";
import { useTranslations } from "next-intl";
import { GoogleBooksVolumeInfo } from "@/interfaces/googleBooks/GoogleBooks";
import SmallButton from "@/components/buttons/SmallButton";
import styles from "./BookMarketPanel.module.css";

interface DescriptionPageProps {
  volumeInfo: GoogleBooksVolumeInfo;
  onGoBack: () => void;
}

export default function DescriptionPage({
  volumeInfo,
  onGoBack,
}: DescriptionPageProps) {
  const t = useTranslations();

  return (
    <section className={styles.pageContainer}>
      <div className={styles.info}>
        <div className={styles.infoLabel}>{t("bookDetails_description")}</div>
        <p className={cn(styles.fullDescription, styles.scrollableElement)}>
          {volumeInfo.description}
        </p>
        <div className={styles.button}>
          <SmallButton
            text={t("buttons_goBack")}
            icon={<IoIosArrowBack />}
            ariaLabel={t("buttons_goBackToDetails")}
            onClick={onGoBack}
          />
        </div>
      </div>
    </section>
  );
}
