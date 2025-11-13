import { IMarketBook } from "@interfaces/MarketBook";
import { FaBookOpen } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import styles from "./UserOffers.module.css";

export function useRenderFooters() {
  const t = useTranslations();

  const renderOfferTypeFooter = (book: IMarketBook) => (
    <div>
      <div className={styles.statusContainer}>
        <FaBookOpen />
        {t(`market_${book.status}`)}
      </div>
      {book.deadline && new Date(book.deadline).toLocaleDateString()}
    </div>
  );

  const renderMessageOwnerFooter = (book: IMarketBook) => (
    <div>
      <div className={styles.statusContainer}>
        <FaBookOpen />
        {t("market_borrowedFrom", {
          ownerName: book.ownerName ?? "",
          deadline: book.deadline ?? "",
        })}
      </div>
    </div>
  );

  return { renderOfferTypeFooter, renderMessageOwnerFooter };
}
