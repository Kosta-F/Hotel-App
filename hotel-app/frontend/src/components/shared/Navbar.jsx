import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", flag: "🇬🇧" },
  { code: "sq", flag: "🇦🇱" },
  { code: "it", flag: "🇮🇹" },
];

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    setMenuOpen(false);
  };

  const links = [
    { to: "/", label: t("navbar.home") },
    ...(user
      ? [{ to: "/account", label: t("navbar.account") }]
      : [{ to: "/login", label: t("navbar.signIn") }]
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
        fontSize: 20, fontWeight: 400,
        letterSpacing: "0.18em", color: "#8a6e3e",
      }}>
        AURELIA
      </span>

      {/* Desktop links */}
      <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
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
            {t("navbar.signOut")}
          </button>
        )}

        {/* Language switcher — desktop */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {LANGUAGES.map(({ code, flag }) => (
            <button
              key={code}
              onClick={() => i18n.changeLanguage(code)}
              title={code.toUpperCase()}
              style={{
                fontSize: 20, background: "none",
                border: "none", cursor: "pointer",
                padding: "2px 4px", borderRadius: 4,
                opacity: i18n.language === code ? 1 : 0.4,
                transition: "opacity 0.15s",
              }}
            >
              {flag}
            </button>
          ))}
        </div>
      </div>

      {/* Hamburger — mobile only */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        className="hamburger"
        style={{
          display: "none", flexDirection: "column",
          gap: 5, background: "none",
          border: "none", cursor: "pointer", padding: 4,
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
          display: "flex", flexDirection: "column",
          gap: 2, zIndex: 99,
        }}>
          {links.map(({ to, label }) => (
            <NavLink
              key={to} to={to} end={to === "/"}
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
              {t("navbar.signOut")}
            </button>
          )}

          {/* Language switcher — mobile */}
          <div style={{ display: "flex", gap: 8, paddingTop: 12 }}>
            {LANGUAGES.map(({ code, flag }) => (
              <button
                key={code}
                onClick={() => { i18n.changeLanguage(code); setMenuOpen(false); }}
                style={{
                  fontSize: 22, background: "none",
                  border: "none", cursor: "pointer",
                  padding: "2px 4px", borderRadius: 4,
                  opacity: i18n.language === code ? 1 : 0.4,
                  transition: "opacity 0.15s",
                }}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}