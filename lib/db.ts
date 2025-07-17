import { neon } from "@neondatabase/serverless"

// Validate environment variables
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set")
  throw new Error("Database URL not configured. Please set DATABASE_URL environment variable.")
}

console.log("✅ Database URL found, initializing connection...")

// Create SQL client with error handling
let sql: ReturnType<typeof neon>

try {
  sql = neon(DATABASE_URL)
  console.log("✅ Database client initialized successfully")
} catch (error) {
  console.error("❌ Failed to initialize database client:", error)
  throw new Error("Database initialization failed")
}

// Test database connection
async function testConnection() {
  try {
    await sql`SELECT 1 as test`
    console.log("✅ Database connection test successful")
  } catch (error) {
    console.error("❌ Database connection test failed:", error)
  }
}

// Test connection on startup (non-blocking)
testConnection()

// Re-export the sql client
export { sql }

// Type definitions
export interface User {
  id: number
  email: string
  password_hash: string
  role: string
  full_name: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: number
  user_id: number
  application_number: string
  status: string
  college_name: string
  course: string
  year_of_study: number
  preferred_wing: string
  previous_ncc_experience: boolean
  medical_conditions?: string
  emergency_contact: string
  emergency_phone: string
  documents_uploaded: boolean
  admin_notes?: string
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: number
  user?: {
    id: number
    full_name: string
    email: string
    phone?: string
  }
}

// Database helper functions with error handling
export async function ensureUsersTable() {
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
    console.log("✅ Users table ensured")
  } catch (error) {
    console.error("❌ Error ensuring users table:", error)
    throw error
  }
}

export async function ensureEnrollmentsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        application_number VARCHAR(50) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        college_name VARCHAR(255),
        course VARCHAR(255),
        year_of_study INTEGER,
        previous_ncc_experience BOOLEAN DEFAULT FALSE,
        preferred_wing VARCHAR(50),
        documents_uploaded BOOLEAN DEFAULT FALSE,
        medical_conditions TEXT,
        emergency_contact VARCHAR(255),
        emergency_phone VARCHAR(20),
        admin_notes TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP,
        reviewed_by INTEGER
      )
    `
    console.log("✅ Enrollments table ensured")
  } catch (error) {
    console.error("❌ Error ensuring enrollments table:", error)
    throw error
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    await ensureUsersTable()
    const result = await sql`SELECT * FROM users WHERE email = ${email}`
    return (result[0] as User) || null
  } catch (error) {
    console.error(`❌ Error finding user by email (${email}):`, error)
    throw error
  }
}

export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
  try {
    await ensureUsersTable()
    const result = await sql`
      INSERT INTO users (email, password_hash, role, full_name, phone)
      VALUES (${userData.email}, ${userData.password_hash}, ${userData.role}, ${userData.full_name}, ${userData.phone})
      RETURNING *
    `
    return result[0] as User
  } catch (error) {
    console.error("❌ Error creating user:", error)
    throw error
  }
}

export async function getEnrollmentsByUserId(userId: number): Promise<Enrollment[]> {
  try {
    await ensureEnrollmentsTable()
    const result = await sql`
      SELECT * FROM enrollments WHERE user_id = ${userId} ORDER BY submitted_at DESC
    `
    return result as Enrollment[]
  } catch (error) {
    console.error(`❌ Error getting enrollments for user ${userId}:`, error)
    throw error
  }
}

export async function getAllEnrollmentsWithUsers(): Promise<Enrollment[]> {
  try {
    await ensureUsersTable()
    await ensureEnrollmentsTable()

    const result = await sql`
      SELECT e.*, u.full_name, u.email, u.phone
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      ORDER BY e.submitted_at DESC
    `

    return result.map((row: any) => ({
      ...row,
      user: {
        id: row.user_id,
        full_name: row.full_name,
        email: row.email,
        phone: row.phone,
      },
    })) as Enrollment[]
  } catch (error) {
    console.error("❌ Error getting enrollments with users:", error)
    throw error
  }
}

export async function createEnrollment(enrollmentData: {
  user_id: number
  college_name: string
  course: string
  year_of_study: number
  preferred_wing: string
  previous_ncc_experience: boolean
  medical_conditions?: string
  emergency_contact: string
  emergency_phone: string
  documents_uploaded: boolean
}): Promise<Enrollment> {
  try {
    await ensureEnrollmentsTable()

    // Generate application number
    const applicationNumber = `NCC${Date.now()}`

    const result = await sql`
      INSERT INTO enrollments (
        user_id, application_number, status, college_name, course, 
        year_of_study, preferred_wing, previous_ncc_experience,
        medical_conditions, emergency_contact, emergency_phone, documents_uploaded
      )
      VALUES (
        ${enrollmentData.user_id}, ${applicationNumber}, 'pending',
        ${enrollmentData.college_name}, ${enrollmentData.course}, ${enrollmentData.year_of_study},
        ${enrollmentData.preferred_wing}, ${enrollmentData.previous_ncc_experience},
        ${enrollmentData.medical_conditions}, ${enrollmentData.emergency_contact}, 
        ${enrollmentData.emergency_phone}, ${enrollmentData.documents_uploaded}
      )
      RETURNING *
    `
    return result[0] as Enrollment
  } catch (error) {
    console.error("❌ Error creating enrollment:", error)
    throw error
  }
}

export async function updateEnrollmentStatus(id: number, status: string, reviewedBy?: number): Promise<void> {
  try {
    await ensureEnrollmentsTable()
    await sql`
      UPDATE enrollments 
      SET status = ${status}, reviewed_at = NOW(), reviewed_by = ${reviewedBy}
      WHERE id = ${id}
    `
    console.log(`✅ Updated enrollment ${id} status to ${status}`)
  } catch (error) {
    console.error(`❌ Error updating enrollment status for ID ${id}:`, error)
    throw error
  }
}
