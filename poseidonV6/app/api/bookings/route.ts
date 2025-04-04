import { NextResponse } from "next/server"

// Упрощенное хранилище данных (вместо базы данных)
const bookings: any[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { checkIn, checkOut, roomType, guestName, guestEmail, guestPhone } = body

    // Валидация
    if (!checkIn || !checkOut || !roomType || !guestName || !guestEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Создание бронирования
    const booking = {
      id: Date.now(),
      checkIn,
      checkOut,
      roomType,
      guestName,
      guestEmail,
      guestPhone,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // Сохранение в массив (вместо базы данных)
    bookings.push(booking)

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(bookings)
}

