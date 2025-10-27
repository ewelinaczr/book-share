import { MarketBook } from "@/interfaces/MarketBook";
import { useTranslations } from "next-intl";
import { getBookData } from "./getBookdata";
import BookListPanel from "@/components/bookListPanel/BookListPanel";

export default function BorrowedFromMePanel({
  books,
}: {
  books: MarketBook[];
}) {
  const t = useTranslations();

  return (
    <BookListPanel<MarketBook>
      title={t("market_borrowedFromMe")}
      books={books}
      getData={getBookData}
    />
  );
}
