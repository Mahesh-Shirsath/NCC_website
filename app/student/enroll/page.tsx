"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload } from "lucide-react"
import { MainNav } from "@/components/main-nav"

export default function EnrollmentForm() {
  const [formData, setFormData] = useState({
    collegeName: "",
    course: "",
    yearOfStudy: "",
    preferredWing: "",
    previousNccExperience: false,
    medicalConditions: "",
    emergencyContact: "",
    emergencyPhone: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          college_name: formData.collegeName,
          course: formData.course,
          year_of_study: Number.parseInt(formData.yearOfStudy),
          preferred_wing: formData.preferredWing,
          previous_ncc_experience: formData.previousNccExperience,
          medical_conditions: formData.medicalConditions,
          emergency_contact: formData.emergencyContact,
          emergency_phone: formData.emergencyPhone,
          documents_uploaded: false,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Enrollment application submitted successfully!")
        setTimeout(() => {
          router.push("/student")
        }, 2000)
      } else {
        setError(data.error || "Submission failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">NCC Enrollment Application</CardTitle>
            <CardDescription className="text-center">
              Fill out all required information to complete your enrollment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="collegeName">College/Institution Name *</Label>
                  <Input
                    id="collegeName"
                    value={formData.collegeName}
                    onChange={(e) => handleChange("collegeName", e.target.value)}
                    required
                    placeholder="Enter your college name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course/Program *</Label>
                  <Input
                    id="course"
                    value={formData.course}
                    onChange={(e) => handleChange("course", e.target.value)}
                    required
                    placeholder="e.g., B.Tech Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearOfStudy">Year of Study *</Label>
                  <Select onValueChange={(value) => handleChange("yearOfStudy", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredWing">Preferred Wing *</Label>
                  <Select onValueChange={(value) => handleChange("preferredWing", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select wing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="army">Army Wing</SelectItem>
                      <SelectItem value="navy">Navy Wing</SelectItem>
                      <SelectItem value="airforce">Air Force Wing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleChange("emergencyContact", e.target.value)}
                    required
                    placeholder="Parent/Guardian name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                    required
                    placeholder="Contact phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions (if any)</Label>
                <Textarea
                  id="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={(e) => handleChange("medicalConditions", e.target.value)}
                  placeholder="List any medical conditions or allergies"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="previousNccExperience"
                  checked={formData.previousNccExperience}
                  onCheckedChange={(checked) => handleChange("previousNccExperience", checked as boolean)}
                />
                <Label htmlFor="previousNccExperience">I have previous NCC experience</Label>
              </div>

              <div className="space-y-2">
                <Label>Document Upload</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Upload required documents (Photo, ID Proof, Academic Records)
                  </p>
                  <Button type="button" variant="outline" className="mt-2 bg-transparent">
                    Choose Files
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
