import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST() {
  try {
    console.log("Resetting demo accounts...")

    // Delete existing demo accounts
    await sql`DELETE FROM users WHERE email IN ('admin@ncc.edu', 'student@example.com')`
    console.log("Deleted existing demo accounts")

    // Create fresh admin account
    const adminPasswordHash = await hashPassword("admin123")
    await sql`
      INSERT INTO users (email, password_hash, role, full_name, phone)
      VALUES (
        'admin@ncc.edu', 
        ${adminPasswordHash}, 
        'admin', 
        'Admin User', 
        '9876543210'
      )
    `

    // Create fresh student account
    const studentPasswordHash = await hashPassword("student123")
    await sql`
      INSERT INTO users (email, password_hash, role, full_name, phone)
      VALUES (
        'student@example.com', 
        ${studentPasswordHash}, 
        'student', 
        'Demo Student', 
        '1234567890'
      )
    `

    console.log("Demo accounts reset successfully")

    return NextResponse.json({
      message: "Demo accounts reset successfully",
      accounts: [
        { email: "admin@ncc.edu", password: "admin123", role: "admin" },
        { email: "student@example.com", password: "student123", role: "student" },
      ],
    })
  } catch (error) {
    console.error("Error resetting demo accounts:", error)
    return NextResponse.json(
      {
        error: "Failed to reset demo accounts",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
