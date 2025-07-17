import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "ncc-enrollment-secret-key-2024"

export interface User {
  id: number
  email: string
  role: string
  full_name: string
  phone?: string
}

export async function hashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 12
    const hash = await bcrypt.hash(password, saltRounds)
    console.log("Password hashed successfully")
    return hash
  } catch (error) {
    console.error("Error hashing password:", error)
    throw new Error("Password hashing failed")
  }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    console.log("Verifying password...")
    const isValid = await bcrypt.compare(password, hashedPassword)
    console.log("Password verification result:", isValid)
    return isValid
  } catch (error) {
    console.error("Error verifying password:", error)
    throw new Error("Password verification failed")
  }
}

export function generateToken(user: User): string {
  try {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
    console.log("Token generated successfully for user:", user.email)
    return token
  } catch (error) {
    console.error("Error generating token:", error)
    throw new Error("Token generation failed")
  }
}

export function verifyToken(token: string): any {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log("Token verified successfully")
    return decoded
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}
