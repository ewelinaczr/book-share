"use client";
import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { fallbackColor, rankedColors } from "./utils";

interface MonthlyReadingData {
  month: string;
  count: number;
}

interface DotGraphProps {
  data: MonthlyReadingData[];
  labelX?: string;
  labelY?: string;
}

function DotGraph({
  data,
  labelX = "Month",
  labelY = "Books Read",
}: DotGraphProps) {
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
        <ScatterChart margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
          <CartesianGrid />
          <XAxis
            type="category"
            dataKey="month"
            name="Month"
            label={{
              value: labelX,
              position: "insideBottom",
              offset: -15,
              style: { fill: "#000000" },
            }}
          />
          <YAxis
            type="number"
            dataKey="count"
            name="Books Read"
            label={{
              value: labelY,
              angle: -90,
              position: "insideLeft",
              offset: 15,
              style: { fill: "#000000", textAnchor: "middle" },
            }}
            allowDecimals={false}
          />
          <Scatter name="Monthly Reads" data={data}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={rankedColors[index] || fallbackColor}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DotGraph;
