"use client";
import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { fallbackColor, rankedColors } from "./utils";

type PageSegment = {
  name: string;
  value: number;
  color: string;
};

interface PieChartGraphProps {
  data: Record<string, number>;
}

const PieChartGraph = ({ data }: PieChartGraphProps) => {
  const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  const categoryData: PageSegment[] = sortedEntries.map(
    ([name, value], index) => ({
      name,
      value,
      color: rankedColors[index] || fallbackColor,
    })
  );

  const renderCustomLabel = (props: any) => {
    const {
      cx,
      cy,
      midAngle,
      outerRadius,
      percent,
      name,
    }: {
      cx: number;
      cy: number;
      midAngle?: number;
      outerRadius: number | string;
      percent?: number;
      name: string;
    } = props;

    if (typeof midAngle !== "number") return null;

    const RADIAN = Math.PI / 180;
    const radius = Number(outerRadius) + 40;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const rawName = name.includes("&")
      ? name.split("&")[0].trim()
      : name.trim();

    const lines = rawName.includes("-")
      ? rawName.split("-").map((line) => line.trim())
      : rawName.length > 10
      ? rawName.split(" ")
      : [rawName];

    return (
      <text
        x={x}
        y={y}
        fill="#000000"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="1.2rem"
      >
        {lines.map((line, index) => (
          <tspan
            key={index}
            x={x}
            dy={index === 0 ? 0 : "1.2rem"} // Adjust vertical spacing
          >
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  const renderCustomLegend = () => (
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

  return (
    <div
      style={{
        width: "100%",
        height: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ResponsiveContainer width="75%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            cx="45%"
            cy="50%"
            outerRadius={70}
            label={renderCustomLabel}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div style={{ width: "40%", paddingLeft: 20 }}>
        {renderCustomLegend()}
      </div>
    </div>
  );
};

export default PieChartGraph;
