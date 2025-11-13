import { IMarketBook } from "@interfaces/MarketBook";
import { useTranslations } from "next-intl";
import { getBookData } from "./getBookdata";
import BookListPanel from "@/components/bookListPanel/BookListPanel";

export default function BorrowedFromMePanel({
  books,
}: {
  books: IMarketBook[];
}) {
  const t = useTranslations();

  return (
    <BookListPanel<IMarketBook>
      title={t("market_borrowedFromMe")}
      books={books}
      getData={getBookData}
    />
  );
}
