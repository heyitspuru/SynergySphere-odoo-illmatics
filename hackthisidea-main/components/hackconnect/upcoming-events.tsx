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
  Clock,
  Users,
  ExternalLink,
  Tag,
  CheckCircle,
  Globe,
  Building,
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
interface Hackathon {
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
  prizes: string[]
  teamSize: string
  registered: boolean
  registrationDeadline: Date
  participantsCount: number
}

export default function UpcomingEvents() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null)
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false)

  // Sample hackathons
  const [hackathons, setHackathons] = useState<Hackathon[]>([
    {
      id: "1",
      name: "Global Health Hackathon",
      startDate: new Date("2024-03-15"),
      endDate: new Date("2024-03-17"),
      location: "Virtual",
      isVirtual: true,
      organizer: "HealthTech Foundation",
      organizerLogo: "/placeholder.svg?height=40&width=40",
      description:
        "Join innovators from around the world to develop solutions for pressing global health challenges. This virtual hackathon focuses on leveraging technology to improve healthcare accessibility, affordability, and quality.",
      website: "healthtechhackathon.org",
      categories: ["Healthcare", "AI", "Mobile Apps", "Data Science"],
      prizes: ["$10,000 Grand Prize", "Cloud Credits", "Mentorship Opportunities"],
      teamSize: "2-5 members",
      registered: true,
      registrationDeadline: new Date("2024-03-10"),
      participantsCount: 850,
    },
    {
      id: "2",
      name: "Climate Tech Challenge",
      startDate: new Date("2024-04-05"),
      endDate: new Date("2024-04-07"),
      location: "San Francisco, CA",
      isVirtual: false,
      organizer: "GreenFuture Initiative",
      organizerLogo: "/placeholder.svg?height=40&width=40",
      description:
        "Tackle climate change with innovative technology solutions. This in-person hackathon brings together engineers, designers, and entrepreneurs to create sustainable solutions for a greener future.",
      website: "climatetechchallenge.com",
      categories: ["Sustainability", "Clean Energy", "IoT", "Smart Cities"],
      prizes: ["$15,000 in Prizes", "Incubator Access", "Investor Meetings"],
      teamSize: "3-4 members",
      registered: false,
      registrationDeadline: new Date("2024-03-25"),
      participantsCount: 320,
    },
    {
      id: "3",
      name: "EdTech Innovation Jam",
      startDate: new Date("2024-05-12"),
      endDate: new Date("2024-05-14"),
      location: "Virtual",
      isVirtual: true,
      organizer: "Future Learning Consortium",
      organizerLogo: "/placeholder.svg?height=40&width=40",
      description:
        "Reimagine education through technology. This hackathon focuses on creating innovative solutions to enhance learning experiences, improve educational outcomes, and make quality education more accessible.",
      website: "edtechjam.org",
      categories: ["Education", "AR/VR", "AI", "Gamification"],
      prizes: ["$8,000 in Prizes", "Pilot Opportunities", "Mentorship"],
      teamSize: "2-5 members",
      registered: false,
      registrationDeadline: new Date("2024-05-01"),
      participantsCount: 450,
    },
    {
      id: "4",
      name: "Fintech Disruption Hackathon",
      startDate: new Date("2024-06-08"),
      endDate: new Date("2024-06-10"),
      location: "New York, NY",
      isVirtual: false,
      organizer: "Financial Innovation Alliance",
      organizerLogo: "/placeholder.svg?height=40&width=40",
      description:
        "Disrupt traditional financial services with innovative technology solutions. This hackathon brings together developers, designers, and financial experts to create the next generation of fintech products.",
      website: "fintechdisrupt.com",
      categories: ["Fintech", "Blockchain", "AI", "Security"],
      prizes: ["$20,000 Grand Prize", "Accelerator Program", "VC Connections"],
      teamSize: "2-4 members",
      registered: false,
      registrationDeadline: new Date("2024-05-25"),
      participantsCount: 280,
    },
    {
      id: "5",
      name: "Smart Cities Hackathon",
      startDate: new Date("2024-07-15"),
      endDate: new Date("2024-07-17"),
      location: "Chicago, IL",
      isVirtual: false,
      organizer: "Urban Tech Initiative",
      organizerLogo: "/placeholder.svg?height=40&width=40",
      description:
        "Build solutions for the cities of tomorrow. This hackathon focuses on creating innovative technologies to make urban areas more efficient, sustainable, and livable.",
      website: "smartcitieshack.org",
      categories: ["IoT", "Smart Cities", "Sustainability", "Data Analytics"],
      prizes: ["$12,000 in Prizes", "Pilot with City Partners", "Incubation Support"],
      teamSize: "3-5 members",
      registered: false,
      registrationDeadline: new Date("2024-07-01"),
      participantsCount: 350,
    },
  ])

  // All categories (combined from all hackathons)
  const allCategories = Array.from(new Set(hackathons.flatMap((hackathon) => hackathon.categories))).sort()

  // All locations
  const allLocations = Array.from(new Set(hackathons.map((hackathon) => hackathon.location))).sort()

  // Filter hackathons based on search and filters
  const filteredHackathons = hackathons.filter((hackathon) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      hackathon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.categories.some((category) => category.toLowerCase().includes(searchQuery.toLowerCase()))

    // Category filter
    const matchesCategory = selectedCategory === "" || hackathon.categories.includes(selectedCategory)

    // Location filter
    const matchesLocation = selectedLocation === "" || hackathon.location === selectedLocation

    return matchesSearch && matchesCategory && matchesLocation
  })

  // Register for a hackathon
  const registerForHackathon = (hackathonId: string) => {
    setHackathons(
      hackathons.map((hackathon) => (hackathon.id === hackathonId ? { ...hackathon, registered: true } : hackathon)),
    )
    setShowRegistrationDialog(false)
  }

  // Format date range
  const formatDateRange = (startDate: Date, endDate: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
    const start = startDate.toLocaleDateString("en-US", options)
    const end = endDate.toLocaleDateString("en-US", options)
    return `${start} - ${end}, ${endDate.getFullYear()}`
  }

  // Calculate days remaining
  const getDaysRemaining = (date: Date) => {
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Upcoming Hackathons</h1>
          <p className="text-zinc-600 dark:text-zinc-300">Discover and register for upcoming hackathon events</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search by name, description, or category..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:w-auto w-full">
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="text-sm font-medium">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Location</SelectItem>
                      {allLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
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
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-shrink-0">
                      <Avatar className="h-16 w-16 rounded-lg">
                        <AvatarImage src={hackathon.organizerLogo} alt={hackathon.organizer} />
                        <AvatarFallback className="rounded-lg">{hackathon.organizer.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <CardTitle className="text-xl">{hackathon.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Building className="w-3.5 h-3.5" />
                            {hackathon.organizer}
                          </CardDescription>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 mt-2">
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
                        <div className="flex flex-col items-start md:items-end gap-2">
                          {hackathon.isVirtual ? (
                            <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                              <Globe className="w-3 h-3 mr-1" />
                              Virtual
                            </Badge>
                          ) : (
                            <Badge className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                              <MapPin className="w-3 h-3 mr-1" />
                              In-Person
                            </Badge>
                          )}
                          {hackathon.registered && (
                            <Badge className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Registered
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 mb-4">{hackathon.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hackathon.categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Team Size</p>
                      <p className="text-zinc-900 dark:text-zinc-100">{hackathon.teamSize}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Registration Deadline</p>
                      <p className="text-zinc-900 dark:text-zinc-100">
                        {hackathon.registrationDeadline.toLocaleDateString()}
                        <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                          ({getDaysRemaining(hackathon.registrationDeadline)} days left)
                        </span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Website</p>
                      <a
                        href={`https://${hackathon.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                      >
                        {hackathon.website}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-3">
                  <Button variant="outline" size="sm" onClick={() => setSelectedHackathon(hackathon)}>
                    View Details
                  </Button>
                  {!hackathon.registered ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedHackathon(hackathon)
                        setShowRegistrationDialog(true)
                      }}
                    >
                      Register Now
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      Manage Registration
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-zinc-400 dark:text-zinc-600" />
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">No hackathons found</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md mx-auto">
                Try adjusting your filters or search query to find more upcoming hackathons.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("")
                  setSelectedLocation("")
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Hackathon Details Dialog */}
        {selectedHackathon && (
          <Dialog
            open={!!selectedHackathon && !showRegistrationDialog}
            onOpenChange={(open) => !open && setSelectedHackathon(null)}
          >
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedHackathon.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  {selectedHackathon.organizer}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
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
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Registration Deadline: {selectedHackathon.registrationDeadline.toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedHackathon.isVirtual ? (
                    <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                      <Globe className="w-3 h-3 mr-1" />
                      Virtual
                    </Badge>
                  ) : (
                    <Badge className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                      <MapPin className="w-3 h-3 mr-1" />
                      In-Person
                    </Badge>
                  )}
                  {selectedHackathon.registered && (
                    <Badge className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Registered
                    </Badge>
                  )}
                </div>

                <Tabs defaultValue="about" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="prizes">Prizes</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  <TabsContent value="about" className="pt-4">
                    <div className="space-y-4">
                      <p className="text-zinc-600 dark:text-zinc-300">{selectedHackathon.description}</p>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Categories</h3>
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
                  <TabsContent value="prizes" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium mb-2">Prizes</h3>
                      <ul className="space-y-2">
                        {selectedHackathon.prizes.map((prize, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Tag className="w-4 h-4 mt-0.5 text-amber-500 dark:text-amber-400" />
                            <span>{prize}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="details" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Team Size</h3>
                        <p className="text-zinc-600 dark:text-zinc-300">{selectedHackathon.teamSize}</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Website</h3>
                        <a
                          href={`https://${selectedHackathon.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                        >
                          {selectedHackathon.website}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Registration Deadline</h3>
                        <p className="text-zinc-600 dark:text-zinc-300">
                          {selectedHackathon.registrationDeadline.toLocaleDateString()}
                          <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                            ({getDaysRemaining(selectedHackathon.registrationDeadline)} days left)
                          </span>
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Participants</h3>
                        <p className="text-zinc-600 dark:text-zinc-300">
                          {selectedHackathon.participantsCount} registered
                        </p>
                      </div>
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
                {!selectedHackathon.registered ? (
                  <Button
                    onClick={() => {
                      setShowRegistrationDialog(true)
                    }}
                  >
                    Register Now
                  </Button>
                ) : (
                  <Button variant="outline">Manage Registration</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Registration Dialog */}
        {selectedHackathon && showRegistrationDialog && (
          <Dialog open={showRegistrationDialog} onOpenChange={setShowRegistrationDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register for {selectedHackathon.name}</DialogTitle>
                <DialogDescription>
                  Complete your registration for this hackathon. You can update your team members later.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Event Date:</span>
                  <span>{formatDateRange(selectedHackathon.startDate, selectedHackathon.endDate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Location:</span>
                  <span>{selectedHackathon.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Team Size:</span>
                  <span>{selectedHackathon.teamSize}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Registration Deadline:</span>
                  <span>{selectedHackathon.registrationDeadline.toLocaleDateString()}</span>
                </div>

                <div className="border-t border-b border-zinc-200 dark:border-zinc-800 py-4 my-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-2">
                    By registering, you agree to the hackathon's rules and code of conduct.
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    You can add or update your team members after registration.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRegistrationDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => registerForHackathon(selectedHackathon.id)}>Confirm Registration</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  )
}
