import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Ensure faqs table exists
    await sql`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'general',
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if there are any FAQs, if not add sample data
    const faqsCheck = await sql`SELECT COUNT(*) FROM faqs`

    if (faqsCheck[0].count === "0") {
      await sql`
        INSERT INTO faqs (question, answer, category, display_order) VALUES
        ('What is the eligibility criteria for NCC enrollment?', 
        'Students must be enrolled in a recognized educational institution, be between 13-26 years of age, and have good physical and mental health.',
        'enrollment', 1),

        ('How long is the NCC training period?', 
        'The basic NCC training is for 2-3 years depending on the certificate level (A, B, or C certificate).',
        'training', 2),

        ('What are the benefits of joining NCC?', 
        'NCC provides leadership training, character development, adventure activities, and preference in government job selections.',
        'benefits', 3),

        ('Can I change my wing after enrollment?', 
        'Wing changes are generally not allowed after enrollment. However, in exceptional cases, it may be considered by the commanding officer.',
        'enrollment', 4),

        ('What documents are required for enrollment?', 
        'You need academic certificates, birth certificate, medical fitness certificate, passport size photographs, and parent consent form.',
        'documents', 5)
      `
    }

    const faqs = await sql`
      SELECT * FROM faqs ORDER BY display_order ASC, created_at ASC
    `

    return NextResponse.json(faqs)
  } catch (error) {
    console.error("FAQs fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
