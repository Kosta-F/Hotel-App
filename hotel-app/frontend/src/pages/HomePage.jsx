import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { api } from "../lib/api";
import RoomCard from "../components/user/RoomCard";
import BookingModal from "../components/user/BookingModal";
import RoomModal from "../components/user/RoomModal";

const TYPES = ["All", "Standard Studio", "Studio", "Studio Deluxe", "One Bedroom", "Suite"];
const today = new Date().toISOString().slice(0, 10);

export default function HomePage() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [viewingRoom, setViewingRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const { data: rooms } = useFetch(
  () => api.getRooms({
    checkIn: checkIn || today,
    checkOut: checkOut || today,
  }),
  [checkIn, checkOut]
);

  const filtered = rooms
    ? typeFilter === "All" ? rooms : rooms.filter(r => r.type === typeFilter)
    : [];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>
      {/* Hero */}
      <div style={{
        padding: "56px 40px",
        textAlign: "center",
        borderBottom: "1px solid #e8e4dc",
        marginBottom: 36,
      }}>
        <p style={{
          fontSize: 12,
          letterSpacing: "0.16em",
          color: "#b8965a",
          textTransform: "uppercase",
          marginBottom: 12,
        }}>
          Where luxury meets comfort
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 52,
          fontWeight: 300,
          lineHeight: 1.1,
          marginBottom: 16,
          color: "#1a1814",
        }}>
          Find your perfect stay<br />
          <em style={{ fontStyle: "italic", color: "#8a6e3e" }}>at Aurelia</em>
        </h1>
        <p style={{ fontSize: 15, color: "#6b6456", maxWidth: 480, margin: "0 auto 28px" }}>
          Luxury rooms in the heart of the city. Book directly for the best rates.
        </p>

        {/* Date picker */}
        <div style={{
          display: "inline-flex",
          gap: 0,
          border: "0.5px solid #d0cab8",
          borderRadius: 8,
          overflow: "hidden",
          background: "#ffffff",
        }}>
          <div style={{ padding: "10px 16px", borderRight: "0.5px solid #e8e4dc" }}>
            <div style={{ fontSize: 10, color: "#a09888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>
              Check-in
            </div>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={e => {
                setCheckIn(e.target.value);
                if (checkOut && e.target.value >= checkOut) setCheckOut("");
              }}
              style={{
                border: "none", background: "transparent",
                fontSize: 13, color: "#1a1814",
                fontFamily: "'DM Sans', sans-serif",
                outline: "none", cursor: "pointer",
              }}
            />
          </div>
          <div style={{ padding: "10px 16px" }}>
            <div style={{ fontSize: 10, color: "#a09888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>
              Check-out
            </div>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={e => setCheckOut(e.target.value)}
              style={{
                border: "none", background: "transparent",
                fontSize: 13, color: "#1a1814",
                fontFamily: "'DM Sans', sans-serif",
                outline: "none", cursor: "pointer",
              }}
            />
          </div>
          {(checkIn || checkOut) && (
            <button
              onClick={() => { setCheckIn(""); setCheckOut(""); }}
              style={{
                padding: "0 14px",
                border: "none",
                borderLeft: "0.5px solid #e8e4dc",
                background: "transparent",
                color: "#a09888",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Clear
            </button>
          )}
        </div>

        {checkIn && checkOut && (
          <p style={{ fontSize: 12, color: "#a09888", marginTop: 10 }}>
            Showing availability for {checkIn} → {checkOut}
          </p>
        )}
      </div>

      {/* Success toast */}
      {successMsg && (
        <div style={{
          marginBottom: 20, padding: "12px 16px",
          background: "#edf7f3", color: "#2e7d5e",
          borderRadius: 6, fontSize: 13,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          {successMsg}
          <button onClick={() => setSuccessMsg(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: 16 }}>×</button>
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#a09888", marginRight: 4 }}>Room type:</span>
        {TYPES.map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} style={{
            padding: "5px 14px", fontSize: 13,
            border: `1px solid ${typeFilter === t ? "#b8965a" : "#e8e4dc"}`,
            borderRadius: 4,
            background: typeFilter === t ? "#f5edde" : "#ffffff",
            color: typeFilter === t ? "#8a6e3e" : "#6b6456",
            cursor: "pointer", transition: "all 0.15s",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Rooms grid */}
      {!rooms ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#a09888", fontSize: 13 }}>
          Loading rooms…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#a09888", fontSize: 13 }}>
          No rooms found for this type.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {filtered.map(room => (
            <RoomCard key={room.id} room={room} onView={setViewingRoom} />
          ))}
        </div>
      )}

      {/* Booking modal */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          onClose={() => setSelectedRoom(null)}
          onSuccess={(b) => setSuccessMsg(`Booking confirmed! Room ${b.roomId} · Ref: ${b.id}`)}
        />
      )}

      {/* Room detail modal */}
      {viewingRoom && (
        <RoomModal
          room={viewingRoom}
          onClose={() => setViewingRoom(null)}
          onBook={(room) => { setViewingRoom(null); setSelectedRoom(room); }}
        />
      )}
    </div>
  );
}