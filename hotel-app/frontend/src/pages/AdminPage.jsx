import { useState, useCallback } from "react";
import { useFetch } from "../hooks/useFetch";
import { api } from "../lib/api";
import KpiCard from "../components/admin/KpiCard";
import FloorRevenue from "../components/admin/FloorRevenue";
import RoomCalendar from "../components/admin/RoomCalendar";
import BookingsTable from "../components/admin/BookingsTable";
import RoomsManager from "../components/admin/RoomsManager";
import BookingPanel from "../components/admin/BookingPanel";

const TABS = ["Overview", "Calendar", "Bookings", "Rooms"];

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [tab, setTab] = useState("Overview");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data: stats } = useFetch(() => api.getStats(), []);
  const { data: bookings, refetch: refetchBookings } = useFetch(() => api.getBookings(), []);
  const { data: rooms, refetch: refetchRooms } = useFetch(() => api.getRooms(), []);

  const handleStatusChange = useCallback(async (id, status) => {
  try {
    await api.updateBookingStatus(id, status);
    refetchBookings();
    setSelectedBooking(prev => prev ? { ...prev, status } : null);
  } catch (e) {
    alert(e.message);
  }
}, [refetchBookings]);

const handleNotesChange = useCallback(async (id, notes) => {
  try {
    await api.updateBookingNotes(id, notes);
    refetchBookings();
  } catch (e) {
    alert(e.message);
  }
}, [refetchBookings]);

  const handlePaidChange = useCallback(async (id, paid) => {
  try {
    await api.updateBookingPaid(id, paid);
    refetchBookings();
    setSelectedBooking(prev => prev ? { ...prev, paid } : null);
  } catch (e) {
    alert(e.message);
  }
}, [refetchBookings]);

const handleUnlock = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    const res = await fetch(`${apiUrl}/api/auth/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: input }),
    });
    if (res.ok) {
      setUnlocked(true);
    } else {
      setWrongPassword(true);
      setInput("");
    }
  } catch {
    setWrongPassword(true);
    setInput("");
  }
};

  const pct = (now, prev) => {
    const diff = ((now - prev) / prev * 100).toFixed(1);
    return diff > 0 ? `+${diff}% vs last month` : `${diff}% vs last month`;
  };

  // PASSWORD GATE
  if (!unlocked) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#faf9f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}>
        <div style={{
          width: "100%",
          maxWidth: 380,
          background: "#ffffff",
          border: "0.5px solid #e8e4dc",
          borderRadius: 12,
          padding: "40px 36px",
          textAlign: "center",
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 24,
            fontWeight: 400,
            letterSpacing: "0.18em",
            color: "#8a6e3e",
          }}>
            AURELIA
          </span>
          <p style={{ marginTop: 8, marginBottom: 28, fontSize: 13, color: "#6b6456" }}>
            Admin access only
          </p>

          {wrongPassword && (
            <div style={{
              background: "#fdf0ee",
              border: "0.5px solid #c9503a",
              borderRadius: 6,
              padding: "10px 14px",
              fontSize: 13,
              color: "#c9503a",
              marginBottom: 16,
            }}>
              Incorrect password.
            </div>
          )}

          <input
            type="password"
            value={input}
            onChange={e => { setInput(e.target.value); setWrongPassword(false); }}
            onKeyDown={e => e.key === "Enter" && handleUnlock()}
            placeholder="Enter password"
            style={{
              width: "100%",
              padding: "9px 12px",
              marginBottom: 12,
              border: `0.5px solid ${wrongPassword ? "#c9503a" : "#e8e4dc"}`,
              borderRadius: 6,
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              color: "#1a1814",
              background: "#faf9f7",
              outline: "none",
            }}
          />
          <button
            onClick={handleUnlock}
            style={{
              width: "100%",
              padding: 11,
              background: "#faf9f7",
              border: "0.5px solid #d0cab8",
              borderRadius: 6,
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              color: "#8a6e3e",
              cursor: "pointer",
            }}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "#a09888" }}>
          Aurelia Hotel — {stats?.month || "April 2026"}
        </p>
      </div>

      {/* Tab navigation */}
      <div style={{ display: "flex", gap: 2, marginBottom: 28, borderBottom: "1px solid #e8e4dc" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 18px",
            fontSize: 13,
            border: "none",
            borderBottom: tab === t ? "2px solid #b8965a" : "2px solid transparent",
            background: "transparent",
            color: tab === t ? "#1a1814" : "#a09888",
            cursor: "pointer",
            fontWeight: tab === t ? 500 : 400,
            marginBottom: -1,
            transition: "color 0.15s",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === "Overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <KpiCard
              label="Revenue this month"
              value={stats ? `€${stats.totalRevenue.toLocaleString()}` : "—"}
              sub={stats ? pct(stats.totalRevenue, stats.revenueLastMonth) : ""}
              accent
            />
            <KpiCard
              label="Occupancy rate"
              value={stats ? `${stats.occupancyRate}%` : "—"}
              sub={stats ? pct(stats.occupancyRate, stats.occupancyLastMonth) : ""}
            />
            <KpiCard
              label="Avg. nightly rate"
              value={stats ? `€${stats.avgNightlyRate}` : "—"}
              sub={stats ? pct(stats.avgNightlyRate, stats.avgNightlyRateLastMonth) : ""}
            />
            <KpiCard
              label="Today"
              value={stats ? `${stats.checkoutsToday} out / ${stats.checkinsToday} in` : "—"}
              sub="Check-outs / check-ins"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={cardStyle}>
              <SectionTitle>Revenue by floor</SectionTitle>
              <FloorRevenue data={stats?.revenueByFloor} />
            </div>
            <div style={cardStyle}>
              <SectionTitle>Booking status</SectionTitle>
              {bookings && (() => {
                const counts = bookings.reduce((acc, b) => {
                  acc[b.status] = (acc[b.status] || 0) + 1;
                  return acc;
                }, {});
                const total = bookings.length;
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                    {[
                      { key: "checked-in", label: "Checked in", color: "#2e7d5e" },
                      { key: "reserved", label: "Reserved", color: "#b8965a" },
                      { key: "checked-out", label: "Checked out", color: "#a09888" },
                    ].map(({ key, label, color }) => {
                      const count = counts[key] || 0;
                      const pctVal = total ? Math.round((count / total) * 100) : 0;
                      return (
                        <div key={key}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 13, color: "#6b6456" }}>{label}</span>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{count}</span>
                          </div>
                          <div style={{ height: 5, background: "#e8e4dc", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pctVal}%`, background: color, borderRadius: 3, transition: "width 0.5s" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>

          <div style={cardStyle}>
            <SectionTitle>Recent bookings</SectionTitle>
            <BookingsTable
              bookings={bookings?.slice(0, 8)}
              onStatusChange={handleStatusChange}
              onSelect={setSelectedBooking}
            />
          </div>
        </div>
      )}

      {/* CALENDAR TAB */}
      {tab === "Calendar" && (
        <div style={cardStyle}>
          <SectionTitle>Room availability</SectionTitle>
          <RoomCalendar onSelectBooking={setSelectedBooking} />
        </div>
      )}

      {/* BOOKINGS TAB */}
      {tab === "Bookings" && (
        <div style={cardStyle}>
          <SectionTitle>All bookings</SectionTitle>
          <BookingsTable
            bookings={bookings}
            onStatusChange={handleStatusChange}
            onSelect={setSelectedBooking}
          />
        </div>
      )}

      {/* ROOMS TAB */}
      {tab === "Rooms" && (
        <div style={cardStyle}>
          <SectionTitle>Manage rooms</SectionTitle>
          <RoomsManager rooms={rooms} onRefetch={refetchRooms} />
        </div>
      )}
      {/* Booking side panel */}
        <BookingPanel
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
          onPaidChange={handlePaidChange}
          onNotesChange={handleNotesChange}
        />
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontSize: 14, fontWeight: 500, marginBottom: 16,
      color: "#6b6456",
      letterSpacing: "0.04em", textTransform: "uppercase",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {children}
    </h2>
  );
}

const cardStyle = {
  background: "#ffffff",
  border: "0.5px solid #e8e4dc",
  borderRadius: 12,
  padding: "20px 24px",
};