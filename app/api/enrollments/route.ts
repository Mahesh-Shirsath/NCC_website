import { type NextRequest, NextResponse } from "next/server"
import { createEnrollment } from "@/lib/db"
import { getUserFromToken, getTokenFromRequest } from "@/lib/middleware"

export async function POST(request: NextRequest) {
  console.log("=== ENROLLMENTS API CALLED ===")

  try {
    // Get and verify token
    const token = getTokenFromRequest(request)
    const user = getUserFromToken(token)

    if (!user) {
      console.log("Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("User authenticated:", user.email)

    // Parse request body
    let enrollmentData
    try {
      enrollmentData = await request.json()
      console.log("Enrollment data parsed successfully")
    } catch (e) {
      console.error("Failed to parse request body:", e)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    // Validate required fields
    const requiredFields = [
      "college_name",
      "course",
      "year_of_study",
      "preferred_wing",
      "emergency_contact",
      "emergency_phone",
    ]
    for (const field of requiredFields) {
      if (!enrollmentData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create enrollment
    try {
      const enrollment = await createEnrollment({
        user_id: user.userId,
        college_name: enrollmentData.college_name,
        course: enrollmentData.course,
        year_of_study: enrollmentData.year_of_study,
        preferred_wing: enrollmentData.preferred_wing,
        previous_ncc_experience: enrollmentData.previous_ncc_experience || false,
        medical_conditions: enrollmentData.medical_conditions,
        emergency_contact: enrollmentData.emergency_contact,
        emergency_phone: enrollmentData.emergency_phone,
        documents_uploaded: enrollmentData.documents_uploaded || false,
      })

      console.log("Enrollment created successfully:", enrollment.application_number)
      return NextResponse.json(enrollment, { status: 201 })
    } catch (createError) {
      console.error("Enrollment creation error:", createError)
      return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected enrollment error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
