"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { fallbackColor, rankedColors } from "./utils";

interface BarChartData {
  name: string;
  value: number;
}

interface HorizontalBarGraphProps {
  data: BarChartData[];
  labelX: string;
  labelY: string;
}

function HorizontalBarGraph({ data, labelX, labelY }: HorizontalBarGraphProps) {
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  const renderYAxisTick = ({ x, y, payload }: any) => (
    <text
      x={x - 10}
      y={y}
      dy={4}
      textAnchor="end"
      fill="var(--text-color)"
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "90px",
        fontSize: "1.4rem",
      }}
    >
      {payload.value}
    </text>
  );

  return (
    <div
      style={{
        width: "100%",
        height: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.4rem",
      }}
    >
      <ResponsiveContainer>
        <BarChart
          data={sortedData}
          barGap={0}
          barCategoryGap="10%"
          layout="vertical"
          margin={{ top: 30, right: 30, left: 100, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            allowDecimals={false}
            domain={[0, "dataMax"]}
            label={{
              value: labelX,
              position: "insideBottom",
              offset: -10,
              style: { fill: "var(--text-color)", textAnchor: "middle" },
            }}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={renderYAxisTick}
            label={{
              value: labelY,
              angle: -90,
              position: "insideLeft",
              offset: -90,
              style: { fill: "var(--text-color)", textAnchor: "middle" },
            }}
          />
          <Bar dataKey="value" barSize={20}>
            {sortedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={rankedColors[index] || fallbackColor}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HorizontalBarGraph;
