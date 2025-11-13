import React from "react";
import { useTranslations } from "next-intl";
import { MarketBookStatus } from "@interfaces/MarketBook";
import Button, { ButtonType } from "@/components/buttons/Button";
import styles from "./BookMarketPanel.module.css";

interface OfferActionSectionProps {
  status?: MarketBookStatus;
  onExchange: () => void;
}

export default function OfferActionSection({
  status,
  onExchange,
}: OfferActionSectionProps) {
  const t = useTranslations();
  if (!status) return null;

  const offer = status.charAt(0).toUpperCase() + status.slice(1);
  const text = t("market_offerBook", { offer });

  return (
    <div className={styles.section}>
      <div className={styles.info}>
        <p className={styles.infoLabel}>{text}</p>
      </div>
      <Button
        type="submit"
        ariaLabel={t("buttons_addBookToMarket")}
        buttonType={ButtonType.PRIMARY}
        onClick={onExchange}
      >
        {offer}
      </Button>
    </div>
  );
}
