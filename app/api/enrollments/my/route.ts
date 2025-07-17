import { type NextRequest, NextResponse } from "next/server"
import { getEnrollmentsByUserId } from "@/lib/db"
import { getUserFromToken, getTokenFromRequest } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  console.log("=== MY ENROLLMENTS API CALLED ===")

  try {
    // Get and verify token
    const token = getTokenFromRequest(request)
    const user = getUserFromToken(token)

    if (!user) {
      console.log("Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("User authenticated:", user.email)

    // Get user's enrollments
    try {
      const enrollments = await getEnrollmentsByUserId(user.userId)
      console.log(`Found ${enrollments.length} enrollments for user`)
      return NextResponse.json(enrollments)
    } catch (fetchError) {
      console.error("Error fetching user enrollments:", fetchError)
      return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected error in my enrollments:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
