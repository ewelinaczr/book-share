import { getAllMarketBooks } from "@/api/marketApiServer";
import { getTranslations } from "next-intl/server";

export async function getMarketStats() {
  const t = await getTranslations();
  const data = await getAllMarketBooks(); // server-side fetch

  const categoryCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};

  data.forEach((item) => {
    item.book?.volumeInfo.categories?.forEach((category) => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const status = t(`market_${item.status}`);
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  return { categoryCounts, statusCounts };
}
