import { IMarketBook } from "@interfaces/MarketBook";
import { useTranslations } from "next-intl";
import { useRenderLabels } from "./useLabels";
import { useRenderFooters } from "./useFooters";
import { getBookData } from "./getBookdata";
import BookListPanel from "@/components/bookListPanel/BookListPanel";

export default function BorrowedPanel({ books }: { books: IMarketBook[] }) {
  const t = useTranslations();
  const { renderProgressLabel } = useRenderLabels();
  const { renderMessageOwnerFooter } = useRenderFooters();

  return (
    <BookListPanel<IMarketBook>
      title={t("market_borrowedBooks")}
      books={books}
      getData={getBookData}
      renderLabel={renderProgressLabel}
      renderFooter={renderMessageOwnerFooter}
    />
  );
}
