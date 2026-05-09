import { useState } from "react";

const ROOM_EMOJI = {
  "Standard Studio": "🛏",
  "Studio": "🛋",
  "Studio Deluxe": "✨",
  "One Bedroom": "🌿",
  "Suite": "👑",
};

const ROOM_DESCRIPTIONS = {
  "Standard Studio": "A cozy and comfortable studio perfect for solo travelers or couples.",
  "Studio": "A modern studio with elegant furnishings and all essential amenities.",
  "Studio Deluxe": "An upgraded studio with premium finishes and extra space.",
  "One Bedroom": "A spacious one bedroom apartment with a separate living area.",
  "Suite": "Our most luxurious offering with top-of-the-line amenities and stunning views.",
};

// Placeholder image slides per room type
const PLACEHOLDER_SLIDES = [
  { bg: "#f0ece4", label: "Bedroom" },
  { bg: "#e8f0ec", label: "Bathroom" },
  { bg: "#e8ecf0", label: "Living area" },
];

export default function RoomModal({ room, onClose, onBook }) {
  const [slide, setSlide] = useState(0);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(26,24,20,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#ffffff",
        borderRadius: 16,
        width: "100%",
        maxWidth: 640,
        overflow: "hidden",
        border: "0.5px solid #e8e4dc",
        maxHeight: "90vh",
        overflowY: "auto",
      }}>
        {/* Image carousel */}
        {(() => {
          const images = room.images ? JSON.parse(room.images) : [];
          const slides = images.length > 0 ? images : null;
          return (
            <div style={{ position: "relative", height: 260, background: PLACEHOLDER_SLIDES[slide].bg }}>
              <button onClick={onClose} style={{
                position: "absolute", top: 14, right: 14, zIndex: 10,
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                border: "0.5px solid #e8e4dc",
                cursor: "pointer", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>×</button>

              {slides ? (
                <>
                  <img
                    src={slides[slide] || slides[0]}
                    alt={room.name}
                    style={{ width: "100%", height: 260, objectFit: "cover" }}
                  />
                  {slides.length > 1 && (
                    <div style={{
                      position: "absolute", bottom: 14, left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex", gap: 6,
                    }}>
                      {slides.map((_, i) => (
                        <button key={i} onClick={() => setSlide(i)} style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: slide === i ? "#8a6e3e" : "rgba(255,255,255,0.6)",
                          border: "none", cursor: "pointer", padding: 0,
                        }} />
                      ))}
                    </div>
                  )}
                  {slide > 0 && (
                    <button onClick={() => setSlide(s => s - 1)} style={arrowStyle("left")}>‹</button>
                  )}
                  {slide < slides.length - 1 && (
                    <button onClick={() => setSlide(s => s + 1)} style={arrowStyle("right")}>›</button>
                  )}
                </>
              ) : (
                <div style={{
                  height: "100%", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 56 }}>{ROOM_EMOJI[room.type] || "🛏"}</span>
                  <span style={{ fontSize: 12, color: "#a09888", letterSpacing: "0.08em" }}>
                    {PLACEHOLDER_SLIDES[slide].label.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          );
        })()}

        {/* Room details */}
        <div style={{ padding: "24px 28px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 26, fontWeight: 400, marginBottom: 4,
              }}>
                {room.name}
              </h2>
              <p style={{ fontSize: 13, color: "#a09888" }}>Room {room.id}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 28, fontWeight: 400, color: "#8a6e3e",
              }}>
                €{room.price}
              </div>
              <div style={{ fontSize: 12, color: "#a09888" }}>per night</div>
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: 14, color: "#6b6456", lineHeight: 1.6, marginBottom: 20 }}>
            {ROOM_DESCRIPTIONS[room.type] || "A beautifully appointed room with modern amenities."}
          </p>

          {/* Details grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12, marginBottom: 24,
          }}>
            {[
              { label: "Floor", value: `Floor ${room.floor}` },
              { label: "Type", value: room.type },
              { label: "Max guests", value: `${room.max_guests} guests` },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: "#faf9f7",
                border: "0.5px solid #e8e4dc",
                borderRadius: 8,
                padding: "12px 14px",
              }}>
                <div style={{ fontSize: 11, color: "#a09888", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
                  {label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Book button */}
          <button
            onClick={() => { onClose(); onBook(room); }}
            style={{
              width: "100%",
              padding: "13px",
              background: "#f5edde",
              border: "0.5px solid #b8965a",
              borderRadius: 8,
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              color: "#8a6e3e",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            Book this room
          </button>
        </div>
      </div>
    </div>
  );
}

function arrowStyle(side) {
  return {
    position: "absolute",
    top: "50%", transform: "translateY(-50%)",
    [side]: 12,
    width: 32, height: 32,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.9)",
    border: "0.5px solid #e8e4dc",
    cursor: "pointer",
    fontSize: 18,
    display: "flex", alignItems: "center", justifyContent: "center",
  };
}