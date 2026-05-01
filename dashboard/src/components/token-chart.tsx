"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TokenData {
  date: string;
  tokens: number;
  avgDuration: number;
}

export function TokenChart({ data }: { data: TokenData[] }) {
  if (data.length === 0) return null;

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v
            }
          />
          <Tooltip
            contentStyle={{
              background: "#131320",
              border: "1px solid #1e1e35",
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Legend />
          <Bar
            dataKey="tokens"
            name="Tokens"
            fill="#6366f1"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
