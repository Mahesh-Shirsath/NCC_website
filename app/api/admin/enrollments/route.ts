import { type NextRequest, NextResponse } from "next/server"
import { getAllEnrollmentsWithUsers } from "@/lib/db"
import { getUserFromToken, getTokenFromRequest } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  console.log("=== ADMIN ENROLLMENTS API CALLED ===")

  try {
    // Get and verify token
    const token = getTokenFromRequest(request)
    const user = getUserFromToken(token)

    if (!user || user.role !== "admin") {
      console.log("Unauthorized access attempt to admin enrollments")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Admin user authenticated:", user.email)

    // Get all enrollments with user details
    try {
      const enrollments = await getAllEnrollmentsWithUsers()
      console.log(`Found ${enrollments.length} total enrollments`)
      return NextResponse.json(enrollments)
    } catch (fetchError) {
      console.error("Error fetching admin enrollments:", fetchError)
      return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected error in admin enrollments:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
