import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

function ItemsStatsChart({ resolvedCount, unresolvedCount, t }) {
  const total = resolvedCount + unresolvedCount;

  if (total === 0) {
    return (
      <section className="section">
        <div className="section-header">
          <h2>{t("statistics")}</h2>
        </div>
        <p>{t("noItemsYet")}</p>
      </section>
    );
  }

  const data = [
    { name: t("resolved"), value: resolvedCount },
    { name: t("unresolved"), value: unresolvedCount },
  ];

  // Colors are optional; if you want to keep it super simple, you can remove <Cell />.
  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <section className="section">
      <div className="section-header">
        <h2>{t("statistics")}</h2>
      </div>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="stats-summary">
        <strong>{t("total")}:</strong> {total}
        <span className="stats-sep">|</span>
        <strong>{t("resolved")}:</strong> {resolvedCount}
        <span className="stats-sep">|</span>
        <strong>{t("unresolved")}:</strong> {unresolvedCount}
      </div>
    </section>
  );
}

export default ItemsStatsChart;
