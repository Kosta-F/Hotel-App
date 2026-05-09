import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const firstDay = `${year}-${month}-01`;
    const lastDay = `${year}-${month}-${new Date(year, now.getMonth() + 1, 0).getDate()}`;
    const today = now.toISOString().slice(0, 10);

    // Last month range
    const lastMonthDate = new Date(year, now.getMonth() - 1, 1);
    const lastMonthYear = lastMonthDate.getFullYear();
    const lastMonth = String(lastMonthDate.getMonth() + 1).padStart(2, "0");
    const firstDayLastMonth = `${lastMonthYear}-${lastMonth}-01`;
    const lastDayLastMonth = `${lastMonthYear}-${lastMonth}-${new Date(lastMonthYear, lastMonthDate.getMonth() + 1, 0).getDate()}`;

    // Total revenue this month
    const [[{ totalRevenue }]] = await pool.query(
      `SELECT COALESCE(SUM(total), 0) as totalRevenue FROM bookings
       WHERE check_in >= ? AND check_in <= ? AND status != 'cancelled'`,
      [firstDay, lastDay]
    );

    // Total revenue last month
    const [[{ revenueLastMonth }]] = await pool.query(
      `SELECT COALESCE(SUM(total), 0) as revenueLastMonth FROM bookings
       WHERE check_in >= ? AND check_in <= ? AND status != 'cancelled'`,
      [firstDayLastMonth, lastDayLastMonth]
    );

    // Total rooms
    const [[{ totalRooms }]] = await pool.query(
      `SELECT COUNT(*) as totalRooms FROM rooms`
    );

    // Occupied rooms today
    const [[{ occupiedRooms }]] = await pool.query(
      `SELECT COUNT(*) as occupiedRooms FROM bookings
       WHERE check_in <= ? AND check_out > ? AND status IN ('reserved', 'checked-in')`,
      [today, today]
    );

    // Occupancy last month (approximate)
    const [[{ occupiedLastMonth }]] = await pool.query(
      `SELECT COUNT(*) as occupiedLastMonth FROM bookings
       WHERE check_in <= ? AND check_out > ? AND status IN ('reserved', 'checked-in', 'checked-out')`,
      [lastDayLastMonth, firstDayLastMonth]
    );

    // Avg nightly rate this month
    const [[{ avgNightlyRate }]] = await pool.query(
      `SELECT COALESCE(AVG(r.price), 0) as avgNightlyRate
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       WHERE b.check_in >= ? AND b.check_in <= ? AND b.status != 'cancelled'`,
      [firstDay, lastDay]
    );

    // Avg nightly rate last month
    const [[{ avgNightlyRateLastMonth }]] = await pool.query(
      `SELECT COALESCE(AVG(r.price), 0) as avgNightlyRateLastMonth
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       WHERE b.check_in >= ? AND b.check_in <= ? AND b.status != 'cancelled'`,
      [firstDayLastMonth, lastDayLastMonth]
    );

    // Check-outs today
    const [[{ checkoutsToday }]] = await pool.query(
      `SELECT COUNT(*) as checkoutsToday FROM bookings
       WHERE check_out = ? AND status IN ('checked-in', 'checked-out')`,
      [today]
    );

    // Check-ins today
    const [[{ checkinsToday }]] = await pool.query(
      `SELECT COUNT(*) as checkinsToday FROM bookings
       WHERE check_in = ? AND status IN ('reserved', 'checked-in')`,
      [today]
    );

    // Revenue by floor
    const [revenueByFloor] = await pool.query(
      `SELECT r.floor, COALESCE(SUM(b.total), 0) as revenue
       FROM rooms r
       LEFT JOIN bookings b ON r.id = b.room_id
         AND b.check_in >= ? AND b.check_in <= ? AND b.status != 'cancelled'
       GROUP BY r.floor
       ORDER BY r.floor`,
      [firstDay, lastDay]
    );

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    const occupancyLastMonth = totalRooms > 0 ? Math.round((occupiedLastMonth / totalRooms) * 100) : 0;

    res.json({
      month: `${now.toLocaleString("default", { month: "long" })} ${year}`,
      totalRevenue: Number(totalRevenue),
      revenueLastMonth: Number(revenueLastMonth),
      occupancyRate,
      occupancyLastMonth,
      avgNightlyRate: Math.round(avgNightlyRate),
      avgNightlyRateLastMonth: Math.round(avgNightlyRateLastMonth),
      checkoutsToday: Number(checkoutsToday),
      checkinsToday: Number(checkinsToday),
      revenueByFloor: revenueByFloor.map(r => ({
        floor: `Floor ${r.floor}`,
        revenue: Number(r.revenue),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});

export default router;