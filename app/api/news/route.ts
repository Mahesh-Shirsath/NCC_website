import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Ensure the "news" table exists (no-op if it already does)
    await sql`
    CREATE TABLE IF NOT EXISTS news (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      summary TEXT,
      image_url VARCHAR(500),
      published BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

    // Fetch published news items
    const news = await sql`
    SELECT * FROM news
    WHERE published = true
    ORDER BY created_at DESC
  `
    return NextResponse.json(news)
  } catch (error) {
    console.error("News fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
