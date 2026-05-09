import { useState, useEffect } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function Footer() {
  const isMobile = useIsMobile();

  return (
    <footer style={{
      background: "#1a1814",
      color: "#a09888",
      padding: isMobile ? "32px 20px 20px" : "48px 40px 28px",
      marginTop: "auto",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr",
        gap: isMobile ? 28 : 48,
        marginBottom: isMobile ? 24 : 40,
      }}>

        {/* Brand */}
        <div>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22, fontWeight: 400,
            letterSpacing: "0.18em", color: "#b8965a",
            display: "block", marginBottom: 10,
          }}>
            AURELIA
          </span>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "#6b6456" }}>
            A boutique hotel offering luxury stays in the heart of the city. Where comfort meets elegance.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{
            fontSize: 11, fontWeight: 500,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#6b6456", marginBottom: 14,
          }}>
            Contact
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span>📍</span>
              <span style={{ lineHeight: 1.5 }}>12 Luxury Avenue,<br />City Center, 10001</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span>📞</span>
              <span>+1 (234) 567-890</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span>✉️</span>
              <span style={{ wordBreak: "break-all" }}>hello@aurelia-hotel.com</span>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 style={{
            fontSize: 11, fontWeight: 500,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#6b6456", marginBottom: 14,
          }}>
            Quick links
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="/" style={{ fontSize: 13, color: "#a09888", textDecoration: "none" }}>Home</a>
            <a href="/account" style={{ fontSize: 13, color: "#a09888", textDecoration: "none" }}>My Account</a>
            <a href="/login" style={{ fontSize: 13, color: "#a09888", textDecoration: "none" }}>Sign in</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        borderTop: "0.5px solid #2a2620",
        paddingTop: 20,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: 12,
      }}>
        <p style={{ fontSize: 12, color: "#3d3830" }}>
          2026 Aurelia Hotel. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="#" style={{ fontSize: 12, color: "#3d3830", textDecoration: "none" }}>Instagram</a>
          <a href="#" style={{ fontSize: 12, color: "#3d3830", textDecoration: "none" }}>Facebook</a>
          <a href="#" style={{ fontSize: 12, color: "#3d3830", textDecoration: "none" }}>Twitter</a>
        </div>
      </div>
    </footer>
  );
}