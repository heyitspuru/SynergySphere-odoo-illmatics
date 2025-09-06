"use client"

import { useState } from "react"
import Layout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  MapPin,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Users,
  ExternalLink,
  Trophy,
  Globe,
  Building,
  CheckCircle,
  Star,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
interface PastHackathon {
  id: string
  name: string
  startDate: Date
  endDate: Date
  location: string
  isVirtual: boolean
  organizer: string
  organizerLogo: string
  description: string
  website: string
  categories: string[]
  winners: {
    name: string
    project: string
    prize: string
    image: string
  }[]
  participated: boolean
  participantsCount: number
  projectsCount: number
  projectUrl?: string
}

export default function PastHackathons() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedHackathon, setSelectedHackathon] = useState<PastHackathon | null>(null)

  // Sample past hackathons
  const [pastHackathons] = useState<PastHackathon[]>([
    {
      id: "1",
      name: "AI for Education Hackathon",
      startDate: new Date("2024-02-10"),
      endDate: new Date("2024-02-12"),
      location: "Virtual",
      isVirtual: true,
      organizer: "Future Learning Consortium",
      organizerLogo: "/placeholder.svg?height=40&width=40",
      description:
        "This hackathon focused on creating AI-powered solutions to enhance learning experiences and improve educational outcomes. Participants developed innovative tools for students, teachers, and educational institutions.",
      website: "aieducationhack.org",
      categories: ["Education", "AI", "Machine Learning"],
      winners: [
        {
          name: "Team Insight",
          project: "StudyBuddy AI",
          prize: "Grand Prize",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          name: "EduTech Innovators",
          project: "ClassroomIQ",
          prize: "Runner-up",
          image: "/placeholder.svg?height=40&width=40",
        },
      ],
      participated: true,
      participantsCount: 420,
      projectsCount: 85,
      projectUrl: "github.com/yourteam/project",
    },
    {
      id: "2",
      name: "Blockchain Innovation Challenge",
      startDate: new Date("2023-11-15"),
      endDate: new Date("2023-11-17"),
      location: "New York, NY",
      isVirtual: false,
      organizer: "Crypto Alliance",
      organizerLogo: "/placeholder.svg?height=40&width=40",
      description:
        "This hackathon brought together blockchain enthusiasts to build decentralized applications that solve real-world problems. Projects ranged from DeFi solutions to supply chain management systems.",
      website: "blockchaininnovation.io",
      categories: ["Blockchain", "DeFi", "Web3"],
      winners: [
        {
          name: "Chain Builders",
          project: "DecentralizedID",
          prize: "Grand Prize",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          name: "DeFi Disruptors",
          project: "LendingPool",
          prize: "Innovation Award",
          image: "/placeholder.svg?height=40&width=40",
        },
      ],
      participated: false,
      participantsCount: 350,
      projectsCount: 62,
    },
    {
      id: "3",
      name: "Healthcare Tech Hackathon",
      startDate: new Date("2023-09-22"),
      endDate: new Date("2023-09-24"),
      location: "Boston, MA",
      isVirtual: false,
      organizer: "MedTech Foundation",
      organizerLogo: "/placeholder.svg?height=40&width=40",
      description:
        "This hackathon focused on leveraging technology to improve healthcare delivery, patient outcomes, and medical research. Participants developed solutions ranging from patient monitoring systems to medical data analytics platforms.",
      website: "healthtechhack.org",
      categories: ["Healthcare", "IoT", "Data Science"],
      winners: [
        {
          name: "MedInnovate",
          project: "PatientConnect",
          prize: "Grand Prize",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          name: "Health Data Team",
          project: "MedInsight Analytics",
          prize: "Best Data Solution",
          image: "/placeholder.svg?height=40&width=40",
        },
      ],
      participated: true,
      participantsCount: 280,
      projectsCount: 48,
      projectUrl: "github.com/yourteam/medproject",
    },
    {
      id: "4",
      name: "Sustainability Solutions Hackathon",
      startDate: new Date("2023-07-08"),
      endDate: new Date("2023-07-10"),
      location: "Virtual",
      isVirtual: true,
      organizer: "Green Future Initiative",
      organizerLogo: "/placeholder.svg?height=40&width=40",
      description:
        "This hackathon challenged participants to create innovative solutions for environmental sustainability. Projects addressed issues like climate change, waste management, renewable energy, and sustainable agriculture.",
      website: "sustainabilityhack.org",
      categories: ["Sustainability", "CleanTech", "IoT"],
      winners: [
        {
          name: "EcoTech",
          project: "WasteTracker",
          prize: "Grand Prize",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          name: "Green Innovators",
          project: "SolarOptimize",
          prize: "Impact Award",
          image: "/placeholder.svg?height=40&width=40",
        },
      ],
      participated: false,
      participantsCount: 310,
      projectsCount: 58,
    },
    {
      id: "5",
      name: "Smart Cities Hackathon",
      startDate: new Date("2023-05-15"),
      endDate: new Date("2023-05-17"),
      location: "Chicago, IL",
      isVirtual: false,
      organizer: "Urban Tech Initiative",
      organizerLogo: "/placeholder.svg?height=40&width=40",
      description:
        "This hackathon focused on creating innovative technologies to make urban areas more efficient, sustainable, and livable. Participants developed solutions for transportation, energy management, public safety, and urban planning.",
      website: "smartcitieshack.org",
      categories: ["Smart Cities", "IoT", "Urban Planning"],
      winners: [
        {
          name: "Urban Innovators",
          project: "TrafficFlow",
          prize: "Grand Prize",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          name: "City Solutions",
          project: "SmartGrid",
          prize: "Technical Excellence",
          image: "/placeholder.svg?height=40&width=40",
        },
      ],
      participated: false,
      participantsCount: 290,
      projectsCount: 52,
    },
  ])

  // All categories (combined from all hackathons)
  const allCategories = Array.from(new Set(pastHackathons.flatMap((hackathon) => hackathon.categories))).sort()

  // All years
  const allYears = Array.from(
    new Set(pastHackathons.map((hackathon) => hackathon.endDate.getFullYear().toString())),
  ).sort((a, b) => Number.parseInt(b) - Number.parseInt(a))

  // Filter hackathons based on search and filters
  const filteredHackathons = pastHackathons.filter((hackathon) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      hackathon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.categories.some((category) => category.toLowerCase().includes(searchQuery.toLowerCase()))

    // Category filter
    const matchesCategory = selectedCategory === "" || hackathon.categories.includes(selectedCategory)

    // Year filter
    const matchesYear = selectedYear === "" || hackathon.endDate.getFullYear().toString() === selectedYear

    return matchesSearch && matchesCategory && matchesYear
  })

  // Format date range
  const formatDateRange = (startDate: Date, endDate: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
    const start = startDate.toLocaleDateString("en-US", options)
    const end = endDate.toLocaleDateString("en-US", options)
    return `${start} - ${end}, ${endDate.getFullYear()}`
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">Past Hackathons</h1>
          <p className="text-zinc-600 dark:text-zinc-300">Explore previous hackathon events and their outcomes</p>
        </div>

        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
              <Input
                placeholder="Search by name, description, or category..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full md:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Category</SelectItem>
                      {allCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Year</SelectItem>
                      {allYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hackathons List */}
        <div className="space-y-6">
          {filteredHackathons.length > 0 ? (
            filteredHackathons.map((hackathon) => (
              <Card key={hackathon.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    <div className="flex-shrink-0">
                      <Avatar className="w-16 h-16 rounded-lg">
                        <AvatarImage src={hackathon.organizerLogo} alt={hackathon.organizer} />
                        <AvatarFallback className="rounded-lg">{hackathon.organizer.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <CardTitle className="text-xl">{hackathon.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Building className="w-3.5 h-3.5" />
                            {hackathon.organizer}
                          </CardDescription>
                          <div className="flex flex-wrap items-center mt-2 text-xs gap-x-4 gap-y-1 text-zinc-500 dark:text-zinc-400">
                            <div className="flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1" />
                              {formatDateRange(hackathon.startDate, hackathon.endDate)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-3.5 h-3.5 mr-1" />
                              {hackathon.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3.5 h-3.5 mr-1" />
                              {hackathon.participantsCount} participants
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start gap-2 md:items-end">
                          {hackathon.isVirtual ? (
                            <Badge className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                              <Globe className="w-3 h-3 mr-1" />
                              Virtual
                            </Badge>
                          ) : (
                            <Badge className="text-purple-600 border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                              <MapPin className="w-3 h-3 mr-1" />
                              In-Person
                            </Badge>
                          )}
                          {hackathon.participated && (
                            <Badge className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Participated
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">{hackathon.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hackathon.categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="flex items-center text-sm font-medium">
                      <Trophy className="w-4 h-4 mr-2 text-amber-500 dark:text-amber-400" />
                      Winners
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {hackathon.winners.slice(0, 2).map((winner, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 border rounded-lg border-zinc-100 dark:border-zinc-800"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={winner.image} alt={winner.name} />
                            <AvatarFallback>{winner.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-zinc-900 dark:text-zinc-100">
                              {winner.name}
                            </p>
                            <p className="text-xs truncate text-zinc-500 dark:text-zinc-400">{winner.project}</p>
                          </div>
                          <Badge className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                            <Star className="w-3 h-3 mr-1" />
                            {winner.prize}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-3 border-t">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {hackathon.projectsCount} projects submitted
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedHackathon(hackathon)}>
                      View Details
                    </Button>
                    {hackathon.participated && hackathon.projectUrl && (
                      <a
                        href={`https://${hackathon.projectUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex"
                      >
                        <Button size="sm">View Our Project</Button>
                      </a>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="py-12 text-center border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-zinc-400 dark:text-zinc-600" />
              <h3 className="mb-2 text-lg font-medium text-zinc-900 dark:text-zinc-100">No hackathons found</h3>
              <p className="max-w-md mx-auto mb-6 text-zinc-600 dark:text-zinc-400">
                Try adjusting your filters or search query to find more past hackathons.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("")
                  setSelectedYear("")
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Hackathon Details Dialog */}
        {selectedHackathon && (
          <Dialog open={!!selectedHackathon} onOpenChange={(open) => !open && setSelectedHackathon(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedHackathon.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  {selectedHackathon.organizer}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center text-sm gap-x-4 gap-y-2 text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDateRange(selectedHackathon.startDate, selectedHackathon.endDate)}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedHackathon.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {selectedHackathon.participantsCount} participants
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedHackathon.isVirtual ? (
                    <Badge className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                      <Globe className="w-3 h-3 mr-1" />
                      Virtual
                    </Badge>
                  ) : (
                    <Badge className="text-purple-600 border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                      <MapPin className="w-3 h-3 mr-1" />
                      In-Person
                    </Badge>
                  )}
                  {selectedHackathon.participated && (
                    <Badge className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Participated
                    </Badge>
                  )}
                </div>

                <Tabs defaultValue="about" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="winners">Winners</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  <TabsContent value="about" className="pt-4">
                    <div className="space-y-4">
                      <p className="text-zinc-600 dark:text-zinc-300">{selectedHackathon.description}</p>
                      <div>
                        <h3 className="mb-2 text-sm font-medium">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedHackathon.categories.map((category) => (
                            <Badge key={category} variant="outline">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="winners" className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {selectedHackathon.winners.map((winner, index) => (
                          <div key={index} className="flex items-center gap-3 p-4 border rounded-lg border-zinc-100 dark:border-zinc-800">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={winner.image} alt={winner.name} />
                              <AvatarFallback>{winner.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{winner.name}</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">{winner.project}</p>
                              <Badge className="mt-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                                <Star className="w-3 h-3 mr-1" />
                                {winner.prize}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="details" className="pt-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Projects Submitted</h3>
                        <p className="text-zinc-600 dark:text-zinc-300">{selectedHackathon.projectsCount} projects</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Website</h3>
                        <a
                          href={`https://${selectedHackathon.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {selectedHackathon.website}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Participants</h3>
                        <p className="text-zinc-600 dark:text-zinc-300">
                          {selectedHackathon.participantsCount} registered
                        </p>
                      </div>
                      {selectedHackathon.participated && selectedHackathon.projectUrl && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Your Project</h3>
                          <a
                            href={`https://${selectedHackathon.projectUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {selectedHackathon.projectUrl}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter className="flex justify-between">
                <a
                  href={`https://${selectedHackathon.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                </a>
                {selectedHackathon.participated && selectedHackathon.projectUrl ? (
                  <a
                    href={`https://${selectedHackathon.projectUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button>View Our Project</Button>
                  </a>
                ) : (
                  <Button variant="outline" disabled={!selectedHackathon.participated}>
                    {selectedHackathon.participated ? "No Project Submitted" : "Did Not Participate"}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  )
}
