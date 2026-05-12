const BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}


export const api = {
  addRoom: (data) => request("/rooms", { method: "POST", body: JSON.stringify(data) }),
  updateRoom: (id, data) => request(`/rooms/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteRoom: (id) => request(`/rooms/${id}`, { method: "DELETE" }),
  getRooms: (params = {}) => request(`/rooms?${new URLSearchParams(params)}`),
  getRoom: (id) => request(`/rooms/${id}`),
  getBookings: (params = {}) => request(`/bookings?${new URLSearchParams(params)}`),
  getCalendar: (month) => request(`/bookings/calendar?month=${month}`),
  createBooking: (data) => request("/bookings", { method: "POST", body: JSON.stringify(data) }),
  updateBookingPaid: (id, paid) => request(`/bookings/${id}/paid`, { method: "PATCH", body: JSON.stringify({ paid }) }),
  updateBookingStatus: (id, status) => request(`/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  updateBookingNotes: (id, notes) => request(`/bookings/${id}/notes`, { method: "PATCH", body: JSON.stringify({ notes }) }),
  getStats: () => request("/stats"),
  uploadRoomImage: (id, url) => request(`/rooms/${id}/images`, { method: "POST", body: JSON.stringify({ url }) }),
  deleteRoomImage: (id, url) => request(`/rooms/${id}/images`, { method: "DELETE", body: JSON.stringify({ url }) }),
};