import { PageSegment } from "./PieChartGraph";

export const PieChartGraphCustomLegend = (categoryData: PageSegment[]) => (
  <ul
    style={{
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      alignItems: "flex-start",
      width: "100%",
      whiteSpace: "normal",
    }}
  >
    {categoryData.map((entry, index) => (
      <li
        key={`legend-${index}`}
        style={{
          marginBottom: 6,
          marginRight: 10,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 12,
            minWidth: 12,
            height: 12,
            backgroundColor: entry.color,
            marginRight: 4,
            borderRadius: 2,
          }}
        />
        <span style={{ fontSize: "1.4rem", whiteSpace: "nowrap" }}>
          {entry.name}: {entry.value}
        </span>
      </li>
    ))}
  </ul>
);
