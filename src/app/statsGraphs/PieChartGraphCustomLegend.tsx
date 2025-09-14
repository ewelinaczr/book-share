import { PageSegment } from "./PieChartGraph";

export const PieChartGraphCustomLegend = (categoryData: PageSegment[]) => (
  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
    {categoryData.map((entry, index) => (
      <li
        key={`legend-${index}`}
        style={{ marginBottom: 6, display: "flex", alignItems: "center" }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            backgroundColor: entry.color,
            marginRight: 8,
            borderRadius: 2,
          }}
        />
        <span style={{ fontSize: "1.4rem" }}>
          {entry.name}: {entry.value}
        </span>
      </li>
    ))}
  </ul>
);
