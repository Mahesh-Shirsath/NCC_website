"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, RefreshCw } from "lucide-react"
import { MainNav } from "@/components/main-nav"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for message in URL params (e.g., after registration)
    const message = searchParams?.get("message")
    if (message) {
      setSuccess(message)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    setNetworkError(false)

    try {
      console.log("Attempting login with:", email)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      let data: any = null

      // Attempt to parse JSON only if the response claims to be JSON
      const isJson = response.headers.get("content-type")?.toLowerCase().includes("application/json")

      if (isJson) {
        try {
          data = await response.json()
        } catch (err) {
          console.error("Failed to parse JSON:", err)
        }
      }

      if (response.ok && data) {
        setSuccess("Login successful! Redirecting...")
        localStorage.setItem("auth-token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        // Redirect after a short delay to show success message
        setTimeout(() => {
          if (data.user.role === "admin") {
            router.push("/admin")
          } else {
            router.push("/student")
          }
        }, 1000)
      } else {
        const message = (data && data.error) || `Login failed (status ${response.status}). Please try again.`
        setError(message)
      }
    } catch (error) {
      console.error("Network error during login:", error)
      setNetworkError(true)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  const resetDemoAccounts = async () => {
    setResetting(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/auth/reset-demo", {
        method: "POST",
      })

      if (response.ok) {
        setSuccess("Demo accounts reset successfully! You can now login with the demo credentials.")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to reset demo accounts")
      }
    } catch (error) {
      console.error("Error resetting demo accounts:", error)
      setError("Network error while resetting demo accounts")
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <MainNav />
      <div className="flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">NCC Enrollment</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                  {networkError && (
                    <div className="mt-2 text-xs">
                      <p>Troubleshooting tips:</p>
                      <ul className="list-disc pl-4 mt-1">
                        <li>Check your internet connection</li>
                        <li>Make sure the server is running</li>
                        <li>Try refreshing the page</li>
                        <li>Try resetting demo accounts below</li>
                      </ul>
                    </div>
                  )}
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              {"Don't have an account? "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Demo Accounts:</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetDemoAccounts}
                  disabled={resetting}
                  className="text-xs bg-transparent"
                >
                  {resetting ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-1 h-3 w-3" />
                  )}
                  Reset
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div
                  className="bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleDemoLogin("admin@ncc.edu", "admin123")}
                >
                  <p className="font-semibold text-blue-600">Admin:</p>
                  <p>admin@ncc.edu</p>
                  <p>admin123</p>
                </div>
                <div
                  className="bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleDemoLogin("student@example.com", "student123")}
                >
                  <p className="font-semibold text-green-600">Student:</p>
                  <p>student@example.com</p>
                  <p>student123</p>
                </div>
              </div>
              <p className="text-xs text-center mt-2 text-gray-500">
                (Click on a box to auto-fill credentials, then click "Reset" if login fails)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
