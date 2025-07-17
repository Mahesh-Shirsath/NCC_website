"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react"
import { MainNav } from "@/components/main-nav"

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
  display_order: number
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openItems, setOpenItems] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFAQs()
  }, [])

  useEffect(() => {
    let filtered = faqs

    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredFaqs(filtered)
  }, [faqs, selectedCategory, searchTerm])

  const fetchFAQs = async () => {
    try {
      const response = await fetch("/api/faqs")
      if (response.ok) {
        const data = await response.json()
        setFaqs(data)
        setFilteredFaqs(data)
      }
    } catch (error) {
      console.error("Failed to fetch FAQs:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "enrollment", label: "Enrollment" },
    { value: "training", label: "Training" },
    { value: "benefits", label: "Benefits" },
    { value: "documents", label: "Documents" },
    { value: "general", label: "General" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading FAQs...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How can we help you?</h2>
          <p className="text-lg text-gray-600">Find answers to common questions about NCC enrollment and training</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        {filteredFaqs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <HelpCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search terms." : "No FAQs available in this category."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <Card key={faq.id}>
                <Collapsible>
                  <CollapsibleTrigger className="w-full" onClick={() => toggleItem(faq.id)}>
                    <CardHeader className="hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-3">
                          <Badge variant="outline" className="mt-1">
                            {faq.category}
                          </Badge>
                          <CardTitle className="text-left text-lg font-medium">{faq.question}</CardTitle>
                        </div>
                        {openItems.includes(faq.id) ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="pl-16">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        )}

        {/* Contact Section */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Still have questions?</h3>
            <p className="text-blue-700 mb-4">
              Can't find what you're looking for? Contact our support team for assistance.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">Contact Support</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
