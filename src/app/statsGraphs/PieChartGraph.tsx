"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { fallbackColor, rankedColors } from "./utils";
import { PieChartGraphCustomLabel } from "./PieChartGraphCustomLabel";
import { PieChartGraphCustomLegend } from "./PieChartGraphCustomLegend";

export type PageSegment = {
  name: string;
  value: number;
  color: string;
};

interface PieChartGraphProps {
  data: Record<string, number>;
  outerRadius?: number;
  height?: number;
}

const PieChartGraph = ({
  data,
  outerRadius = 70,
  height = 250,
}: PieChartGraphProps) => {
  const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  const categoryData: PageSegment[] = sortedEntries
    .slice(0, 10)
    .map(([name, value], index) => ({
      name,
      value,
      color: rankedColors[index] || fallbackColor,
    }));

  return (
    <div
      style={{
        width: "100%",
        height: height,
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
            outerRadius={outerRadius}
            label={(props) =>
              PieChartGraphCustomLabel({ ...props, index: props.index })
            }
            labelLine={false}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div style={{ width: "40%", paddingLeft: 20 }}>
        {PieChartGraphCustomLegend(categoryData)}
      </div>
    </div>
  );
};

export default PieChartGraph;
