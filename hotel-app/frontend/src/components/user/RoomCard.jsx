const ROOM_EMOJI = {
  "Standard Studio": "🛏",
  "Studio": "🛋",
  "Studio Deluxe": "✨",
  "One Bedroom": "🌿",
  "Suite": "👑",
};

export default function RoomCard({ room, onView }) {
  const available = room.available !== false;

  return (
    <div
      onClick={() => onView?.(room)}
      style={{
        background: "#ffffff",
        border: "0.5px solid #e8e4dc",
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.15s, box-shadow 0.15s",
        cursor: "pointer",
        opacity: available ? 1 : 0.7,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#d0cab8";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,24,20,0.06)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#e8e4dc";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Room image */}
      {room.images && JSON.parse(room.images).length > 0 ? (
        <img
          src={JSON.parse(room.images)[0]}
          alt={room.name}
          style={{ width: "100%", height: 120, objectFit: "cover" }}
        />
      ) : (
        <div style={{
          height: 120, background: "#f4f2ee",
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 36,
          borderBottom: "0.5px solid #e8e4dc",
        }}>
          {ROOM_EMOJI[room.type] || "🛏"}
        </div>
      )}

      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <span style={{ fontWeight: 500, fontSize: 14 }}>{room.name}</span>
          <span style={{
            fontSize: 11, padding: "2px 7px", borderRadius: 4,
            background: available ? "#edf7f3" : "#fdf0ee",
            color: available ? "#2e7d5e" : "#c9503a",
          }}>
            {available ? "Available" : "Booked"}
          </span>
        </div>
        <div style={{ fontSize: 12, color: "#a09888", marginBottom: 12 }}>
          Floor {room.floor} · {room.type} · up to {room.max_guests} guests
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400 }}>
              €{room.price}
            </span>
            <span style={{ fontSize: 12, color: "#a09888" }}> / night</span>
          </div>
          <span style={{ fontSize: 12, color: "#a09888" }}>View details →</span>
        </div>
      </div>
    </div>
  );
}