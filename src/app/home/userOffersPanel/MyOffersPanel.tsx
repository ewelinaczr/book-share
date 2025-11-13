import { IMarketBook } from "@interfaces/MarketBook";
import { useTranslations } from "next-intl";
import { useRenderLabels } from "./useLabels";
import { useRenderFooters } from "./useFooters";
import { getBookData } from "./getBookdata";
import BookListPanel from "@/components/bookListPanel/BookListPanel";

export default function MyOffersPanel({ books }: { books: IMarketBook[] }) {
  const t = useTranslations();
  const { renderStatusLabel } = useRenderLabels();
  const { renderOfferTypeFooter } = useRenderFooters();

  return (
    <BookListPanel<IMarketBook>
      title={t("market_myMarketOffers")}
      books={books}
      getData={getBookData}
      renderLabel={renderStatusLabel}
      renderFooter={renderOfferTypeFooter}
    />
  );
}
