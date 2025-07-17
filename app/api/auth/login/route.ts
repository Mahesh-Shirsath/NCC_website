import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyPassword, generateToken, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  console.log("=== LOGIN API CALLED ===")

  try {
    // Parse request body first
    let body
    try {
      body = await request.json()
      console.log("Request body parsed successfully")
    } catch (e) {
      console.error("Failed to parse request body:", e)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    const { email, password } = body

    if (!email || !password) {
      console.log("Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log(`Attempting login for email: ${email}`)

    // Ensure users table exists
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'student',
          full_name VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("Users table verified")
    } catch (dbError) {
      console.error("Database table creation error:", dbError)
      return NextResponse.json({ error: "Database initialization failed" }, { status: 500 })
    }

    // Create demo accounts if they don't exist
    await createDemoAccounts()

    // Find user
    let user
    try {
      const users = await sql`SELECT * FROM users WHERE email = ${email}`
      user = users[0]

      if (!user) {
        console.log("User not found")
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      console.log(`User found: ${user.full_name}, role: ${user.role}`)
    } catch (userError) {
      console.error("Error finding user:", userError)
      return NextResponse.json({ error: "Database query failed" }, { status: 500 })
    }

    // Verify password
    try {
      console.log("Attempting password verification...")
      const isValidPassword = await verifyPassword(password, user.password_hash)

      if (!isValidPassword) {
        console.log("Invalid password")
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      console.log("Password verified successfully")
    } catch (passwordError) {
      console.error("Password verification error:", passwordError)
      return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
    }

    // Generate token
    try {
      const token = generateToken(user)
      const { password_hash, ...userWithoutPassword } = user

      console.log("Login successful, returning token and user data")
      return NextResponse.json({
        token,
        user: userWithoutPassword,
      })
    } catch (tokenError) {
      console.error("Token generation error:", tokenError)
      return NextResponse.json({ error: "Token generation failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected login error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function createDemoAccounts() {
  try {
    console.log("Creating demo accounts...")

    // Check if admin exists
    const adminCheck = await sql`SELECT id FROM users WHERE email = 'admin@ncc.edu'`

    if (adminCheck.length === 0) {
      console.log("Creating admin account...")
      // Hash the password "admin123"
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
      console.log("✅ Admin account created")
    } else {
      console.log("Admin account already exists")
    }

    // Check if student exists
    const studentCheck = await sql`SELECT id FROM users WHERE email = 'student@example.com'`

    if (studentCheck.length === 0) {
      console.log("Creating student account...")
      // Hash the password "student123"
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
      console.log("✅ Student account created")
    } else {
      console.log("Student account already exists")
    }

    console.log("Demo accounts setup completed")
  } catch (error) {
    console.error("Error creating demo accounts:", error)
    // Don't throw error - this is not critical for login to work
  }
}
