import { useState } from "react";
import { api } from "../../lib/api";

export default function BookingModal({ room, onClose, onSuccess, initialCheckIn = "", initialCheckOut = "" }) {
  const [form, setForm] = useState({ checkIn: initialCheckIn, checkOut: initialCheckOut });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.round((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000))
    : 0;

  const handleSubmit = async () => {
    if (!form.checkIn || !form.checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    if (nights <= 0) {
      setError("Check-out must be after check-in.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const booking = await api.createBooking({ ...form, roomId: room.id });
      onSuccess?.(booking);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(26,24,20,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#ffffff",
        borderRadius: 12,
        padding: "28px 32px",
        width: "100%", maxWidth: 420,
        border: "0.5px solid #e8e4dc",
      }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22, fontWeight: 400, marginBottom: 4,
          }}>
            Book {room.name}
          </h2>
          <p style={{ fontSize: 13, color: "#a09888" }}>
            Room {room.id} · Floor {room.floor} · €{room.price}/night
          </p>
        </div>

        {/* Dates */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={labelStyle}>
            Check-in
            <input
              type="date"
              value={form.checkIn}
              min={new Date().toISOString().slice(0, 10)}
              onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Check-out
            <input
              type="date"
              value={form.checkOut}
              onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))}
              style={inputStyle}
            />
          </label>
        </div>

        {/* Price summary */}
        {nights > 0 && (
          <div style={{
            marginTop: 16, padding: "10px 14px",
            background: "#f5edde",
            borderRadius: 6,
            fontSize: 13,
            display: "flex", justifyContent: "space-between",
          }}>
            <span style={{ color: "#6b6456" }}>{nights} night{nights > 1 ? "s" : ""}</span>
            <span style={{ fontWeight: 500, color: "#8a6e3e" }}>
              €{(nights * room.price).toLocaleString()} total
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 12, padding: "8px 12px",
            background: "#fdf0ee",
            color: "#c9503a",
            borderRadius: 6,
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: 10,
            border: "0.5px solid #e8e4dc",
            borderRadius: 6,
            background: "transparent",
            color: "#6b6456",
            fontSize: 13, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} style={{
            flex: 2, padding: 10,
            border: "0.5px solid #d0cab8",
            borderRadius: 6,
            background: "#f5edde",
            color: "#8a6e3e",
            fontSize: 13, fontWeight: 500, cursor: "pointer",
            opacity: loading ? 0.7 : 1,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {loading ? "Booking…" : "Confirm booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "flex", flexDirection: "column", gap: 5,
  fontSize: 12, color: "#6b6456",
};

const inputStyle = {
  padding: "8px 10px",
  border: "0.5px solid #e8e4dc",
  borderRadius: 6,
  background: "#faf9f7",
  color: "#1a1814",
  fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  width: "100%",
};