"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Target, Users, Award, BookOpen, Heart } from "lucide-react"
import { MainNav } from "@/components/main-nav"

export default function AboutPage() {
  const objectives = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Character Development",
      description:
        "To develop character, comradeship, discipline, leadership, secular outlook, spirit of adventure and ideals of selfless service",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Unity & Integration",
      description:
        "To create a human resource of organized, trained and motivated youth to provide leadership in all walks of life",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "National Service",
      description: "To provide a suitable environment to motivate the youth to take up a career in the armed forces",
    },
  ]

  const wings = [
    {
      name: "Army Wing",
      description: "Focuses on military training, drill, and leadership development",
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Navy Wing",
      description: "Emphasizes naval traditions, seamanship, and maritime activities",
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "Air Force Wing",
      description: "Concentrates on aviation, aerospace knowledge, and air force traditions",
      color: "bg-sky-100 text-sky-800",
    },
  ]

  const achievements = [
    "Over 13 lakh cadets enrolled across India",
    "Recognized as the largest uniformed youth organization",
    "Significant contribution to national integration",
    "Excellence in adventure activities and sports",
    "Outstanding performance in Republic Day parades",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">National Cadet Corps</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The National Cadet Corps is a voluntary organization which recruits cadets from high schools, colleges and
            universities all over India. The NCC is open to all regular students of schools and colleges.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-6 w-6 mr-2 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                To develop character, comradeship, discipline, a secular outlook, the spirit of adventure, and ideals of
                selfless service amongst young citizens of the country and to create a pool of organized, trained and
                motivated youth with leadership qualities in all walks of life.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-6 w-6 mr-2 text-red-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                To empower volunteer youth to become able leaders and useful citizens of the country. To provide a
                suitable environment to motivate young Indians to take up a career in the Armed Forces and contribute to
                national development.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* NCC Motto */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="text-center py-8">
            <h3 className="text-3xl font-bold text-blue-900 mb-4">Unity and Discipline</h3>
            <p className="text-lg text-blue-700">
              The motto of NCC emphasizes the importance of unity among people of different backgrounds and the need for
              discipline in all aspects of life.
            </p>
          </CardContent>
        </Card>

        {/* Objectives */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Objectives</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {objectives.map((objective, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                    {objective.icon}
                  </div>
                  <CardTitle className="text-lg">{objective.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{objective.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Wings */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">NCC Wings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wings.map((wing, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{wing.name}</CardTitle>
                    <Badge className={wing.color}>{wing.name.split(" ")[0]}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{wing.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center text-center justify-center">
              <Award className="h-6 w-6 mr-2 text-yellow-600" />
              Key Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <p className="text-gray-700">{achievement}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Training Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-center justify-center">
              <BookOpen className="h-6 w-6 mr-2 text-green-600" />
              Training Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                "Drill & Parade",
                "Weapon Training",
                "Adventure Activities",
                "Social Service",
                "Cultural Programs",
                "Sports & Games",
                "Leadership Training",
                "National Integration",
              ].map((activity, index) => (
                <div key={index} className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">{activity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
