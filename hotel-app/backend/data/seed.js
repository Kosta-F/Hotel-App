// Rooms data
export const rooms = [
  { id: "101", floor: 1, type: "Standard", name: "Standard Queen", price: 89, maxGuests: 2 },
  { id: "102", floor: 1, type: "Standard", name: "Standard Twin", price: 89, maxGuests: 2 },
  { id: "103", floor: 1, type: "Standard", name: "Garden Double", price: 99, maxGuests: 2 },
  { id: "201", floor: 2, type: "Standard", name: "Standard Queen", price: 89, maxGuests: 2 },
  { id: "202", floor: 2, type: "Standard", name: "Standard Twin", price: 89, maxGuests: 2 },
  { id: "203", floor: 2, type: "Deluxe", name: "Deluxe Double", price: 129, maxGuests: 2 },
  { id: "204", floor: 2, type: "Deluxe", name: "Deluxe King", price: 149, maxGuests: 2 },
  { id: "301", floor: 3, type: "Deluxe", name: "Deluxe Queen", price: 129, maxGuests: 2 },
  { id: "302", floor: 3, type: "Deluxe", name: "Deluxe Twin", price: 129, maxGuests: 3 },
  { id: "303", floor: 3, type: "Deluxe", name: "Deluxe King", price: 149, maxGuests: 2 },
  { id: "401", floor: 4, type: "Deluxe", name: "Deluxe Sea View", price: 159, maxGuests: 2 },
  { id: "402", floor: 4, type: "Deluxe", name: "Deluxe King", price: 149, maxGuests: 2 },
  { id: "403", floor: 4, type: "Suite", name: "Junior Suite", price: 229, maxGuests: 3 },
  { id: "501", floor: 5, type: "Suite", name: "Junior Suite", price: 229, maxGuests: 3 },
  { id: "502", floor: 5, type: "Suite", name: "Spa Deluxe", price: 189, maxGuests: 2 },
  { id: "503", floor: 5, type: "Suite", name: "Spa Suite", price: 249, maxGuests: 2 },
  { id: "601", floor: 6, type: "Suite", name: "Panorama Suite", price: 299, maxGuests: 4 },
  { id: "602", floor: 6, type: "Suite", name: "Executive Suite", price: 319, maxGuests: 3 },
  { id: "801", floor: 8, type: "Penthouse", name: "Penthouse Suite", price: 420, maxGuests: 4 },
  { id: "802", floor: 8, type: "Penthouse", name: "Royal Penthouse", price: 520, maxGuests: 6 },
];

// Generate bookings for April 2026
export const bookings = [
  { id: "b001", roomId: "101", guest: "Marco Rossi", checkIn: "2026-04-14", checkOut: "2026-04-18", status: "checked-in", total: 356 },
  { id: "b002", roomId: "102", guest: "Sophie Klein", checkIn: "2026-04-16", checkOut: "2026-04-19", status: "checked-in", total: 267 },
  { id: "b003", roomId: "103", guest: "Lena Fischer", checkIn: "2026-04-10", checkOut: "2026-04-15", status: "checked-out", total: 495 },
  { id: "b004", roomId: "201", guest: "Ahmed Nouri", checkIn: "2026-04-17", checkOut: "2026-04-21", status: "reserved", total: 356 },
  { id: "b005", roomId: "203", guest: "Jane Dupont", checkIn: "2026-04-18", checkOut: "2026-04-22", status: "reserved", total: 516 },
  { id: "b006", roomId: "204", guest: "Tom Bakker", checkIn: "2026-04-12", checkOut: "2026-04-17", status: "checked-out", total: 745 },
  { id: "b007", roomId: "302", guest: "Nina Park", checkIn: "2026-04-15", checkOut: "2026-04-20", status: "checked-in", total: 645 },
  { id: "b008", roomId: "303", guest: "Carlos Vega", checkIn: "2026-04-19", checkOut: "2026-04-23", status: "reserved", total: 596 },
  { id: "b009", roomId: "401", guest: "Yuki Tanaka", checkIn: "2026-04-13", checkOut: "2026-04-17", status: "checked-out", total: 636 },
  { id: "b010", roomId: "402", guest: "Emma Wilson", checkIn: "2026-04-17", checkOut: "2026-04-20", status: "checked-in", total: 447 },
  { id: "b011", roomId: "403", guest: "Pierre Martin", checkIn: "2026-04-20", checkOut: "2026-04-25", status: "reserved", total: 1145 },
  { id: "b012", roomId: "501", guest: "Amara Diallo", checkIn: "2026-04-14", checkOut: "2026-04-19", status: "checked-in", total: 1145 },
  { id: "b013", roomId: "502", guest: "Hans Mueller", checkIn: "2026-04-16", checkOut: "2026-04-18", status: "checked-in", total: 378 },
  { id: "b014", roomId: "503", guest: "Rosa Chen", checkIn: "2026-04-22", checkOut: "2026-04-26", status: "reserved", total: 996 },
  { id: "b015", roomId: "601", guest: "David Kim", checkIn: "2026-04-15", checkOut: "2026-04-21", status: "checked-in", total: 1794 },
  { id: "b016", roomId: "602", guest: "Fatima Hassan", checkIn: "2026-04-18", checkOut: "2026-04-22", status: "reserved", total: 1276 },
  { id: "b017", roomId: "801", guest: "Victor Blanc", checkIn: "2026-04-20", checkOut: "2026-04-23", status: "reserved", total: 1260 },
  { id: "b018", roomId: "101", guest: "Sara Johansson", checkIn: "2026-04-20", checkOut: "2026-04-24", status: "reserved", total: 356 },
  { id: "b019", roomId: "202", guest: "Mia Santos", checkIn: "2026-04-11", checkOut: "2026-04-15", status: "checked-out", total: 356 },
  { id: "b020", roomId: "301", guest: "Omar Abdullah", checkIn: "2026-04-17", checkOut: "2026-04-22", status: "checked-in", total: 645 },
];

// Stats
export const monthlyStats = {
  month: "April 2026",
  totalRevenue: 48320,
  revenueLastMonth: 43150,
  occupancyRate: 78,
  occupancyLastMonth: 71,
  avgNightlyRate: 162,
  avgNightlyRateLastMonth: 150,
  checkoutsToday: 6,
  checkinsToday: 4,
  revenueByFloor: [
    { floor: "Floor 1", revenue: 5280 },
    { floor: "Floor 2", revenue: 6900 },
    { floor: "Floor 3", revenue: 7510 },
    { floor: "Floor 4", revenue: 9040 },
    { floor: "Floor 5", revenue: 8530 },
    { floor: "Floor 6", revenue: 10660 },
    { floor: "Floor 8", revenue: 3760 },
  ]
};
