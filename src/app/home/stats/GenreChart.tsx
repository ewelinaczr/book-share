import { getTranslations } from "next-intl/server";
import { popularBookGenres } from "../marketPanel/search/searchConfig";
import PieChartGraph from "@/app/statsGraphs/PieChartGraph";

export default async function GenreChart({
  categoryCounts,
}: {
  categoryCounts: Record<string, number>;
}) {
  const t = await getTranslations();
  const labelToKey = Object.fromEntries(
    popularBookGenres.map((g) => [g.label, g.key])
  );

  const translatedCategoryCounts = Object.entries(categoryCounts).reduce(
    (acc, [label, count]) => {
      const key = labelToKey[label];
      const display = key ? t(`genre_${key}`) : label;
      acc[display] = count;
      return acc;
    },
    {} as Record<string, number>
  );

  return <PieChartGraph data={translatedCategoryCounts} outerRadius={80} />;
}
