const STATUS_STYLES = {
  "reserved":    { bg: "#f9f2e6", text: "#b8965a", label: "Reserved" },
  "checked-in":  { bg: "#edf7f3", text: "#2e7d5e", label: "Checked in" },
  "checked-out": { bg: "#f4f2ee", text: "#a09888", label: "Checked out" },
  "cancelled":   { bg: "#fdf0ee", text: "#c9503a", label: "Cancelled" },
};

export default function BookingsTable({ bookings, onStatusChange, onSelect }) {
  if (!bookings?.length) return (
    <div style={{ padding: "24px", textAlign: "center", color: "#a09888", fontSize: 13 }}>
      No bookings found.
    </div>
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #e8e4dc" }}>
            {["Guest", "Room", "Check-in", "Check-out", "Nights", "Total", "Status", ""].map((h, i) => (
              <th key={i} style={{
                padding: "8px 12px", textAlign: "left", fontSize: 11,
                fontWeight: 500, color: "#a09888",
                letterSpacing: "0.06em", textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const nights = Math.round((new Date(b.checkOut) - new Date(b.checkIn)) / 86400000);
            const st = STATUS_STYLES[b.status] || STATUS_STYLES["reserved"];
            return (
              <tr
                key={b.id}
                onClick={() => {
                  console.log("clicked", b, onSelect);
                  onSelect && onSelect(b);
                }}
                style={{
                  borderBottom: "0.5px solid #e8e4dc",
                  cursor: onSelect ? "pointer" : "default",
                }}
              >
                <td style={cellStyle}>{b.guest}</td>
                <td style={cellStyle}>
                  <span style={{ fontWeight: 500 }}>{b.roomId}</span>
                  {b.room && (
                    <span style={{ color: "#a09888", marginLeft: 6 }}>
                      — {b.room.name || b.room.type}
                    </span>
                  )}
                </td>
                <td 
                  style={cellStyle}
                  onClick={() => console.log("td clicked")}
                >
                  {b.guest}
                </td>
                <td style={cellStyle}>{b.checkIn}</td>
                <td style={cellStyle}>{b.checkOut}</td>
                <td style={{ ...cellStyle, color: "#6b6456" }}>{nights}</td>
                <td style={{ ...cellStyle, fontWeight: 500 }}>€{b.total?.toLocaleString()}</td>
                <td style={cellStyle}>
                  <span style={{
                    fontSize: 11, padding: "3px 8px", borderRadius: 4,
                    background: st.bg, color: st.text, whiteSpace: "nowrap",
                  }}>
                    {st.label}
                  </span>
                </td>
                <td style={cellStyle} onClick={e => e.stopPropagation()}>
                  {onStatusChange && b.status === "reserved" && (
                    <button
                      onClick={() => onStatusChange(b.id, "checked-in")}
                      style={actionBtnStyle}
                    >
                      Check in
                    </button>
                  )}
                  {onStatusChange && b.status === "checked-in" && (
                    <button
                      onClick={() => onStatusChange(b.id, "checked-out")}
                      style={actionBtnStyle}
                    >
                      Check out
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const cellStyle = {
  padding: "10px 12px",
  color: "#1a1814",
  whiteSpace: "nowrap",
};

const actionBtnStyle = {
  padding: "4px 10px",
  fontSize: 12,
  border: "0.5px solid #d0cab8",
  borderRadius: 4,
  background: "#faf9f7",
  color: "#6b6456",
  cursor: "pointer",
  fontFamily: "'DM Sans', sans-serif",
};