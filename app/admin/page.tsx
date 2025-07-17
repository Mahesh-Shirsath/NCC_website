"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Camera,
  Newspaper,
  Calendar,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
} from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Enrollment {
  id: number
  application_number: string
  status: string
  college_name: string
  course: string
  submitted_at: string
  user?: {
    full_name: string
    email: string
    phone?: string
  }
}

export default function AdminDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userData)
    if (user.role !== "admin") {
      router.push("/student")
      return
    }

    fetchEnrollments()
  }, [router])

  useEffect(() => {
    filterEnrollments()
  }, [enrollments, searchTerm, statusFilter])

  const filterEnrollments = () => {
    let filtered = [...enrollments]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((e) => e.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.application_number.toLowerCase().includes(term) ||
          e.college_name.toLowerCase().includes(term) ||
          e.course.toLowerCase().includes(term) ||
          e.user?.full_name.toLowerCase().includes(term) ||
          e.user?.email.toLowerCase().includes(term),
      )
    }

    setFilteredEnrollments(filtered)
  }

  const fetchEnrollments = async () => {
    setError("")
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/admin/enrollments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setEnrollments(data)
        setFilteredEnrollments(data)

        // Calculate stats
        const total = data.length
        const pending = data.filter((e: Enrollment) => e.status === "pending").length
        const approved = data.filter((e: Enrollment) => e.status === "approved").length
        const rejected = data.filter((e: Enrollment) => e.status === "rejected").length

        setStats({ total, pending, approved, rejected })
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to fetch enrollments")
      }
    } catch (error) {
      console.error("Failed to fetch enrollments:", error)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateEnrollmentStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch(`/api/admin/enrollments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        // Update the enrollment in the local state
        const updatedEnrollments = enrollments.map((enrollment) =>
          enrollment.id === id ? { ...enrollment, status } : enrollment,
        )
        setEnrollments(updatedEnrollments)

        // Update stats
        const total = updatedEnrollments.length
        const pending = updatedEnrollments.filter((e) => e.status === "pending").length
        const approved = updatedEnrollments.filter((e) => e.status === "approved").length
        const rejected = updatedEnrollments.filter((e) => e.status === "rejected").length

        setStats({ total, pending, approved, rejected })

        // Close detail view if open
        if (selectedEnrollment?.id === id) {
          setSelectedEnrollment({ ...selectedEnrollment, status })
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to update enrollment status")
      }
    } catch (error) {
      console.error("Failed to update enrollment:", error)
      setError("Network error. Please try again.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const viewEnrollmentDetails = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment)
  }

  const closeEnrollmentDetails = () => {
    setSelectedEnrollment(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
          <p>Loading enrollment data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Enrollment Applications</CardTitle>
                    <CardDescription>Review and manage student enrollment applications</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search applications..."
                        className="pl-8 w-full sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" size="icon" title="Export Data">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedEnrollment ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Application Details</h3>
                      <Button variant="ghost" size="sm" onClick={closeEnrollmentDetails}>
                        Back to List
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Application Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Application #:</span>
                            <span>{selectedEnrollment.application_number}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Status:</span>
                            <Badge className={getStatusColor(selectedEnrollment.status)}>
                              {selectedEnrollment.status.charAt(0).toUpperCase() + selectedEnrollment.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Submitted:</span>
                            <span>{new Date(selectedEnrollment.submitted_at).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">College:</span>
                            <span>{selectedEnrollment.college_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Course:</span>
                            <span>{selectedEnrollment.course}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Student Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Name:</span>
                            <span>{selectedEnrollment.user?.full_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Email:</span>
                            <span>{selectedEnrollment.user?.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Phone:</span>
                            <span>{selectedEnrollment.user?.phone || "Not provided"}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {selectedEnrollment.status === "pending" && (
                      <div className="flex justify-center space-x-4 mt-6">
                        <Button
                          onClick={() => updateEnrollmentStatus(selectedEnrollment.id, "approved")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve Application
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => updateEnrollmentStatus(selectedEnrollment.id, "rejected")}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject Application
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Application #</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>College</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEnrollments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            {searchTerm || statusFilter !== "all" ? (
                              <div className="flex flex-col items-center">
                                <Search className="h-8 w-8 text-gray-400 mb-2" />
                                <p>No applications match your search criteria</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <FileText className="h-8 w-8 text-gray-400 mb-2" />
                                <p>No applications found</p>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredEnrollments.map((enrollment) => (
                          <TableRow key={enrollment.id}>
                            <TableCell className="font-medium">{enrollment.application_number}</TableCell>
                            <TableCell>{enrollment.user?.full_name}</TableCell>
                            <TableCell>{enrollment.college_name}</TableCell>
                            <TableCell>{enrollment.course}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(enrollment.status)}>
                                {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(enrollment.submitted_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => viewEnrollmentDetails(enrollment)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {enrollment.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => updateEnrollmentStatus(enrollment.id, "approved")}
                                      className="bg-green-600 hover:bg-green-700"
                                      title="Approve"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => updateEnrollmentStatus(enrollment.id, "rejected")}
                                      title="Reject"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gallery Management</CardTitle>
                <CardDescription>Manage photos and media content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">Gallery management interface coming soon.</p>
                  <Button className="mt-4">Add New Photo</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>News Management</CardTitle>
                <CardDescription>Create and manage news articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Newspaper className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">News management interface coming soon.</p>
                  <Button className="mt-4">Create Article</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Management</CardTitle>
                <CardDescription>Create and manage events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">Event management interface coming soon.</p>
                  <Button className="mt-4">Create Event</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>View enrollment statistics and generate reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">Advanced reporting features coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
