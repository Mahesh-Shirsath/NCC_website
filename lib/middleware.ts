import type { NextRequest } from "next/server"
import { verifyToken } from "./auth"

export function getTokenFromRequest(request: NextRequest): string | null {
  try {
    // Check Authorization header first
    const authHeader = request.headers.get("authorization")
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7)
    }

    // Check cookies as fallback
    const cookieToken = request.cookies.get("auth-token")?.value
    if (cookieToken) {
      return cookieToken
    }

    return null
  } catch (error) {
    console.error("Error extracting token from request:", error)
    return null
  }
}

export function getUserFromToken(token: string | null) {
  if (!token) {
    console.log("No token provided")
    return null
  }

  try {
    const decoded = verifyToken(token)
    if (!decoded) {
      console.log("Token verification failed")
      return null
    }

    console.log("Token verified successfully for user:", decoded.email)
    return decoded
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}
