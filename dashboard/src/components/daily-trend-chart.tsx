"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DailyData {
  date: string;
  total: number;
  successRate: number;
  tokens: number;
}

export function DailyTrendChart({ data }: { data: DailyData[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 text-sm">
        No data yet
      </div>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e35" />
          <XAxis
            dataKey="date"
            stroke="#8888a0"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis
            stroke="#8888a0"
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: "#131320",
              border: "1px solid #1e1e35",
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ color: "#e4e4eb" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="successRate"
            name="Success Rate"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 3, fill: "#22c55e" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
