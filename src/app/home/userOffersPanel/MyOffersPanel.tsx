import { MarketBook } from "@/interfaces/MarketBook";
import { useTranslations } from "next-intl";
import { useRenderLabels } from "./useLabels";
import { useRenderFooters } from "./useFooters";
import { getBookData } from "./getBookData";
import { useEditButton } from "./useEditButton";
import { useDeleteButton } from "./useDeleteButton";
import BookListPanel from "@/components/bookListPanel/BookListPanel";

export default function MyOffersPanel({
  books,
  setItemToEdit,
}: {
  books: MarketBook[];
  setItemToEdit: (item: string) => void;
}) {
  const t = useTranslations();
  const { renderStatusLabel } = useRenderLabels();
  const { renderOfferTypeFooter } = useRenderFooters();
  const { renderEditButton } = useEditButton(setItemToEdit);
  const { renderDeleteButton } = useDeleteButton();

  return (
    <BookListPanel<MarketBook>
      title={t("market_myMarketOffers")}
      books={books}
      getData={getBookData}
      renderLabel={renderStatusLabel}
      renderFooter={renderOfferTypeFooter}
      renderEditButton={renderEditButton}
      renderDeleteButton={renderDeleteButton}
    />
  );
}
