export default function KpiCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: accent ? "var(--color-gold-light)" : "var(--color-surface-2)",
      borderRadius: "var(--radius-md)",
      padding: "16px 20px",
      border: `1px solid ${accent ? "var(--color-border-strong)" : "var(--color-border)"}`,
    }}>
      <div style={{ fontSize: 11, color: "var(--color-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontFamily: "var(--font-display)", fontWeight: 400, color: accent ? "var(--color-gold-dark)" : "var(--color-text-primary)", marginBottom: 4 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{sub}</div>
      )}
    </div>
  );
}
