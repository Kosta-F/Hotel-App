import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?", [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
      [fullName, email, hashedPassword]
    );
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({
      user: { id: result.insertId, fullName, email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?", [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      user: { id: user.id, fullName: user.full_name, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// POST /api/auth/admin
router.post("/admin", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Incorrect password." });
  }
});

// PATCH /api/auth/update-profile
router.patch("/update-profile", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Not authenticated." });
  
  const token = authHeader.split(" ")[1];
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch {
    return res.status(401).json({ error: "Invalid token." });
  }

  const { fullName, currentPassword, newPassword } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found." });
    const user = rows[0];

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ error: "Current password is required." });
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return res.status(401).json({ error: "Current password is incorrect." });
      const hashed = await bcrypt.hash(newPassword, 10);
      await pool.query("UPDATE users SET full_name = ?, password = ? WHERE id = ?", [fullName, hashed, userId]);
    } else {
      await pool.query("UPDATE users SET full_name = ? WHERE id = ?", [fullName, userId]);
    }

    res.json({ success: true, fullName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile." });
  }
});

export default router;