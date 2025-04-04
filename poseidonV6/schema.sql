DROP TABLE IF EXISTS bookings;

CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  room_type TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

