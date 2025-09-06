"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState } from "react"
import Layout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Search,
  Filter,
  MapPin,
  Code,
  MessageSquare,
  UserPlus,
  Clock,
  ChevronDown,
  ChevronUp,
  Star,
  Plus,
  Mail,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Types
interface UserProfile {
  id: string
  name: string
  avatar: string
  role: string
  location: string
  experience: "beginner" | "intermediate" | "advanced"
  skills: string[]
  interests: string[]
  bio: string
  availability: "weekends" | "evenings" | "full-time"
  github?: string
  linkedin?: string
  website?: string
  email?: string
}

interface TeamProfile {
  id: string
  name: string
  description: string
  hackathon: string
  hackathonDate: string
  projectIdea: string
  lookingFor: string[]
  members: UserProfile[]
  createdBy: UserProfile
  createdAt: Date
}

interface TeamRequest {
  id: string
  user: UserProfile
  status: "pending" | "accepted" | "declined"
  message: string
  timestamp: Date
  projectIdea?: string
}

export default function TeamBuilder() {
  // State for the team builder
  const [activeTab, setActiveTab] = useState("find")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState("")
  const [experienceLevel, setExperienceLevel] = useState([50])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<TeamProfile | null>(null)
  const [showJoinTeamDialog, setShowJoinTeamDialog] = useState(false)
  const [joinMessage, setJoinMessage] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedHackathonType, setSelectedHackathonType] = useState("")

  // Sample team requests
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([
    {
      id: "req1",
      user: {
        id: "user3",
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "UX/UI Designer",
        location: "San Francisco, CA",
        experience: "intermediate",
        skills: ["UI Design", "User Research", "Figma", "Prototyping"],
        interests: ["Healthcare", "Education", "Accessibility"],
        bio: "UX/UI designer with 3 years of experience creating intuitive digital experiences.",
        availability: "evenings",
        github: "github.com/emilychen",
        linkedin: "linkedin.com/in/emilychen",
        email: "emily@example.com",
      },
      status: "pending",
      message:
        "Hi! I saw your profile and I think your frontend skills would complement my design background perfectly. Would you be interested in teaming up for the upcoming health tech hackathon?",
      timestamp: new Date("2023-11-10T14:30:00"),
      projectIdea: "Health Monitoring Dashboard",
    },
    {
      id: "req2",
      user: {
        id: "user4",
        name: "Marcus Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Backend Developer",
        location: "Chicago, IL",
        experience: "advanced",
        skills: ["Node.js", "Python", "MongoDB", "AWS"],
        interests: ["Fintech", "Blockchain", "Data Analytics"],
        bio: "Backend developer specializing in scalable architectures and database design.",
        availability: "weekends",
        github: "github.com/marcusj",
        linkedin: "linkedin.com/in/marcusj",
        email: "marcus@example.com",
      },
      status: "accepted",
      message:
        "I'm working on a blockchain-based payment solution for the fintech hackathon and looking for a frontend developer. Your React experience would be perfect for our team!",
      timestamp: new Date("2023-11-08T09:15:00"),
      projectIdea: "Decentralized Payment Platform",
    },
  ])

  // Sample users
  const users: UserProfile[] = [
    {
      id: "user1",
      name: "Sarah Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Frontend Developer",
      location: "New York, NY",
      experience: "intermediate",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      interests: ["Education", "Sustainability", "Health"],
      bio: "Frontend developer passionate about creating accessible and intuitive user interfaces.",
      availability: "weekends",
      github: "github.com/sarahkim",
      linkedin: "linkedin.com/in/sarahkim",
      website: "sarahkim.dev",
      email: "sarah@example.com",
    },
    {
      id: "user2",
      name: "David Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Full Stack Developer",
      location: "Austin, TX",
      experience: "advanced",
      skills: ["JavaScript", "Python", "React", "Node.js", "PostgreSQL"],
      interests: ["Fintech", "AI", "Cybersecurity"],
      bio: "Full stack developer with 5+ years of experience building web applications and APIs.",
      availability: "full-time",
      github: "github.com/davidr",
      linkedin: "linkedin.com/in/davidr",
      email: "david@example.com",
    },
    {
      id: "user5",
      name: "Priya Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Data Scientist",
      location: "Seattle, WA",
      experience: "intermediate",
      skills: ["Python", "TensorFlow", "Data Analysis", "Machine Learning"],
      interests: ["Healthcare", "Climate", "Social Impact"],
      bio: "Data scientist focused on applying ML to solve real-world problems.",
      availability: "evenings",
      github: "github.com/priyap",
      linkedin: "linkedin.com/in/priyap",
      email: "priya@example.com",
    },
    {
      id: "user6",
      name: "James Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Mobile Developer",
      location: "Boston, MA",
      experience: "beginner",
      skills: ["React Native", "Swift", "Firebase", "UI Design"],
      interests: ["Education", "Fitness", "Productivity"],
      bio: "Mobile developer with a passion for creating intuitive and engaging apps.",
      availability: "weekends",
      github: "github.com/jamesw",
      linkedin: "linkedin.com/in/jamesw",
      email: "james@example.com",
    },
  ]

  // Sample teams
  const [teams, setTeams] = useState<TeamProfile[]>([
    {
      id: "team1",
      name: "HealthTech Innovators",
      description: "Building a health monitoring dashboard for patients with chronic conditions.",
      hackathon: "Global Health Hackathon",
      hackathonDate: "March 15-17, 2024",
      projectIdea: "Health Monitoring Dashboard",
      lookingFor: ["Frontend Developer", "UI/UX Designer", "Data Scientist"],
      members: [
        {
          id: "user4",
          name: "Marcus Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Backend Developer",
          location: "Chicago, IL",
          experience: "advanced",
          skills: ["Node.js", "Python", "MongoDB", "AWS"],
          interests: ["Fintech", "Blockchain", "Data Analytics"],
          bio: "Backend developer specializing in scalable architectures and database design.",
          availability: "weekends",
          github: "github.com/marcusj",
          linkedin: "linkedin.com/in/marcusj",
          email: "marcus@example.com",
        },
      ],
      createdBy: {
        id: "user4",
        name: "Marcus Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Backend Developer",
        location: "Chicago, IL",
        experience: "advanced",
        skills: ["Node.js", "Python", "MongoDB", "AWS"],
        interests: ["Fintech", "Blockchain", "Data Analytics"],
        bio: "Backend developer specializing in scalable architectures and database design.",
        availability: "weekends",
        github: "github.com/marcusj",
        linkedin: "linkedin.com/in/marcusj",
        email: "marcus@example.com",
      },
      createdAt: new Date("2024-02-15"),
    },
    {
      id: "team2",
      name: "EcoTech Solutions",
      description: "Developing a mobile app to track and reduce carbon footprint.",
      hackathon: "Climate Tech Challenge",
      hackathonDate: "April 5-7, 2024",
      projectIdea: "Carbon Footprint Tracker",
      lookingFor: ["Mobile Developer", "Backend Developer", "UI/UX Designer"],
      members: [
        {
          id: "user1",
          name: "Sarah Kim",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Frontend Developer",
          location: "New York, NY",
          experience: "intermediate",
          skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
          interests: ["Education", "Sustainability", "Health"],
          bio: "Frontend developer passionate about creating accessible and intuitive user interfaces.",
          availability: "weekends",
          github: "github.com/sarahkim",
          linkedin: "linkedin.com/in/sarahkim",
          website: "sarahkim.dev",
          email: "sarah@example.com",
        },
      ],
      createdBy: {
        id: "user1",
        name: "Sarah Kim",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Frontend Developer",
        location: "New York, NY",
        experience: "intermediate",
        skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
        interests: ["Education", "Sustainability", "Health"],
        bio: "Frontend developer passionate about creating accessible and intuitive user interfaces.",
        availability: "weekends",
        github: "github.com/sarahkim",
        linkedin: "linkedin.com/in/sarahkim",
        website: "sarahkim.dev",
        email: "sarah@example.com",
      },
      createdAt: new Date("2024-02-20"),
    },
    {
      id: "team3",
      name: "EdTech Pioneers",
      description: "Creating an AI-powered learning platform for personalized education.",
      hackathon: "EdTech Innovation Jam",
      hackathonDate: "May 12-14, 2024",
      projectIdea: "AI Learning Assistant",
      lookingFor: ["AI/ML Engineer", "Frontend Developer", "Education Expert"],
      members: [
        {
          id: "user5",
          name: "Priya Patel",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Data Scientist",
          location: "Seattle, WA",
          experience: "intermediate",
          skills: ["Python", "TensorFlow", "Data Analysis", "Machine Learning"],
          interests: ["Healthcare", "Climate", "Social Impact"],
          bio: "Data scientist focused on applying ML to solve real-world problems.",
          availability: "evenings",
          github: "github.com/priyap",
          linkedin: "linkedin.com/in/priyap",
          email: "priya@example.com",
        },
      ],
      createdBy: {
        id: "user5",
        name: "Priya Patel",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Data Scientist",
        location: "Seattle, WA",
        experience: "intermediate",
        skills: ["Python", "TensorFlow", "Data Analysis", "Machine Learning"],
        interests: ["Healthcare", "Climate", "Social Impact"],
        bio: "Data scientist focused on applying ML to solve real-world problems.",
        availability: "evenings",
        github: "github.com/priyap",
        linkedin: "linkedin.com/in/priyap",
        email: "priya@example.com",
      },
      createdAt: new Date("2024-02-25"),
    },
  ])

  // Skills list
  const allSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Angular",
    "Vue.js",
    "Next.js",
    "Node.js",
    "Python",
    "Java",
    "C#",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Firebase",
    "Redis",
    "Machine Learning",
    "Data Science",
    "AI",
    "Blockchain",
    "UI Design",
    "UX Design",
    "Figma",
    "Adobe XD",
    "Sketch",
    "Product Management",
    "Agile",
    "Scrum",
    "DevOps",
  ]

  // Locations
  const locations = [
    "New York, NY",
    "San Francisco, CA",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
    "Chicago, IL",
    "Los Angeles, CA",
    "Denver, CO",
    "Remote",
  ]

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      user.interests.some((interest) => interest.toLowerCase().includes(searchQuery.toLowerCase()))

    // Skills filter
    const matchesSkills = selectedSkills.length === 0 || selectedSkills.every((skill) => user.skills.includes(skill))

    // Location filter
    const matchesLocation = selectedLocation === "" || user.location === selectedLocation

    // Experience level filter (beginner: 0-33, intermediate: 34-66, advanced: 67-100)
    let matchesExperience = true
    const expLevel = experienceLevel[0]
    if (expLevel < 33 && user.experience !== "beginner") matchesExperience = false
    else if (expLevel >= 33 && expLevel <= 66 && user.experience !== "intermediate") matchesExperience = false
    else if (expLevel > 66 && user.experience !== "advanced") matchesExperience = false

    return matchesSearch && matchesSkills && matchesLocation && matchesExperience
  })

  // Filter teams based on search
  const filteredTeams = teams.filter((team) => {
    return (
      searchQuery === "" ||
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.projectIdea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.lookingFor.some((role) => role.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  // Handle sending a team request
  const sendTeamRequest = (user: UserProfile) => {
    // In a real app, this would send a request to the backend
    alert(`Team request sent to ${user.name}!`)
  }

  // Handle responding to a team request
  const respondToRequest = (requestId: string, status: "accepted" | "declined") => {
    setTeamRequests(teamRequests.map((request) => (request.id === requestId ? { ...request, status } : request)))
  }

  // Handle joining a team
  const handleJoinTeam = () => {
    if (!selectedTeam) return

    alert(`Request to join ${selectedTeam.name} sent!`)
    setShowJoinTeamDialog(false)
    setJoinMessage("")
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Team Builder</h1>
          <p className="text-zinc-600 dark:text-zinc-300">Find the perfect teammates for your next hackathon project</p>
        </div>

        <Tabs defaultValue="find" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="find" className="text-sm">
              <Search className="w-4 h-4 mr-2" />
              Find Teammates
            </TabsTrigger>
            <TabsTrigger value="teams" className="text-sm">
              <Users className="w-4 h-4 mr-2" />
              Find Teams
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Team Requests ({teamRequests.filter((r) => r.status === "pending").length})
            </TabsTrigger>
          </TabsList>

          {/* Find Teammates Tab */}
          <TabsContent value="find" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                  <Input
                    placeholder="Search teams by name, project, or technologies..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:w-auto w-full flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
            </div>

            {/* Simplified Filters */}
            {showFilters && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role Needed</label>
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any role</SelectItem>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Hackathon Type</label>
                      <Select value={selectedHackathonType} onValueChange={setSelectedHackathonType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any type</SelectItem>
                          {hackathonTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any location</SelectItem>
                          {locations.map((location) => (
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

            {/* Teams Grid - Simplified card layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTeams.map((team) => (
                <Card key={team.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{team.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Hackathon: {team.hackathon} ({team.hackathonDate})
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-4">
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">{team.description}</p>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1.5">Looking for:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {team.lookingFor.map((role) => (
                            <Badge key={role} variant="outline">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1.5">Team members ({team.members.length}):</h4>
                        <div className="flex -space-x-2">
                          {team.members.map((member, index) => (
                            <Avatar key={member.id} className="border-2 border-background">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => setSelectedTeam(team)}>
                      View Team
                    </Button>
                    <Button size="sm" onClick={() => {
                      setSelectedTeam(team);
                      setShowJoinTeamDialog(true);
                    }}>
                      Join Team
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* View Team Dialog */}
            {selectedTeam && !showJoinTeamDialog && (
              <Dialog open={!!selectedTeam && !showJoinTeamDialog} onOpenChange={(open) => !open && setSelectedTeam(null)}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{selectedTeam.name}</DialogTitle>
                    <DialogDescription>
                      Hackathon: {selectedTeam.hackathon} ({selectedTeam.hackathonDate})
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Project Description</h3>
                      <p className="text-zinc-600 dark:text-zinc-300">{selectedTeam.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Project Idea</h3>
                      <p className="text-zinc-600 dark:text-zinc-300">{selectedTeam.projectIdea}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Looking For</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTeam.lookingFor.map((role) => (
                          <Badge key={role}>{role}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Team Members</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedTeam.members.map((member) => (
                          <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <Avatar>
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-zinc-500">{member.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Team Lead</h3>
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Avatar>
                          <AvatarImage src={selectedTeam.createdBy.avatar} alt={selectedTeam.createdBy.name} />
                          <AvatarFallback>{selectedTeam.createdBy.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{selectedTeam.createdBy.name}</div>
                          <div className="text-sm text-zinc-500">{selectedTeam.createdBy.role}</div>
                          <a href={`mailto:${selectedTeam.createdBy.email}`} className="text-sm text-primary hover:underline flex items-center mt-1">
                            <Mail className="w-3.5 h-3.5 mr-1" />
                            Contact
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter className="flex gap-2 justify-between">
                    <Button variant="outline" onClick={() => setSelectedTeam(null)}>Close</Button>
                    <Button onClick={() => setShowJoinTeamDialog(true)}>Join Team</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          {/* Find Teams Tab */}
          <TabsContent value="teams" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                  <Input
                    placeholder="Search for teams by name, project idea, or roles needed..."
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

            {/* Teams List */}
            <div className="grid grid-cols-1 gap-6">
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => (
                  <Card key={team.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {team.hackathon} • {team.hackathonDate}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                        >
                          {team.members.length} member{team.members.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">{team.description}</p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-medium mb-1.5">Project Idea</h4>
                          <p className="text-sm text-zinc-600 dark:text-zinc-300">{team.projectIdea}</p>
                        </div>

                        <div>
                          <h4 className="text-xs font-medium mb-1.5">Looking For</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {team.lookingFor.map((role) => (
                              <Badge key={role} variant="secondary" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-medium mb-1.5">Team Members</h4>
                          <div className="flex -space-x-2">
                            {team.members.map((member) => (
                              <Avatar key={member.id} className="h-8 w-8 border-2 border-white dark:border-zinc-900">
                                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 border-2 border-white dark:border-zinc-900 flex items-center justify-center">
                              <Plus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={team.createdBy.avatar || "/placeholder.svg"} alt={team.createdBy.name} />
                          <AvatarFallback>{team.createdBy.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          Created by <span className="font-medium">{team.createdBy.name}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTeam(team)
                          }}
                        >
                          View Team
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedTeam(team)
                            setShowJoinTeamDialog(true)
                          }}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Join Team
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl">
                  <Users className="w-12 h-12 mx-auto mb-4 text-zinc-400 dark:text-zinc-600" />
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">No matching teams found</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md mx-auto">
                    Try adjusting your search query to find more teams, or create your own team.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                    }}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Team Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Team Requests</h2>
                <Badge variant="outline">{teamRequests.length}</Badge>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {teamRequests.length > 0 ? (
              <div className="space-y-4">
                {teamRequests.map((request) => (
                  <Card
                    key={request.id}
                    className={`
                    ${
                      request.status === "accepted"
                        ? "border-l-4 border-l-green-500"
                        : request.status === "declined"
                          ? "border-l-4 border-l-red-500"
                          : ""
                    }
                  `}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.user.avatar || "/placeholder.svg"} alt={request.user.name} />
                          <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{request.user.name}</CardTitle>
                              <CardDescription className="flex items-center gap-1">
                                <Code className="w-3.5 h-3.5" />
                                {request.user.role}
                              </CardDescription>
                            </div>
                            <Badge
                              variant={
                                request.status === "accepted"
                                  ? "success"
                                  : request.status === "declined"
                                    ? "destructive"
                                    : "outline"
                              }
                            >
                              {request.status === "accepted"
                                ? "Accepted"
                                : request.status === "declined"
                                  ? "Declined"
                                  : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-3">{request.message}</p>
                      {request.projectIdea && (
                        <div>
                          <h4 className="text-xs font-medium mb-1.5">Project Idea</h4>
                          <p className="text-sm text-zinc-600 dark:text-zinc-300">{request.projectIdea}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-3">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Sent {request.timestamp.toLocaleDateString()}
                      </div>
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => respondToRequest(request.id, "declined")}>
                            Decline
                          </Button>
                          <Button size="sm" onClick={() => respondToRequest(request.id, "accepted")}>
                            Accept
                          </Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-zinc-400 dark:text-zinc-600" />
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">No team requests yet</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md mx-auto">
                  When someone invites you to join their team or requests to join your team, it will appear here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Join Team Dialog */}
      <Dialog open={showJoinTeamDialog} onOpenChange={setShowJoinTeamDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join {selectedTeam?.name}</DialogTitle>
            <DialogDescription>
              Send a request to join this team. Include a brief message about why you'd like to join.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="I'd like to join your team because..."
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinTeamDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleJoinTeam} disabled={!joinMessage.trim()}>
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Profile Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedUser.name}</DialogTitle>
              <DialogDescription>{selectedUser.role}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                    {selectedUser.experience === "advanced" && (
                      <Badge
                        variant="outline"
                        className="ml-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Expert
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{selectedUser.role}</p>
                  <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {selectedUser.location}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Bio</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{selectedUser.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUser.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Interests</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUser.interests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Availability</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {selectedUser.availability === "full-time"
                    ? "Full-time"
                    : selectedUser.availability === "weekends"
                      ? "Weekends"
                      : "Evenings"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Contact</h4>
                <div className="space-y-1">
                  {selectedUser.github && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">GitHub: {selectedUser.github}</p>
                  )}
                  {selectedUser.linkedin && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">LinkedIn: {selectedUser.linkedin}</p>
                  )}
                  {selectedUser.website && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">Website: {selectedUser.website}</p>
                  )}
                  {selectedUser.email && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">Email: {selectedUser.email}</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
              <Button onClick={() => sendTeamRequest(selectedUser)}>
                <UserPlus className="w-4 h-4 mr-1" />
                Invite to Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  )
}
