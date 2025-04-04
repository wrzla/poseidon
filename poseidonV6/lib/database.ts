import { Database } from "sqlite3"
import { open } from "sqlite"

// Booking type definition
export interface Booking {
  id?: number
  checkIn: string
  checkOut: string
  roomType: string
  guestName: string
  guestEmail: string
  guestPhone?: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

// Initialize database
async function openDb() {
  return open({
    filename: "./poseidon.db",
    driver: Database,
  })
}

// Create tables if they don't exist
export async function initDatabase() {
  const db = await openDb()

  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      checkIn TEXT NOT NULL,
      checkOut TEXT NOT NULL,
      roomType TEXT NOT NULL,
      guestName TEXT NOT NULL,
      guestEmail TEXT NOT NULL,
      guestPhone TEXT,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `)

  await db.close()
  console.log("Database initialized")
}

// Create a new booking
export async function createBooking(booking: Booking): Promise<Booking> {
  const db = await openDb()

  const result = await db.run(
    `INSERT INTO bookings (
      checkIn, checkOut, roomType, guestName, guestEmail, guestPhone, status, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      booking.checkIn,
      booking.checkOut,
      booking.roomType,
      booking.guestName,
      booking.guestEmail,
      booking.guestPhone || null,
      booking.status,
      booking.createdAt,
    ],
  )

  await db.close()

  return {
    ...booking,
    id: result.lastID,
  }
}

// Get all bookings
export async function getBookings(): Promise<Booking[]> {
  const db = await openDb()

  const bookings = await db.all("SELECT * FROM bookings ORDER BY createdAt DESC")

  await db.close()

  return bookings
}

// Get booking by ID
export async function getBookingById(id: number): Promise<Booking | null> {
  const db = await openDb()

  const booking = await db.get("SELECT * FROM bookings WHERE id = ?", [id])

  await db.close()

  return booking || null
}

// Update booking status
export async function updateBookingStatus(id: number, status: Booking["status"]): Promise<boolean> {
  const db = await openDb()

  const result = await db.run("UPDATE bookings SET status = ? WHERE id = ?", [status, id])

  await db.close()

  return result.changes > 0
}

