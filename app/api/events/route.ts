import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Ensure events table exists
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        event_date TIMESTAMP NOT NULL,
        location VARCHAR(255) NOT NULL,
        registration_required BOOLEAN DEFAULT FALSE,
        max_participants INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if there are any events, if not add sample data
    const eventsCheck = await sql`SELECT COUNT(*) FROM events`

    if (eventsCheck[0].count === "0") {
      await sql`
        INSERT INTO events (title, description, event_date, location, registration_required, max_participants) VALUES
        ('Shooting Competition', 'Inter-college shooting competition for all wings', '2024-04-15 09:00:00', 'College Shooting Range', true, 50),
        ('Adventure Trek', 'Weekend adventure trek to nearby hills', '2024-04-20 06:00:00', 'Assembly Point - College Gate', true, 30),
        ('Blood Donation Camp', 'Annual blood donation drive', '2024-04-25 10:00:00', 'College Auditorium', false, NULL),
        ('Cultural Evening', 'Cultural program and talent show', '2024-05-01 18:00:00', 'College Auditorium', false, NULL)
      `
    }

    const events = await sql`
      SELECT * FROM events ORDER BY event_date ASC
    `

    return NextResponse.json(events)
  } catch (error) {
    console.error("Events fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
