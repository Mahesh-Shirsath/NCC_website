import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Ensure gallery table exists
    await sql`
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500) NOT NULL,
        category VARCHAR(100) DEFAULT 'general',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if there are any gallery items, if not add sample data
    const galleryCheck = await sql`SELECT COUNT(*) FROM gallery`

    if (galleryCheck[0].count === "0") {
      await sql`
        INSERT INTO gallery (title, description, image_url, category) VALUES
        ('Annual Training Camp 2024', 'Cadets participating in the annual training camp at Goa', '/placeholder.svg?height=400&width=600', 'training'),
        ('Republic Day Parade', 'NCC cadets marching in the Republic Day parade', '/placeholder.svg?height=400&width=600', 'parade'),
        ('Adventure Training', 'Rock climbing and adventure activities', '/placeholder.svg?height=400&width=600', 'adventure'),
        ('Shooting Competition', 'Inter-college shooting competition winners', '/placeholder.svg?height=400&width=600', 'competition'),
        ('Social Service', 'Blood donation camp organized by NCC unit', '/placeholder.svg?height=400&width=600', 'service'),
        ('Cultural Program', 'Cultural evening during annual camp', '/placeholder.svg?height=400&width=600', 'cultural')
      `
    }

    const galleryItems = await sql`
      SELECT * FROM gallery ORDER BY created_at DESC
    `

    return NextResponse.json(galleryItems)
  } catch (error) {
    console.error("Gallery fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
