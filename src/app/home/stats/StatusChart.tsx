import PieChartGraph from "@/app/statsGraphs/PieChartGraph";

export default function StatusChart({
  statusCounts,
}: {
  statusCounts: Record<string, number>;
}) {
  return <PieChartGraph data={statusCounts} />;
}
