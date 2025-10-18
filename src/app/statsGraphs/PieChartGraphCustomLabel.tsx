export const PieChartGraphCustomLabel = (props: any) => {
  const {
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    index,
    fill, // slice color
  }: {
    cx: number;
    cy: number;
    midAngle?: number;
    outerRadius: number | string;
    name: string;
    index: number;
    fill: string;
  } = props;

  if (typeof midAngle !== "number" || index >= 5) return null;

  const RADIAN = Math.PI / 180;

  // Offset distances
  const lineLength = Number(outerRadius) + 30;
  const textOffset = Number(outerRadius) + 45;

  // Line end coordinates
  const lineX = cx + lineLength * Math.cos(-midAngle * RADIAN);
  const lineY = cy + lineLength * Math.sin(-midAngle * RADIAN);

  // Text coordinates
  const textX = cx + textOffset * Math.cos(-midAngle * RADIAN);
  const textY = cy + textOffset * Math.sin(-midAngle * RADIAN);

  // Clean and split name
  const rawName = name.includes("&") ? name.split("&")[0].trim() : name.trim();

  const lines = rawName.includes("-")
    ? rawName.split("-").map((line) => line.trim())
    : rawName.length > 10
    ? rawName.split(" ")
    : [rawName];

  return (
    <>
      <line
        x1={cx}
        y1={cy}
        x2={lineX}
        y2={lineY}
        stroke={fill}
        strokeWidth={1}
      />
      <text
        x={textX}
        y={textY}
        fill="var(--text-color)"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="1.2rem"
      >
        {lines.map((line, i) => (
          <tspan key={i} x={textX} dy={i === 0 ? 0 : "1.2rem"}>
            {line}
          </tspan>
        ))}
      </text>
    </>
  );
};
