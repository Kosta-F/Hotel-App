export default function FloorRevenue({ data }) {
  if (!data) return null;
  const max = Math.max(...data.map(d => d.revenue));

  return (
    <div>
      {data.map((row) => (
        <div key={row.floor} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)", width: 56, flexShrink: 0 }}>
            {row.floor}
          </span>
          <div style={{ flex: 1, height: 6, background: "var(--color-border)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${Math.round((row.revenue / max) * 100)}%`,
              background: "var(--color-gold)",
              borderRadius: 3,
              transition: "width 0.6s ease",
            }} />
          </div>
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)", width: 58, textAlign: "right" }}>
            €{row.revenue.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
