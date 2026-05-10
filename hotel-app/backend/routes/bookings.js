import { Router } from "express";
import pool from "../db.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { sendBookingConfirmationEmail, sendCancellationEmail } from "../email.js";

const router = Router();

// GET /api/bookings
router.get("/", optionalAuth, async (req, res) => {
  try {
    let query = `
      SELECT b.*, r.name as room_name, r.type as room_type, r.floor, r.price
      FROM bookings b
      LEFT JOIN rooms r ON b.room_id = r.id
    `;
    const params = [];

    if (req.query.user_id) {
      query += " WHERE b.user_id = ?";
      params.push(req.query.user_id);
    }

    if (req.query.status) {
      query += params.length ? " AND" : " WHERE";
      query += " b.status = ?";
      params.push(req.query.status);
    }

    query += " ORDER BY b.created_at DESC";

    const [rows] = await pool.query(query, params);

    const bookings = rows.map(b => ({
      id: b.id,
      roomId: b.room_id,
      userId: b.user_id,
      guest: b.guest,
      checkIn: b.check_in,
      checkOut: b.check_out,
      status: b.status,
      total: b.total,
      paid: b.paid === 1,
      notes: b.notes,
      createdAt: b.created_at,
      room: {
        name: b.room_name,
        type: b.room_type,
        floor: b.floor,
        price: b.price,
      }
    }));

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings." });
  }
});

// GET /api/bookings/calendar
router.get("/calendar", async (req, res) => {
  try {
    const month = req.query.month || "2026-04";
    const [year, mon] = month.split("-").map(Number);
    const daysInMonth = new Date(year, mon, 0).getDate();

    const dates = Array.from({ length: daysInMonth }, (_, i) => {
      const d = i + 1;
      return `${year}-${String(mon).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    });

    const [rooms] = await pool.query("SELECT * FROM rooms ORDER BY id");
    const [bookings] = await pool.query(
      "SELECT * FROM bookings WHERE check_in <= ? AND check_out >= ?",
      [
        `${year}-${String(mon).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`,
        `${year}-${String(mon).padStart(2, "0")}-01`
      ]
    );

    const calendar = {};
    for (const room of rooms) {
      calendar[room.id] = {};
      for (const date of dates) {
        const booking = bookings.find(b => {
          if (b.room_id !== room.id) return false;
          const ci = b.check_in.toISOString().slice(0, 10);
          const co = b.check_out.toISOString().slice(0, 10);
          return date >= ci && date < co;
        });
        if (!booking) {
          calendar[room.id][date] = "free";
        } else {
          const ci = booking.check_in.toISOString().slice(0, 10);
          if (date === ci) {
            calendar[room.id][date] = "checkin";
          } else if (booking.status === "checked-out") {
            calendar[room.id][date] = "checked-out";
          } else if (booking.status === "reserved") {
            calendar[room.id][date] = "reserved";
          } else {
            calendar[room.id][date] = "occupied";
          }
        }
      }
      for (const booking of bookings) {
        if (booking.room_id !== room.id) continue;
        const co = booking.check_out.toISOString().slice(0, 10);
        if (dates.includes(co)) {
          calendar[room.id][co] = "checkout";
        }
      }
    }

    res.json({ month, dates, rooms, calendar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch calendar." });
  }
});

// POST /api/bookings - create booking (requires login)
router.post("/", requireAuth, async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;
  const userId = req.user.id;

  if (!roomId || !checkIn || !checkOut) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const today = new Date().toISOString().slice(0, 10);
  if (checkIn < today) {
    return res.status(400).json({ error: "Check-in date cannot be in the past." });
  }

  try {
    const [roomRows] = await pool.query("SELECT * FROM rooms WHERE id = ?", [roomId]);
    if (roomRows.length === 0) {
      return res.status(404).json({ error: "Room not found." });
    }
    const room = roomRows[0];

    const [conflicts] = await pool.query(
      `SELECT id FROM bookings 
       WHERE room_id = ? AND status != 'cancelled'
       AND check_in < ? AND check_out > ?`,
      [roomId, checkOut, checkIn]
    );
    if (conflicts.length > 0) {
      return res.status(409).json({ error: "Room already booked for these dates." });
    }

    const [userRows] = await pool.query("SELECT full_name FROM users WHERE id = ?", [userId]);
    const guestName = userRows[0]?.full_name || "Guest";

    const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
    const total = room.price * nights;
    const bookingId = `b${Date.now()}`;

    await pool.query(
      `INSERT INTO bookings (id, room_id, user_id, guest, check_in, check_out, status, total, paid)
       VALUES (?, ?, ?, ?, ?, ?, 'reserved', ?, 0)`,
      [bookingId, roomId, userId, guestName, checkIn, checkOut, total]
    );

    // Send confirmation email
    try {
      const [userRows] = await pool.query("SELECT email, full_name FROM users WHERE id = ?", [userId]);
      const [roomRows2] = await pool.query("SELECT * FROM rooms WHERE id = ?", [roomId]);
      if (userRows.length > 0) {
        await sendBookingConfirmationEmail(
          userRows[0].email,
          userRows[0].full_name,
          { id: bookingId, roomId, checkIn, checkOut, total },
          roomRows2[0]
        );
      }
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }

    res.status(201).json({ id: bookingId, roomId, userId, checkIn, checkOut, total, status: "reserved", paid: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create booking." });
  }
});


// PATCH /api/bookings/:id/status
router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  const allowed = ["reserved", "checked-in", "checked-out", "cancelled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }
  try {
    await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status." });
  }

    // Send cancellation email if cancelled
  if (status === "cancelled") {
    try {
      const [bookingRows] = await pool.query(
        `SELECT b.*, u.email, u.full_name, r.name as room_name 
        FROM bookings b 
        JOIN users u ON b.user_id = u.id 
        JOIN rooms r ON b.room_id = r.id 
        WHERE b.id = ?`,
        [req.params.id]
      );
      if (bookingRows.length > 0) {
        const b = bookingRows[0];
        await sendCancellationEmail(
          b.email,
          b.full_name,
          {
            id: b.id,
            roomId: b.room_id,
            checkIn: b.check_in.toISOString().slice(0, 10),
            checkOut: b.check_out.toISOString().slice(0, 10),
          },
          { name: b.room_name }
        );
      }
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }
  }
});

// PATCH /api/bookings/:id/paid
router.patch("/:id/paid", async (req, res) => {
  const { paid } = req.body;
  try {
    await pool.query("UPDATE bookings SET paid = ? WHERE id = ?", [paid ? 1 : 0, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update payment status." });
  }
});

// PATCH /api/bookings/:id/notes
router.patch("/:id/notes", async (req, res) => {
  const { notes } = req.body;
  try {
    await pool.query("UPDATE bookings SET notes = ? WHERE id = ?", [notes, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save notes." });
  }
});

export default router;