import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Award, BookOpen, Camera, Newspaper, Calendar, HelpCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">NCC Enrollment System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link href="/gallery">
                <Button variant="ghost">Gallery</Button>
              </Link>
              <Link href="/news">
                <Button variant="ghost">News</Button>
              </Link>
              <Link href="/events">
                <Button variant="ghost">Events</Button>
              </Link>
              <Link href="/faq">
                <Button variant="ghost">FAQ</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Join the National Cadet Corps</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Shape your character, develop leadership skills, and serve your nation. Apply for NCC enrollment through our
            streamlined online system.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" className="px-8">
                Start Application
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Student Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose NCC?</h3>
            <p className="text-lg text-gray-600">Discover the benefits of joining the National Cadet Corps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Leadership Development</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Build confidence, develop leadership skills, and learn to work effectively in teams.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Character Building</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Develop discipline, integrity, and a strong sense of duty towards your nation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Skill Enhancement</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Learn valuable skills including drill, shooting, adventure activities, and more.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Explore More</h3>
            <p className="text-lg text-gray-600">Discover everything about NCC and stay updated</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/gallery" className="group">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Camera className="h-8 w-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-gray-900">Gallery</h4>
                  <p className="text-sm text-gray-600 mt-1">View photos & activities</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/news" className="group">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Newspaper className="h-8 w-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-gray-900">News</h4>
                  <p className="text-sm text-gray-600 mt-1">Latest updates</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/events" className="group">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-gray-900">Events</h4>
                  <p className="text-sm text-gray-600 mt-1">Upcoming activities</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/faq" className="group">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <HelpCircle className="h-8 w-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-gray-900">FAQ</h4>
                  <p className="text-sm text-gray-600 mt-1">Get answers</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Begin Your NCC Journey?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of cadets who have transformed their lives through NCC.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-8">
              Apply Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 NCC Enrollment System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
