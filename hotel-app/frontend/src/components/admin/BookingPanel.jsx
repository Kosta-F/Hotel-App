import { useState, useEffect } from "react";

export default function BookingPanel({ booking, onClose, onStatusChange, onPaidChange, onNotesChange }) {
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    setNotes(booking?.notes || "");
    setNotesSaved(false);
  }, [booking?.id]);

  if (!booking) return null;

  const nights = Math.round(
    (new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000
  );

  // const formatDate = (dateStr) => {
  //   if (!dateStr) return "";
  //   const d = new Date(dateStr + "T00:00:00");
  //   return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  // };
  const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return ""; // guard against invalid input
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

  const handleSaveNotes = async () => {
    await onNotesChange(booking.id, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const STATUS_STYLES = {
    "reserved":    { bg: "#f9f2e6", text: "#b8965a", label: "Reserved" },
    "checked-in":  { bg: "#edf7f3", text: "#2e7d5e", label: "Checked in" },
    "checked-out": { bg: "#f4f2ee", text: "#a09888", label: "Checked out" },
    "cancelled":   { bg: "#fdf0ee", text: "#c9503a", label: "Cancelled" },
  };

  const st = STATUS_STYLES[booking.status] || STATUS_STYLES["reserved"];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(26,24,20,0.2)",
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 360, zIndex: 201,
        background: "#ffffff",
        borderLeft: "0.5px solid #e8e4dc",
        boxShadow: "-4px 0 24px rgba(26,24,20,0.08)",
        display: "flex", flexDirection: "column",
        overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "0.5px solid #e8e4dc",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, fontWeight: 400, marginBottom: 2,
            }}>
              Booking {booking.id}
            </h2>
            <p style={{ fontSize: 12, color: "#a09888" }}>Room {booking.roomId}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: "50%",
              border: "0.5px solid #e8e4dc",
              background: "#faf9f7",
              cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Guest */}
          <div style={sectionStyle}>
            <Label>Guest</Label>
            <Value>{booking.guest}</Value>
          </div>

          {/* Room */}
          <div style={sectionStyle}>
            <Label>Room</Label>
            <Value>Room {booking.roomId}{booking.room ? ` — ${booking.room.name}` : ""}</Value>
            {booking.room && <Sub>Floor {booking.room.floor} · {booking.room.type}</Sub>}
          </div>

          {/* Dates */}
          <div style={sectionStyle}>
            <Label>Dates</Label>
            <Value>{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</Value>
            <Sub>{nights} night{nights > 1 ? "s" : ""}</Sub>
          </div>

          {/* Total */}
          <div style={sectionStyle}>
            <Label>Total</Label>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28, fontWeight: 400, color: "#8a6e3e",
            }}>
              €{booking.total?.toLocaleString()}
            </div>
          </div>

          {/* Payment */}
          <div style={sectionStyle}>
            <Label>Payment</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
              <span style={{
                fontSize: 12, padding: "3px 10px", borderRadius: 4,
                background: booking.paid ? "#edf7f3" : "#fdf0ee",
                color: booking.paid ? "#2e7d5e" : "#c9503a",
                fontWeight: 500,
              }}>
                {booking.paid ? "Paid" : "Unpaid"}
              </span>
              <button
                onClick={() => onPaidChange(booking.id, !booking.paid)}
                style={{
                  fontSize: 12, padding: "3px 10px",
                  border: "0.5px solid #d0cab8",
                  borderRadius: 4, background: "#faf9f7",
                  color: "#6b6456", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Mark as {booking.paid ? "unpaid" : "paid"}
              </button>
            </div>
          </div>

          {/* Status */}
          <div style={sectionStyle}>
            <Label>Status</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
              <span style={{
                fontSize: 12, padding: "3px 10px", borderRadius: 4,
                background: st.bg, color: st.text, fontWeight: 500,
              }}>
                {st.label}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {booking.status === "reserved" && (
                <ActionBtn onClick={() => onStatusChange(booking.id, "checked-in")}>Check in</ActionBtn>
              )}
              {booking.status === "checked-in" && (
                <ActionBtn onClick={() => onStatusChange(booking.id, "checked-out")}>Check out</ActionBtn>
              )}
              {(booking.status === "reserved" || booking.status === "checked-in") && (
                <ActionBtn danger onClick={() => onStatusChange(booking.id, "cancelled")}>Cancel</ActionBtn>
              )}
            </div>
          </div>

          {/* Notes */}
          <div style={sectionStyle}>
            <Label>Notes</Label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about this booking..."
              rows={4}
              style={{
                width: "100%",
                marginTop: 6,
                padding: "8px 10px",
                border: "0.5px solid #e8e4dc",
                borderRadius: 6,
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                color: "#1a1814",
                background: "#faf9f7",
                outline: "none",
                resize: "vertical",
                lineHeight: 1.5,
              }}
            />
            <button
              onClick={handleSaveNotes}
              style={{
                marginTop: 8,
                padding: "5px 14px",
                fontSize: 12,
                border: "0.5px solid #b8965a",
                borderRadius: 4,
                background: notesSaved ? "#edf7f3" : "#f5edde",
                color: notesSaved ? "#2e7d5e" : "#8a6e3e",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {notesSaved ? "Saved!" : "Save notes"}
            </button>
          </div>

          {/* Booked on */}
          {booking.createdAt && (
            <div style={sectionStyle}>
              <Label>Booked on</Label>
              <Sub>{formatDate(new Date(booking.createdAt).toISOString().slice(0, 10))}</Sub>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Label({ children }) {
  return (
    <div style={{
      fontSize: 11, color: "#a09888",
      letterSpacing: "0.06em", textTransform: "uppercase",
      marginBottom: 4,
    }}>
      {children}
    </div>
  );
}

function Value({ children }) {
  return <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1814" }}>{children}</div>;
}

function Sub({ children }) {
  return <div style={{ fontSize: 12, color: "#a09888", marginTop: 2 }}>{children}</div>;
}

function ActionBtn({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px", fontSize: 12,
        border: `0.5px solid ${danger ? "#c9503a" : "#d0cab8"}`,
        borderRadius: 4, background: "transparent",
        color: danger ? "#c9503a" : "#6b6456",
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {children}
    </button>
  );
}

const sectionStyle = {
  borderBottom: "0.5px solid #e8e4dc",
  paddingBottom: 16,
};