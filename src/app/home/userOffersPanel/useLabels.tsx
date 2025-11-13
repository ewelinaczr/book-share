import { IMarketBook } from "@interfaces/MarketBook";
import { useTranslations } from "next-intl";
import SmallLabel from "@/components/label/SmallLabel";

export function useRenderLabels() {
  const t = useTranslations();

  const renderStatusLabel = (book: IMarketBook) => (
    <SmallLabel label={t(`market_${book.status}`)} />
  );

  const renderProgressLabel = (book: IMarketBook) => {
    const end = new Date(book.exchangedWith.date);
    const start = new Date(end);
    start.setMonth(start.getMonth() - 1);

    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const elapsedDays = Math.max(
      0,
      Math.ceil((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24))
    );
    const daysLeft = Math.max(0, totalDays - elapsedDays);

    const label =
      daysLeft === 0 ? t("market_overdue") : t("market_daysLeft", { daysLeft });

    return <SmallLabel label={label} />;
  };

  return { renderStatusLabel, renderProgressLabel };
}
