import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      if (!data.user.verified) {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: 400,
        background: "#ffffff",
        border: "0.5px solid #e8e4dc",
        borderRadius: 12,
        padding: "40px 36px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 24,
            fontWeight: 400,
            letterSpacing: "0.18em",
            color: "#8a6e3e",
          }}>AURELIA</span>
          <p style={{ marginTop: 8, fontSize: 13, color: "#6b6456" }}>
            Sign in to your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#fdf0ee",
            border: "0.5px solid #c9503a",
            borderRadius: 6,
            padding: "10px 14px",
            fontSize: 13,
            color: "#c9503a",
            marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@email.com"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={inputStyle}
            />
          </div>

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Switch to signup */}
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#6b6456" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#8a6e3e", textDecoration: "none", fontWeight: 500 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: 12,
  color: "#6b6456",
  letterSpacing: "0.04em",
};

const inputStyle = {
  padding: "9px 12px",
  border: "0.5px solid #e8e4dc",
  borderRadius: 6,
  fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
  color: "#1a1814",
  background: "#faf9f7",
  outline: "none",
  width: "100%",
};

const btnStyle = {
  marginTop: 4,
  padding: "11px",
  background: "#faf9f7",
  border: "0.5px solid #d0cab8",
  borderRadius: 6,
  fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 500,
  color: "#8a6e3e",
  cursor: "pointer",
  letterSpacing: "0.04em",
};