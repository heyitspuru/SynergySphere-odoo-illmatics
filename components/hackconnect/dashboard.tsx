"use client"

import type React from "react"

import { useState } from "react"
import Layout from "./layout"
import { Button } from "@/components/ui/button"
import {
  Lightbulb,
  Users,
  Calendar,
  Trophy,
  ArrowRight,
  Activity,
  Sparkles,
  Clock,
  CheckCircle,
  PlusCircle,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Types
interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  skills: string[]
}

interface Hackathon {
  id: string
  name: string
  date: string
  location: string
  status: "upcoming" | "active" | "completed"
  registered: boolean
}

interface Idea {
  id: string
  title: string
  category: string
  createdAt: Date
}

interface ActivityItem {
  id: string
  type: "idea_created" | "team_joined" | "hackathon_registered" | "project_updated"
  content: string
  timestamp: Date
  user?: {
    name: string
    avatar: string
  }
}

export default function Dashboard() {
  // Sample data
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Alex Johnson",
      role: "Full Stack Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["React", "Node.js", "TypeScript"],
    },
    {
      id: "2",
      name: "Sarah Kim",
      role: "Frontend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["React", "TypeScript", "Tailwind CSS"],
    },
    {
      id: "3",
      name: "David Rodriguez",
      role: "Backend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Python", "Node.js", "MongoDB"],
    },
  ])

  const [hackathons] = useState<Hackathon[]>([
    {
      id: "1",
      name: "Global Health Hackathon",
      date: "Mar 15-17, 2024",
      location: "Virtual",
      status: "upcoming",
      registered: true,
    },
    {
      id: "2",
      name: "Climate Tech Challenge",
      date: "Apr 5-7, 2024",
      location: "San Francisco, CA",
      status: "upcoming",
      registered: false,
    },
    {
      id: "3",
      name: "AI for Education",
      date: "Feb 10-12, 2024",
      location: "Virtual",
      status: "completed",
      registered: true,
    },
  ])

  const [recentIdeas] = useState<Idea[]>([
    {
      id: "1",
      title: "AI-Powered Accessibility Assistant",
      category: "AI & ML",
      createdAt: new Date("2024-02-28"),
    },
    {
      id: "2",
      title: "Community Disaster Response Platform",
      category: "Social Impact",
      createdAt: new Date("2024-02-25"),
    },
    {
      id: "3",
      title: "Smart Urban Farming Network",
      category: "Sustainability",
      createdAt: new Date("2024-02-20"),
    },
  ])

  const [activities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "hackathon_registered",
      content: "You registered for Global Health Hackathon",
      timestamp: new Date("2024-02-28T14:30:00"),
    },
    {
      id: "2",
      type: "idea_created",
      content: "You created a new idea: AI-Powered Accessibility Assistant",
      timestamp: new Date("2024-02-28T10:15:00"),
    },
    {
      id: "3",
      type: "team_joined",
      content: "Sarah Kim joined your team",
      timestamp: new Date("2024-02-27T16:45:00"),
      user: {
        name: "Sarah Kim",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "4",
      type: "project_updated",
      content: "David updated the project repository",
      timestamp: new Date("2024-02-26T09:20:00"),
      user: {
        name: "David Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ])

  // Stats
  const stats = [
    { label: "Team Members", value: teamMembers.length, icon: Users },
    { label: "Ideas Generated", value: 12, icon: Lightbulb },
    { label: "Hackathons Joined", value: 5, icon: Trophy },
    { label: "Days to Next Event", value: 15, icon: Calendar },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">Welcome back, Alex!</h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-1">
            Your hackathon journey continues. Here's what's happening.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-3">
                  <stat.icon className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/idea-generator" className="block">
                <Card className="border border-zinc-200 dark:border-zinc-800 h-full hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 w-fit mb-4">
                      <Lightbulb className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Generate New Ideas</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 flex-grow">
                      Brainstorm your next hackathon project with our AI-powered idea generator.
                    </p>
                    <Button variant="outline" className="w-full justify-between">
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/team-builder" className="block">
                <Card className="border border-zinc-200 dark:border-zinc-800 h-full hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 w-fit mb-4">
                      <Users className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Find Teammates</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 flex-grow">
                      Connect with potential teammates based on skills, interests, and availability.
                    </p>
                    <Button variant="outline" className="w-full justify-between">
                      Find Teammates
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Recent Activity */}
            <Card className="border border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="relative mt-1">
                        {activity.user ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            {activity.type === "idea_created" && (
                              <Lightbulb className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                            )}
                            {activity.type === "team_joined" && (
                              <Users className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                            )}
                            {activity.type === "hackathon_registered" && (
                              <Calendar className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                            )}
                            {activity.type === "project_updated" && (
                              <Sparkles className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-zinc-900 dark:text-zinc-100">{activity.content}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {activity.timestamp.toLocaleDateString()} at{" "}
                          {activity.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Team Members */}
            <Card className="border border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Your Team
                  </CardTitle>
                  <Link href="/team-members/create">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>Current team members</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{member.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Link href="/team-members" className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Team
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Upcoming Hackathons */}
            <Card className="border border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Hackathons
                </CardTitle>
                <CardDescription>Upcoming and recent events</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  {hackathons.map((hackathon) => (
                    <div
                      key={hackathon.id}
                      className="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{hackathon.name}</h3>
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              hackathon.status === "upcoming"
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                : hackathon.status === "active"
                                  ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                                  : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                            }
                          `}
                        >
                          {hackathon.status === "upcoming" ? (
                            <Clock className="w-3 h-3 mr-1" />
                          ) : hackathon.status === "active" ? (
                            <Activity className="w-3 h-3 mr-1" />
                          ) : (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex flex-col space-y-1 mb-2">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {hackathon.date}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {hackathon.location}
                        </p>
                      </div>
                      {hackathon.status === "upcoming" && !hackathon.registered && (
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Register Now
                        </Button>
                      )}
                      {hackathon.registered && (
                        <Badge className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                          Registered
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  View All Hackathons
                </Button>
              </CardFooter>
            </Card>

            {/* Recent Ideas */}
            <Card className="border border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Recent Ideas
                </CardTitle>
                <CardDescription>Your latest project ideas</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  {recentIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{idea.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {idea.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Created on {idea.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Link href="/idea-generator" className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Ideas
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// Missing MapPin component
function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
