import { type NextRequest, NextResponse } from "next/server"
import { updateEnrollmentStatus } from "@/lib/db"
import { getUserFromToken, getTokenFromRequest } from "@/lib/middleware"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`=== UPDATE ENROLLMENT STATUS API CALLED FOR ID: ${params.id} ===`)

  try {
    // Get and verify token
    const token = getTokenFromRequest(request)
    const user = getUserFromToken(token)

    if (!user || user.role !== "admin") {
      console.log("Unauthorized access attempt to update enrollment status")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Admin user authenticated:", user.email)

    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("Request body parsed successfully:", body)
    } catch (e) {
      console.error("Failed to parse request body:", e)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    const { status } = body
    const enrollmentId = Number.parseInt(params.id)

    // Validate status
    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      console.log("Invalid status provided:", status)
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    // Validate enrollment ID
    if (isNaN(enrollmentId)) {
      console.log("Invalid enrollment ID:", params.id)
      return NextResponse.json({ error: "Invalid enrollment ID" }, { status: 400 })
    }

    // Update enrollment status
    try {
      await updateEnrollmentStatus(enrollmentId, status, user.userId)

      console.log(`Successfully updated enrollment ${enrollmentId} status to ${status}`)
      return NextResponse.json({
        message: "Status updated successfully",
        enrollmentId,
        status,
        reviewedBy: user.userId,
        reviewedAt: new Date().toISOString(),
      })
    } catch (updateError) {
      console.error("Error updating enrollment status:", updateError)
      return NextResponse.json({ error: "Failed to update enrollment status" }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected error in update enrollment status:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
