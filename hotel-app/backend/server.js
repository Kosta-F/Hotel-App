import express from "express";
import cors from "cors";
import roomsRouter from "./routes/rooms.js";
import bookingsRouter from "./routes/bookings.js";
import statsRouter from "./routes/stats.js";
import "dotenv/config";
import authRouter from "./routes/auth.js";
import cron from "node-cron";
import pool from "./db.js";

// Runs every day at midnight
cron.schedule("0 * * * *", async () => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [result] = await pool.query(
      `UPDATE bookings 
       SET status = 'checked-out' 
       WHERE check_out <= ? AND status IN ('reserved', 'checked-in')`,
      [today]
    );
    console.log(`Auto checkout: ${result.affectedRows} bookings updated.`);
  } catch (err) {
    console.error("Auto checkout error:", err);
  }
});

// Run once immediately on server start
(async () => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [result] = await pool.query(
      `UPDATE bookings 
       SET status = 'checked-out' 
       WHERE check_out <= ? AND status IN ('reserved', 'checked-in')`,
      [today]
    );
    console.log(`Startup auto checkout: ${result.affectedRows} bookings updated.`);
  } catch (err) {
    console.error("Startup auto checkout error:", err);
  }
})();

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/rooms", roomsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/auth", authRouter);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Hotel API running at http://localhost:${PORT}`);
});
