import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function VerifyPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const updatedUser = { ...user, verified: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      navigate("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email }),
      });
      setResent(true);
    } catch (e) {
      setError("Failed to resend code.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#faf9f7",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        width: "100%", maxWidth: 400,
        background: "#ffffff", border: "0.5px solid #e8e4dc",
        borderRadius: 12, padding: "40px 36px", textAlign: "center",
      }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 24, fontWeight: 400,
          letterSpacing: "0.18em", color: "#8a6e3e",
        }}>
          AURELIA
        </span>
        <p style={{ marginTop: 8, marginBottom: 8, fontSize: 13, color: "#6b6456" }}>
          Verify your email
        </p>
        <p style={{ fontSize: 12, color: "#a09888", marginBottom: 28 }}>
          We sent a 6-digit code to <strong>{user?.email}</strong>
        </p>

        {error && (
          <div style={{
            background: "#fdf0ee", border: "0.5px solid #c9503a",
            borderRadius: 6, padding: "10px 14px",
            fontSize: 13, color: "#c9503a", marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {resent && (
          <div style={{
            background: "#edf7f3", borderRadius: 6,
            padding: "10px 14px", fontSize: 13,
            color: "#2e7d5e", marginBottom: 16,
          }}>
            Code resent! Check your email.
          </div>
        )}

        <input
          type="text"
          value={code}
          onChange={e => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
          placeholder="000000"
          maxLength={6}
          style={{
            width: "100%", padding: "12px",
            marginBottom: 12,
            border: "0.5px solid #e8e4dc",
            borderRadius: 6, fontSize: 24,
            fontFamily: "'DM Sans', sans-serif",
            color: "#1a1814", background: "#faf9f7",
            outline: "none", textAlign: "center",
            letterSpacing: "0.3em",
          }}
        />

        <button onClick={handleVerify} disabled={loading} style={{
          width: "100%", padding: 11,
          background: "#f5edde", border: "0.5px solid #d0cab8",
          borderRadius: 6, fontSize: 13,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          color: "#8a6e3e", cursor: "pointer",
          opacity: loading ? 0.7 : 1, marginBottom: 16,
        }}>
          {loading ? "Verifying…" : "Verify"}
        </button>

        <button onClick={handleResend} style={{
          background: "none", border: "none",
          fontSize: 13, color: "#a09888",
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>
          Didn't receive it? Resend code
        </button>
      </div>
    </div>
  );
}