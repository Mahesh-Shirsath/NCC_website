import { type NextRequest, NextResponse } from "next/server"
import { sql, ensureUsersTable } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  console.log("=== REGISTER API CALLED ===")

  try {
    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("Request body parsed successfully")
    } catch (e) {
      console.error("Failed to parse request body:", e)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    const { full_name, email, phone, password } = body

    if (!full_name || !email || !password) {
      console.log("Missing required fields")
      return NextResponse.json({ error: "Full name, email, and password are required" }, { status: 400 })
    }

    console.log(`Attempting registration for email: ${email}`)

    // Ensure users table exists
    try {
      await ensureUsersTable()
    } catch (dbError) {
      console.error("Database table creation error:", dbError)
      return NextResponse.json({ error: "Database initialization failed" }, { status: 500 })
    }

    // Check if user already exists
    try {
      const existingUsers = await sql`SELECT id FROM users WHERE email = ${email}`
      if (existingUsers.length > 0) {
        console.log("User already exists")
        return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
      }
    } catch (checkError) {
      console.error("Error checking existing user:", checkError)
      return NextResponse.json({ error: "Database query failed" }, { status: 500 })
    }

    // Hash password
    let password_hash
    try {
      password_hash = await hashPassword(password)
      console.log("Password hashed successfully")
    } catch (hashError) {
      console.error("Password hashing error:", hashError)
      return NextResponse.json({ error: "Password processing failed" }, { status: 500 })
    }

    // Create user
    try {
      const result = await sql`
        INSERT INTO users (full_name, email, phone, password_hash, role)
        VALUES (${full_name}, ${email}, ${phone}, ${password_hash}, 'student')
        RETURNING id, full_name, email, phone, role, created_at, updated_at
      `

      const user = result[0]
      console.log("User created successfully:", user.email)

      return NextResponse.json(
        {
          message: "User created successfully",
          user,
        },
        { status: 201 },
      )
    } catch (createError) {
      console.error("User creation error:", createError)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected registration error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
