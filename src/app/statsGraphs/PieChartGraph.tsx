"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { fallbackColor, rankedColors } from "./utils";
import { PieChartGraphCustomLabel } from "./PieChartGraphCustomLabel";
import { PieChartGraphCustomLegend } from "./PieChartGraphCustomLegend";
import styles from "./PieChartGraph.module.css";

export type PageSegment = {
  name: string;
  value: number;
  color: string;
};

interface PieChartGraphProps {
  data: Record<string, number>;
  outerRadius?: number;
}

const PieChartGraph = ({ data, outerRadius = 70 }: PieChartGraphProps) => {
  const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  const categoryData: PageSegment[] = sortedEntries
    .slice(0, 10)
    .map(([name, value], index) => ({
      name,
      value,
      color: rankedColors[index] || fallbackColor,
    }));

  return (
    <div className={styles.container}>
      <ResponsiveContainer height="100%" className={styles.chart}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
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
      <div>{PieChartGraphCustomLegend(categoryData)}</div>
    </div>
  );
};

export default PieChartGraph;
