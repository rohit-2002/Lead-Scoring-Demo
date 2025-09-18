import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  High: "#22c55e", 
  Medium: "#eab308",
  Low: "#ef4444", 
};

const IntentChart = ({ results = [] }) => {
  const data = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    results.forEach((r) => {
      if (r.intent in counts) counts[r.intent]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [results]);

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3 className="font-semibold mb-2">Intent Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IntentChart;
