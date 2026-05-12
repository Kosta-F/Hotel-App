import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { api } from "../lib/api";

const STATUS_STYLES = {
  "reserved":    { bg: "#f9f2e6", text: "#b8965a", label: "Reserved" },
  "checked-in":  { bg: "#edf7f3", text: "#2e7d5e", label: "Checked in" },
  "checked-out": { bg: "#f4f2ee", text: "#a09888", label: "Completed" },
  "cancelled":   { bg: "#fdf0ee", text: "#c9503a", label: "Cancelled" },
};

function getInitials(fullName) {
  if (!fullName) return "?";
  return fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function AccountPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("Reservations");
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    currentPassword: "", newPassword: "", confirmPassword: ""
  });
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const { data: allBookings, refetch } = useFetch(() => api.getBookings({ user_id: user?.id }), [user?.id]);
  const myBookings = allBookings?.filter(b => Number(b.userId) === Number(user?.id)) || [];

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.updateBookingStatus(bookingId, "cancelled");
      refetch();
    } catch (e) { alert(e.message); }
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfileSave = async () => {
    setProfileMsg(null);
    setProfileError(null);
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      setProfileError("New passwords do not match.");
      return;
    }
    if (profileForm.newPassword && profileForm.newPassword.length < 6) {
      setProfileError("New password must be at least 6 characters.");
      return;
    }
    setProfileLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiUrl}/api/auth/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          fullName: profileForm.fullName,
          currentPassword: profileForm.currentPassword,
          newPassword: profileForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const updatedUser = { ...user, fullName: profileForm.fullName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setProfileMsg("Profile updated successfully!");
      setProfileForm(f => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (e) {
      setProfileError(e.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = myBookings.filter(b => {
    const checkOut = b.checkOut?.slice(0, 10);
    return checkOut > today && (b.status === "reserved" || b.status === "checked-in");
  });
  const past = myBookings.filter(b => {
    const checkOut = b.checkOut?.slice(0, 10);
    return checkOut <= today || b.status === "checked-out" || b.status === "cancelled";
  });

  if (!user) return null;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "16px 12px" : "28px 24px" }}>

      {/* Mobile: profile header at top */}
      {isMobile && (
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          marginBottom: 20,
          background: "#ffffff",
          border: "0.5px solid #e8e4dc",
          borderRadius: 12,
          padding: "16px",
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "#f5edde", border: "0.5px solid #d0cab8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Cormorant Garamond', serif", fontSize: 18,
            color: "#8a6e3e", flexShrink: 0,
          }}>
            {getInitials(user.fullName)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.fullName}
            </div>
            <div style={{ fontSize: 12, color: "#a09888", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              padding: "5px 10px", fontSize: 12,
              border: "0.5px solid #c9503a", borderRadius: 4,
              background: "transparent", color: "#c9503a",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              flexShrink: 0,
            }}
          >
            Sign out
          </button>
        </div>
      )}

      {/* Mobile: tab bar */}
      {isMobile && (
        <div style={{
          display: "flex", gap: 4, marginBottom: 16,
          borderBottom: "1px solid #e8e4dc", paddingBottom: 0,
        }}>
          {["Reservations", "Profile"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: "10px",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #b8965a" : "2px solid transparent",
                background: "transparent",
                fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                color: activeTab === tab ? "#1a1814" : "#a09888",
                cursor: "pointer", fontWeight: activeTab === tab ? 500 : 400,
                marginBottom: -1,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Desktop: sidebar + main layout */}
      {!isMobile ? (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, alignItems: "start" }}>
          {/* Sidebar */}
          <div style={{
            background: "#ffffff", border: "0.5px solid #e8e4dc",
            borderRadius: 12, padding: "24px 20px",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "#f5edde", border: "0.5px solid #d0cab8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Cormorant Garamond', serif", fontSize: 20,
              color: "#8a6e3e", margin: "0 auto 12px",
            }}>
              {getInitials(user.fullName)}
            </div>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontWeight: 500, fontSize: 15 }}>{user.fullName}</div>
              <div style={{ fontSize: 12, color: "#a09888", marginTop: 2 }}>{user.email}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {["Reservations", "Profile"].map(item => (
                <div key={item} onClick={() => setActiveTab(item)} style={{
                  padding: "8px 10px", borderRadius: 4, fontSize: 13,
                  color: activeTab === item ? "#1a1814" : "#6b6456",
                  background: activeTab === item ? "#f4f2ee" : "transparent",
                  cursor: "pointer",
                }}>
                  {item}
                </div>
              ))}
              <div onClick={handleSignOut} style={{
                padding: "8px 10px", borderRadius: 4,
                fontSize: 13, color: "#c9503a",
                cursor: "pointer", marginTop: 8,
              }}>
                Sign out
              </div>
            </div>
          </div>

          {/* Main content */}
          <MainContent
            activeTab={activeTab}
            upcoming={upcoming}
            past={past}
            handleCancel={handleCancel}
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            profileMsg={profileMsg}
            profileError={profileError}
            profileLoading={profileLoading}
            handleProfileSave={handleProfileSave}
            user={user}
            isMobile={false}
          />
        </div>
      ) : (
        /* Mobile: just main content */
        <MainContent
          activeTab={activeTab}
          upcoming={upcoming}
          past={past}
          handleCancel={handleCancel}
          profileForm={profileForm}
          setProfileForm={setProfileForm}
          profileMsg={profileMsg}
          profileError={profileError}
          profileLoading={profileLoading}
          handleProfileSave={handleProfileSave}
          user={user}
          isMobile={true}
        />
      )}
    </div>
  );
}

function MainContent({ activeTab, upcoming, past, handleCancel, profileForm, setProfileForm, profileMsg, profileError, profileLoading, handleProfileSave, user, isMobile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {activeTab === "Reservations" && (
        <>
          <div style={cardStyle}>
            <SectionTitle>Upcoming stays</SectionTitle>
            {upcoming.length === 0 ? (
              <p style={{ fontSize: 13, color: "#a09888" }}>No upcoming stays.</p>
            ) : upcoming.map(b => <BookingRow key={b.id} booking={b} onCancel={handleCancel} isMobile={isMobile} />)}
          </div>
          <div style={cardStyle}>
            <SectionTitle>Past stays</SectionTitle>
            {past.length === 0 ? (
              <p style={{ fontSize: 13, color: "#a09888" }}>No past stays yet.</p>
            ) : past.map(b => <BookingRow key={b.id} booking={b} isMobile={isMobile} />)}
          </div>
        </>
      )}

      {activeTab === "Profile" && (
        <div style={cardStyle}>
          <SectionTitle>Profile</SectionTitle>
          {profileMsg && (
            <div style={{ padding: "10px 14px", marginBottom: 16, background: "#edf7f3", color: "#2e7d5e", borderRadius: 6, fontSize: 13 }}>
              {profileMsg}
            </div>
          )}
          {profileError && (
            <div style={{ padding: "10px 14px", marginBottom: 16, background: "#fdf0ee", color: "#c9503a", borderRadius: 6, fontSize: 13 }}>
              {profileError}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label style={labelStyle}>
              Full name
              <input value={profileForm.fullName} onChange={e => setProfileForm(f => ({ ...f, fullName: e.target.value }))} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Email
              <input value={user.email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
            </label>
            <div style={{ borderTop: "0.5px solid #e8e4dc", paddingTop: 16, marginTop: 4 }}>
              <p style={{ fontSize: 12, color: "#a09888", marginBottom: 12 }}>
                Leave password fields empty if you don't want to change it.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <label style={labelStyle}>
                  Current password
                  <input type="password" value={profileForm.currentPassword} onChange={e => setProfileForm(f => ({ ...f, currentPassword: e.target.value }))} placeholder="Required to change password" style={inputStyle} />
                </label>
                <label style={labelStyle}>
                  New password
                  <input type="password" value={profileForm.newPassword} onChange={e => setProfileForm(f => ({ ...f, newPassword: e.target.value }))} placeholder="Min. 6 characters" style={inputStyle} />
                </label>
                <label style={labelStyle}>
                  Confirm new password
                  <input type="password" value={profileForm.confirmPassword} onChange={e => setProfileForm(f => ({ ...f, confirmPassword: e.target.value }))} placeholder="Repeat new password" style={inputStyle} />
                </label>
              </div>
            </div>
            <button onClick={handleProfileSave} disabled={profileLoading} style={{
              marginTop: 8, padding: "10px",
              background: "#f5edde", border: "0.5px solid #b8965a",
              borderRadius: 6, fontSize: 13,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              color: "#8a6e3e", cursor: "pointer",
              opacity: profileLoading ? 0.7 : 1,
            }}>
              {profileLoading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingRow({ booking, onCancel, isMobile }) {
  const nights = Math.round((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000);
  const st = STATUS_STYLES[booking.status] || STATUS_STYLES["reserved"];

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "space-between",
      padding: "12px 0",
      borderBottom: "0.5px solid #e8e4dc",
      gap: isMobile ? 10 : 0,
    }}>
      <div>
        <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 3 }}>
          Room {booking.roomId}
          {booking.room && (
            <span style={{ fontWeight: 400, color: "#a09888", marginLeft: 6 }}>
              — {booking.room.name}
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "#a09888" }}>
          {booking.checkIn?.slice(0, 10)} → {booking.checkOut?.slice(0, 10)} · {nights} night{nights > 1 ? "s" : ""}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}>
          €{booking.total?.toLocaleString()}
        </span>
        <span style={{
          fontSize: 11, padding: "3px 8px", borderRadius: 4,
          background: st.bg, color: st.text,
        }}>
          {st.label}
        </span>
        {onCancel && (
          <button onClick={() => onCancel(booking.id)} style={{
            padding: "4px 10px", fontSize: 12,
            border: "0.5px solid #c9503a", borderRadius: 4,
            background: "transparent", color: "#c9503a",
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontSize: 13, fontWeight: 500, marginBottom: 14,
      color: "#6b6456", letterSpacing: "0.06em", textTransform: "uppercase",
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

const labelStyle = {
  display: "flex", flexDirection: "column", gap: 5,
  fontSize: 12, color: "#6b6456",
};

const inputStyle = {
  padding: "8px 10px",
  border: "0.5px solid #e8e4dc",
  borderRadius: 6, fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
  color: "#1a1814", background: "#faf9f7",
  outline: "none", width: "100%",
};