"use client"

import { useState } from "react"
import Layout from "./layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Code,
  Github,
  Linkedin,
  Globe,
  Edit,
  Save,
  Clock,
  BookOpen,
  Trophy,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  // Sample user data
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    role: "Full Stack Developer",
    location: "New York, NY",
    email: "alex@example.com",
    bio: "Full stack developer with 5 years of experience building web applications. Passionate about hackathons and building innovative solutions to real-world problems.",
    joinedDate: new Date("2023-10-15"),
    skills: [
      { name: "React", level: 90 },
      { name: "Node.js", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "MongoDB", level: 75 },
      { name: "Express", level: 85 },
    ],
    interests: ["Education", "Healthcare", "Sustainability", "AI", "Fintech"],
    education: [
      {
        institution: "University of Technology",
        degree: "B.S. Computer Science",
        year: "2018 - 2022",
      },
    ],
    experience: [
      {
        company: "Tech Innovations Inc.",
        position: "Full Stack Developer",
        duration: "2022 - Present",
      },
      {
        company: "StartUp Labs",
        position: "Frontend Developer Intern",
        duration: "Summer 2021",
      },
    ],
    hackathons: [
      {
        name: "Global Health Hackathon",
        date: "March 2024",
        role: "Team Lead",
        project: "HealthConnect - Patient Monitoring System",
        achievement: "First Place",
      },
      {
        name: "Climate Tech Challenge",
        date: "January 2024",
        role: "Frontend Developer",
        project: "EcoTrack - Sustainable Living App",
        achievement: "Best UI/UX Design",
      },
      {
        name: "AI for Education",
        date: "November 2023",
        role: "Full Stack Developer",
        project: "LearnAI - Personalized Learning Platform",
        achievement: "Finalist",
      },
    ],
    socialLinks: {
      github: "github.com/alexjohnson",
      linkedin: "linkedin.com/in/alexjohnson",
      website: "alexjohnson.dev",
    },
    availability: "Weekends",
  })

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">My Profile</h1>
          <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "default" : "outline"}>
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt={userData.name} />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{userData.name}</h2>
                  <p className="text-zinc-600 dark:text-zinc-300">{userData.role}</p>
                  <div className="flex items-center mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    {userData.location}
                  </div>
                  <div className="flex items-center mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {userData.joinedDate.toLocaleDateString()}
                  </div>
                  <div className="flex items-center mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    <Clock className="w-4 h-4 mr-1" />
                    Available: {userData.availability}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold mb-3 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </h3>
                  <div className="space-y-2">
                    <a
                      href={`mailto:${userData.email}`}
                      className="flex items-center text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <Mail className="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" />
                      {userData.email}
                    </a>
                    {userData.socialLinks.github && (
                      <a
                        href={`https://${userData.socialLinks.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                      >
                        <Github className="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" />
                        {userData.socialLinks.github}
                      </a>
                    )}
                    {userData.socialLinks.linkedin && (
                      <a
                        href={`https://${userData.socialLinks.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                      >
                        <Linkedin className="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" />
                        {userData.socialLinks.linkedin}
                      </a>
                    )}
                    {userData.socialLinks.website && (
                      <a
                        href={`https://${userData.socialLinks.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                      >
                        <Globe className="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" />
                        {userData.socialLinks.website}
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.education.map((edu, index) => (
                    <div key={index} className="space-y-1">
                      <h4 className="font-medium text-zinc-900 dark:text-white">{edu.institution}</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">{edu.degree}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.experience.map((exp, index) => (
                    <div key={index} className="space-y-1">
                      <h4 className="font-medium text-zinc-900 dark:text-white">{exp.company}</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">{exp.position}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{exp.duration}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-300 whitespace-pre-line">{userData.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Code className="w-4 h-4 mr-2" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.skills.map((skill, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">{skill.name}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userData.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  Hackathon History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userData.hackathons.map((hackathon, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-zinc-900 dark:text-white">{hackathon.name}</h4>
                        <Badge variant="outline">{hackathon.date}</Badge>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">
                        <span className="font-medium">Project:</span> {hackathon.project}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">
                        <span className="font-medium">Role:</span> {hackathon.role}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        <span className="font-medium">Achievement:</span> {hackathon.achievement}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Hackathons
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
