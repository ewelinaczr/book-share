import { MarketBook } from "@/interfaces/MarketBook";
import { useTranslations } from "next-intl";
import { useRenderLabels } from "./useLabels";
import { useRenderFooters } from "./useFooters";
import { getBookData } from "./getBookData";
import { useMessageButton } from "./useMessageButton";
import BookListPanel from "@/components/bookListPanel/BookListPanel";

export default function BorrowedPanel({ books }: { books: MarketBook[] }) {
  const t = useTranslations();
  const { renderProgressLabel } = useRenderLabels();
  const { renderMessageOwnerFooter } = useRenderFooters();
  const { renderMessageButton } = useMessageButton((item: MarketBook) =>
    t("market_contact", {
      userName: item.ownerId.name ?? "",
    })
  );

  return (
    <BookListPanel<MarketBook>
      title={t("market_borrowedBooks")}
      books={books}
      getData={getBookData}
      renderLabel={renderProgressLabel}
      renderFooter={renderMessageOwnerFooter}
      renderMessageButton={renderMessageButton}
    />
  );
}
