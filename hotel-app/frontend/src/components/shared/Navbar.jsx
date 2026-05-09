import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    setMenuOpen(false);
  };

  const links = [
    { to: "/", label: "Home" },
    ...(user
      ? [{ to: "/account", label: "My account" }]
      : [{ to: "/login", label: "Sign in" }]
    ),
  ];

  return (
    <nav style={{
      background: "#faf9f7",
      borderBottom: "0.5px solid #e8e4dc",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 60,
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <span style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 20,
        fontWeight: 400,
        letterSpacing: "0.18em",
        color: "#8a6e3e",
      }}>
        AURELIA
      </span>

      {/* Desktop links */}
      <div style={{
        display: "flex", alignItems: "center", gap: 32,
        "@media (max-width: 640px)": { display: "none" },
      }} className="desktop-nav">
        {links.map(({ to, label }) => (
          <NavLink key={to} to={to} end={to === "/"} style={({ isActive }) => ({
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 400,
            letterSpacing: "0.02em",
            color: isActive ? "#1a1814" : "#6b6456",
            textDecoration: "none",
            transition: "color 0.15s",
          })}>
            {label}
          </NavLink>
        ))}
        {user && (
          <button onClick={handleSignOut} style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 400,
            color: "#6b6456", background: "none",
            border: "none", cursor: "pointer",
            padding: 0, letterSpacing: "0.02em",
          }}>
            Sign out
          </button>
        )}
      </div>

      {/* Hamburger button — mobile only */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        className="hamburger"
        style={{
          display: "none",
          flexDirection: "column",
          gap: 5, background: "none",
          border: "none", cursor: "pointer",
          padding: 4,
        }}
      >
        <span style={{ display: "block", width: 22, height: 1.5, background: menuOpen ? "#8a6e3e" : "#1a1814", transition: "background 0.15s" }} />
        <span style={{ display: "block", width: 22, height: 1.5, background: menuOpen ? "#8a6e3e" : "#1a1814", transition: "background 0.15s" }} />
        <span style={{ display: "block", width: 22, height: 1.5, background: menuOpen ? "#8a6e3e" : "#1a1814", transition: "background 0.15s" }} />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: "absolute",
          top: 60, left: 0, right: 0,
          background: "#faf9f7",
          borderBottom: "0.5px solid #e8e4dc",
          padding: "12px 24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          zIndex: 99,
        }}>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15, fontWeight: 400,
                color: isActive ? "#1a1814" : "#6b6456",
                textDecoration: "none",
                padding: "10px 0",
                borderBottom: "0.5px solid #e8e4dc",
              })}
            >
              {label}
            </NavLink>
          ))}
          {user && (
            <button onClick={handleSignOut} style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15, fontWeight: 400,
              color: "#c9503a", background: "none",
              border: "none", cursor: "pointer",
              padding: "10px 0", textAlign: "left",
              letterSpacing: "0.02em",
            }}>
              Sign out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}