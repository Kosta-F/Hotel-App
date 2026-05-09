import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../lib/api";

const STATUS_CONFIG = {
  occupied:    { bg: "#fdf0ee", text: "#c9503a", label: "Occ" },
  checkin:     { bg: "#edf7f3", text: "#2e7d5e", label: "In" },
  checkout:    { bg: "#edf2f8", text: "#5b7fa6", label: "Out" },
  reserved:    { bg: "#f9f2e6", text: "#b8965a", label: "Res" },
  "checked-out":{ bg: "#f4f2ee", text: "#a09888", label: "Done" },
  free:        { bg: "transparent", text: "#a09888", label: "" },
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function getMonthKey(offset = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return { day: d.getDate(), weekday: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()] };
}

function isToday(dateStr) {
  return dateStr === new Date().toISOString().slice(0, 10);
}

function isWeekend(dateStr) {
  const day = new Date(dateStr + "T00:00:00").getDay();
  return day === 0 || day === 6;
}

const FLOOR_COLORS = {
  1: "#e8e4dc", 2: "#dde8e0", 3: "#dde4ee",
  4: "#ecdde8", 5: "#ece8dd", 6: "#dde8e8", 8: "#e8ddec"
};

export default function RoomCalendar({ onSelectBooking }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedFloors, setSelectedFloors] = useState([]);
  const [tooltip, setTooltip] = useState(null);

  const month = getMonthKey(monthOffset);
  const { data, loading, error } = useFetch(() => api.getCalendar(month), [month]);
  const { data: bookingsData } = useFetch(() => api.getBookings(), []);

  const floors = data ? [...new Set(data.rooms.map(r => r.floor))].sort() : [];
  const visibleRooms = data
    ? selectedFloors.length === 0
      ? data.rooms
      : data.rooms.filter(r => selectedFloors.includes(r.floor))
    : [];

  const toggleFloor = (f) =>
    setSelectedFloors(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );

  const [yr, mon] = month.split("-").map(Number);
  const monthLabel = `${MONTHS[mon - 1]} ${yr}`;

 const handleCellClick = (date, room, status) => {
  if (status === "free" || !onSelectBooking || !bookingsData) return;
  const booking = bookingsData.find(b => {
    if (b.roomId !== room.id) return false;
    const checkIn = b.checkIn?.slice(0, 10);
    const checkOut = b.checkOut?.slice(0, 10);
    return date >= checkIn && date < checkOut;
  });
  const checkoutBooking = bookingsData.find(b => {
    if (b.roomId !== room.id) return false;
    return date === b.checkOut?.slice(0, 10);
  });
  const found = booking || checkoutBooking;
  if (found) onSelectBooking(found);
};
  
//const handleCellClick = (date, room, status) => {
//   if (status === "free" || !onSelectBooking || !bookingsData) return;

//   const clickedDate = new Date(date);
//   clickedDate.setHours(0, 0, 0, 0);

//   const matchingBookings = bookingsData.filter(b => {
//     if (b.roomId !== room.id) return false;

//     const checkIn = new Date(b.checkIn);
//     const checkOut = new Date(b.checkOut);

//     checkIn.setHours(0, 0, 0, 0);
//     checkOut.setHours(0, 0, 0, 0);

//     return clickedDate >= checkIn && clickedDate <= checkOut;
//   });

//   if (matchingBookings.length > 0) {
//     // pick the most relevant one (e.g. latest check-in)
//     const booking = matchingBookings.sort(
//       (a, b) => new Date(b.checkIn) - new Date(a.checkIn)
//     )[0];

//     onSelectBooking(booking);
//   }
// };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setMonthOffset(o => o - 1)} style={navBtnStyle}>‹</button>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, minWidth: 160, textAlign: "center" }}>
            {monthLabel}
          </span>
          <button onClick={() => setMonthOffset(o => o + 1)} style={navBtnStyle}>›</button>
          {monthOffset !== 0 && (
            <button onClick={() => setMonthOffset(0)} style={resetBtnStyle}>Today</button>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#a09888", marginRight: 2 }}>Floors:</span>
          {floors.map(f => (
            <button key={f} onClick={() => toggleFloor(f)} style={{
              padding: "3px 10px", fontSize: 12, borderRadius: 4,
              border: `1px solid ${selectedFloors.includes(f) ? "#d0cab8" : "#e8e4dc"}`,
              background: selectedFloors.includes(f) ? FLOOR_COLORS[f] || "#f4f2ee" : "#ffffff",
              color: "#6b6456", cursor: "pointer",
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {Object.entries(STATUS_CONFIG).filter(([k]) => k !== "free" && k !== "checked-out").map(([key, cfg]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: cfg.bg, border: `1px solid ${cfg.text}30` }} />
            <span style={{ color: "#6b6456" }}>
              {key === "checkin" ? "Check-in" : key === "checkout" ? "Check-out" : key}
            </span>
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#a09888", fontSize: 13 }}>
          Loading calendar…
        </div>
      )}
      {error && (
        <div style={{ padding: "24px", color: "#c9503a", fontSize: 13, background: "#fdf0ee", borderRadius: 8 }}>
          Could not load calendar: {error}
        </div>
      )}

      {data && (
        <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #e8e4dc" }}>
          <table style={{ borderCollapse: "collapse", minWidth: "100%", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 72 }} />
              {visibleRooms.map(r => <col key={r.id} style={{ width: 60 }} />)}
            </colgroup>
            <thead>
              {/* Floor headers */}
              <tr style={{ background: "#f4f2ee" }}>
                <th style={stickyColStyle}> </th>
                {floors.filter(f => selectedFloors.length === 0 || selectedFloors.includes(f)).map(floor => {
                  const floorRooms = visibleRooms.filter(r => r.floor === floor);
                  return (
                    <th key={floor} colSpan={floorRooms.length} style={{
                      padding: "6px 0", textAlign: "center",
                      fontSize: 11, fontWeight: 500, color: "#6b6456",
                      letterSpacing: "0.06em",
                      borderBottom: "1px solid #e8e4dc",
                      borderLeft: "1px solid #e8e4dc",
                      background: FLOOR_COLORS[floor] || "#f4f2ee",
                    }}>
                      FLOOR {floor}
                    </th>
                  );
                })}
              </tr>
              {/* Room headers */}
              <tr style={{ background: "#ffffff" }}>
                <th style={{ ...stickyColStyle, borderBottom: "1px solid #e8e4dc" }}></th>
                {visibleRooms.map((room, i) => {
                  const isFirst = i === 0 || visibleRooms[i - 1].floor !== room.floor;
                  return (
                    <th key={room.id} style={{
                      padding: "6px 4px", textAlign: "center",
                      fontSize: 12, fontWeight: 500, color: "#1a1814",
                      borderBottom: "1px solid #e8e4dc",
                      borderLeft: isFirst ? "1px solid #d0cab8" : "1px solid #e8e4dc",
                      whiteSpace: "nowrap",
                    }}>
                      {room.id}
                      <div style={{ fontSize: 10, fontWeight: 400, color: "#a09888", lineHeight: 1.2 }}>
                        {room.type.slice(0, 3)}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.dates.map((date) => {
                const { day, weekday } = formatDate(date);
                const today = isToday(date);
                const weekend = isWeekend(date);
                return (
                  <tr key={date} style={{
                    background: today ? "#f5edde" : weekend ? "#f4f2ee" : "#ffffff",
                  }}>
                    {/* Date cell */}
                    <td style={{
                      ...stickyColStyle,
                      padding: "4px 10px",
                      borderBottom: "1px solid #e8e4dc",
                      background: today ? "#f5edde" : weekend ? "#f4f2ee" : "#ffffff",
                    }}>
                      <span style={{ fontSize: 13, fontWeight: today ? 500 : 400, color: today ? "#8a6e3e" : "#1a1814" }}>
                        {day}
                      </span>
                      <span style={{ fontSize: 11, color: "#a09888", marginLeft: 5 }}>
                        {weekday}
                      </span>
                    </td>
                    {/* Room cells */}
                    {visibleRooms.map((room, i) => {
                      const status = data.calendar[room.id]?.[date] || "free";
                      const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.free;
                      const isFirst = i === 0 || visibleRooms[i - 1].floor !== room.floor;
                      return (
                        <td
                          key={room.id}
                          onMouseEnter={(e) => setTooltip({ date, room, status, x: e.clientX, y: e.clientY })}
                          onMouseLeave={() => setTooltip(null)}
                          onClick={() => handleCellClick(date, room, status)}
                          style={{
                            padding: "3px 4px",
                            textAlign: "center",
                            borderBottom: "1px solid #e8e4dc",
                            borderLeft: isFirst ? "1px solid #d0cab8" : "1px solid #e8e4dc",
                            background: cfg.bg,
                            cursor: status !== "free" ? "pointer" : "default",
                          }}
                        >
                          {cfg.label && (
                            <span style={{
                              fontSize: 10, color: cfg.text,
                              fontWeight: 500, display: "block", lineHeight: "18px",
                            }}>
                              {cfg.label}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && tooltip.status !== "free" && (
        <div style={{
          position: "fixed",
          top: tooltip.y + 12,
          left: tooltip.x + 12,
          background: "#ffffff",
          border: "1px solid #d0cab8",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 13,
          zIndex: 9999,
          pointerEvents: "none",
          boxShadow: "0 4px 16px rgba(26,24,20,0.08)",
          minWidth: 160,
        }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>Room {tooltip.room.id}</div>
          <div style={{ color: "#6b6456", fontSize: 12, marginBottom: 2 }}>{tooltip.date}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: STATUS_CONFIG[tooltip.status]?.text }} />
            <span style={{ color: STATUS_CONFIG[tooltip.status]?.text, fontSize: 12, textTransform: "capitalize" }}>
              {tooltip.status.replace("-", " ")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const stickyColStyle = {
  position: "sticky", left: 0, zIndex: 2,
  padding: "6px 10px", textAlign: "left",
  fontSize: 13, fontWeight: 400,
  borderRight: "1px solid #d0cab8",
  whiteSpace: "nowrap",
};

const navBtnStyle = {
  width: 28, height: 28,
  border: "1px solid #e8e4dc", borderRadius: 4,
  background: "#ffffff", color: "#6b6456",
  fontSize: 16, display: "flex",
  alignItems: "center", justifyContent: "center",
  cursor: "pointer",
};

const resetBtnStyle = {
  padding: "4px 10px", fontSize: 12,
  border: "1px solid #e8e4dc", borderRadius: 4,
  background: "#ffffff", color: "#6b6456",
  cursor: "pointer",
};