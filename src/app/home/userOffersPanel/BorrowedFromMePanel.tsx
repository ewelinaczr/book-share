import { MarketBook } from "@/interfaces/MarketBook";
import { useTranslations } from "next-intl";
import { getBookData } from "./getBookData";
import { useDeleteButton } from "./useDeleteButton";
import { useMessageButton } from "./useMessageButton";
import BookListPanel from "@/components/bookListPanel/BookListPanel";

export default function BorrowedFromMePanel({
  books,
}: {
  books: MarketBook[];
}) {
  const t = useTranslations();
  const { renderDeleteButton } = useDeleteButton((item: MarketBook) =>
    t("market_deleteConfirm", {
      userName: item.exchangedWith.userId.name ?? "",
    })
  );
  const { renderMessageButton } = useMessageButton((item: MarketBook) =>
    t("market_contact", {
      userName: item.exchangedWith.userId.name ?? "",
    })
  );

  return (
    <BookListPanel<MarketBook>
      title={t("market_borrowedFromMe")}
      books={books}
      getData={getBookData}
      renderDeleteButton={renderDeleteButton}
      renderMessageButton={renderMessageButton}
    />
  );
}
