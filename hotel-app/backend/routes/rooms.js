import { Router } from "express";
import pool from "../db.js";

const router = Router();


// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// POST /api/rooms/:id/images - upload image
// POST /api/rooms/:id/images - save image URL
router.post("/:id/images", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided." });
  try {
    const [rows] = await pool.query("SELECT images FROM rooms WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Room not found." });
    const existing = rows[0]?.images ? JSON.parse(rows[0].images) : [];
    const updated = [...existing, url];
    await pool.query("UPDATE rooms SET images = ? WHERE id = ?", [JSON.stringify(updated), req.params.id]);
    res.json({ url, images: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save image." });
  }
});

// DELETE /api/rooms/:id/images - remove image URL
router.delete("/:id/images", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided." });
  try {
    const [rows] = await pool.query("SELECT images FROM rooms WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Room not found." });
    const existing = rows[0]?.images ? JSON.parse(rows[0].images) : [];
    const updated = existing.filter(u => u !== url);
    await pool.query("UPDATE rooms SET images = ? WHERE id = ?", [JSON.stringify(updated), req.params.id]);
    res.json({ images: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete image." });
  }
});


// GET /api/rooms
router.get("/", async (req, res) => {
  try {
    let query = "SELECT * FROM rooms";
    const params = [];

    if (req.query.floor) {
      query += " WHERE floor = ?";
      params.push(Number(req.query.floor));
    }

    if (req.query.type) {
      query += params.length ? " AND" : " WHERE";
      query += " type = ?";
      params.push(req.query.type);
    }

    query += " ORDER BY floor, id";

    const [rooms] = await pool.query(query, params);

    // If dates provided, check availability
    if (req.query.checkIn && req.query.checkOut) {
      const { checkIn, checkOut } = req.query;
      const [bookedRooms] = await pool.query(
        `SELECT DISTINCT room_id FROM bookings 
         WHERE status IN ('reserved', 'checked-in')
         AND check_in <= ? AND check_out > ?`,
        [checkOut, checkIn]
      );
      const bookedIds = new Set(bookedRooms.map(b => b.room_id));
      const roomsWithAvailability = rooms.map(r => ({
        ...r,
        available: !bookedIds.has(r.id),
      }));
      return res.json(roomsWithAvailability);
    }

    res.json(rooms.map(r => ({ ...r, available: true })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rooms." });
  }
});

// GET /api/rooms/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rooms WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Room not found." });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch room." });
  }
});

// POST /api/rooms - add new room
router.post("/", async (req, res) => {
  const { id, floor, type, name, price, max_guests } = req.body;
  if (!id || !floor || !type || !name || !price || !max_guests) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const [existing] = await pool.query("SELECT id FROM rooms WHERE id = ?", [id]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "A room with this ID already exists." });
    }
    await pool.query(
      "INSERT INTO rooms (id, floor, type, name, price, max_guests) VALUES (?, ?, ?, ?, ?, ?)",
      [id, floor, type, name, price, max_guests]
    );
    res.status(201).json({ id, floor, type, name, price, max_guests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add room." });
  }
});

// PATCH /api/rooms/:id - update room
router.patch("/:id", async (req, res) => {
  const { floor, type, name, price, max_guests } = req.body;
  try {
    await pool.query(
      "UPDATE rooms SET floor = ?, type = ?, name = ?, price = ?, max_guests = ? WHERE id = ?",
      [floor, type, name, price, max_guests, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update room." });
  }
});

// DELETE /api/rooms/:id
router.delete("/:id", async (req, res) => {
  try {
    const [bookings] = await pool.query(
      "SELECT id FROM bookings WHERE room_id = ? AND status IN ('reserved', 'checked-in')",
      [req.params.id]
    );
    if (bookings.length > 0) {
      return res.status(409).json({ error: "Cannot delete a room with active bookings." });
    }
    await pool.query("DELETE FROM rooms WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete room." });
  }
});

export default router;