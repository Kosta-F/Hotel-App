# Aurelia Hotel App

A full-stack hotel management app built with **React + Vite** (frontend) and **Express.js** (backend), organized as a monorepo.

## Project structure

```
hotel-app/
├── package.json          ← root: runs both servers together
├── frontend/
│   ├── vite.config.js    ← proxies /api → localhost:3001
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── lib/api.js           ← all API calls
│       ├── hooks/useFetch.js    ← data fetching hook
│       ├── pages/
│       │   ├── HomePage.jsx     ← user: browse & book rooms
│       │   ├── AccountPage.jsx  ← user: reservations history
│       │   └── AdminPage.jsx    ← admin: dashboard, calendar, bookings
│       └── components/
│           ├── shared/Navbar.jsx
│           ├── admin/
│           │   ├── KpiCard.jsx
│           │   ├── FloorRevenue.jsx
│           │   ├── RoomCalendar.jsx   ← table calendar (rooms × dates)
│           │   └── BookingsTable.jsx
│           └── user/
│               ├── RoomCard.jsx
│               └── BookingModal.jsx
└── backend/
    ├── server.js
    ├── data/seed.js        ← in-memory data (rooms, bookings, stats)
    └── routes/
        ├── rooms.js        ← GET /api/rooms
        ├── bookings.js     ← GET/POST /api/bookings, GET /api/bookings/calendar
        └── stats.js        ← GET /api/stats
```

## Getting started

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Run both servers

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

Or run them separately:

```bash
npm run dev:frontend   # Vite dev server on :5173
npm run dev:backend    # Express on :3001
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/rooms | List all rooms |
| GET | /api/rooms/:id | Get single room |
| GET | /api/bookings | List all bookings |
| GET | /api/bookings/calendar?month=2026-04 | Calendar data (rooms × dates) |
| POST | /api/bookings | Create a new booking |
| PATCH | /api/bookings/:id/status | Update booking status |
| GET | /api/stats | Monthly KPI stats |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — browse rooms, filter by type, open booking modal |
| `/account` | User account — upcoming and past stays |
| `/admin` | Admin dashboard — KPIs, floor revenue, room calendar, bookings table |

## Next steps to build out

- Add a real database (SQLite / PostgreSQL with Prisma)
- Add authentication (JWT or session-based)
- Add room photos
- Add email confirmation on booking
- Add admin room management (add/edit/delete rooms)
