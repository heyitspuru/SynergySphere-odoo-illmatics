"use client"

import type React from "react"

import { useState } from "react"
import Layout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Search,
  Filter,
  MapPin,
  Code,
  MessageSquare,
  UserPlus,
  Edit,
  Trash,
  Github,
  Linkedin,
  Globe,
  Mail,
  ChevronDown,
  ChevronUp,
  MoreVertical,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Types
interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  location: string
  email: string
  skills: string[]
  bio: string
  github?: string
  linkedin?: string
  website?: string
  joinedDate: Date
}

export default function TeamMembers() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedSkill, setSelectedSkill] = useState("")
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  // Sample team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Alex Johnson",
      role: "Full Stack Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "New York, NY",
      email: "alex@example.com",
      skills: ["React", "Node.js", "TypeScript", "MongoDB", "Express"],
      bio: "Full stack developer with 5 years of experience building web applications.",
      github: "github.com/alexj",
      linkedin: "linkedin.com/in/alexj",
      website: "alexjohnson.dev",
      joinedDate: new Date("2023-10-15"),
    },
    {
      id: "2",
      name: "Sarah Kim",
      role: "Frontend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "San Francisco, CA",
      email: "sarah@example.com",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "UI/UX"],
      bio: "Frontend developer passionate about creating accessible and intuitive user interfaces.",
      github: "github.com/sarahkim",
      linkedin: "linkedin.com/in/sarahkim",
      joinedDate: new Date("2023-11-02"),
    },
    {
      id: "3",
      name: "David Rodriguez",
      role: "Backend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Austin, TX",
      email: "david@example.com",
      skills: ["Python", "Node.js", "MongoDB", "AWS", "Docker"],
      bio: "Backend developer specializing in scalable architectures and database design.",
      github: "github.com/davidr",
      linkedin: "linkedin.com/in/davidr",
      joinedDate: new Date("2023-12-10"),
    },
    {
      id: "4",
      name: "Emily Chen",
      role: "UX/UI Designer",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Seattle, WA",
      email: "emily@example.com",
      skills: ["UI Design", "User Research", "Figma", "Prototyping", "Wireframing"],
      bio: "UX/UI designer with 3 years of experience creating intuitive digital experiences.",
      github: "github.com/emilychen",
      linkedin: "linkedin.com/in/emilychen",
      joinedDate: new Date("2024-01-05"),
    },
  ])

  // All possible roles
  const roles = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "UX/UI Designer",
    "Data Scientist",
    "DevOps Engineer",
    "Product Manager",
  ]

  // All possible skills (combined from all team members)
  const allSkills = Array.from(new Set(teamMembers.flatMap((member) => member.skills))).sort()

  // Filter team members based on search and filters
  const filteredMembers = teamMembers.filter((member) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    // Role filter
    const matchesRole = selectedRole === "" || member.role === selectedRole

    // Skill filter
    const matchesSkill = selectedSkill === "" || member.skills.includes(selectedSkill)

    return matchesSearch && matchesRole && matchesSkill
  })

  // Handle deleting a team member
  const handleDeleteMember = () => {
    if (memberToDelete) {
      setTeamMembers(teamMembers.filter((member) => member.id !== memberToDelete.id))
      setMemberToDelete(null)
      setShowDeleteDialog(false)
    }
  }

  // Handle viewing a team member
  const openMemberProfile = (member: TeamMember) => {
    setSelectedMember(member);
  };

  // Close member profile view
  const closeMemberProfile = () => {
    setSelectedMember(null);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Team Members</h1>
            <p className="text-zinc-600 dark:text-zinc-300">Manage your hackathon team members</p>
          </div>
          <Link href="/team-members/create">
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search by name, role, or skills..."
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
                  <label className="text-sm font-medium">Role</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Role</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Skill</label>
                  <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Skill</SelectItem>
                      {allSkills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Members List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{member.name}</CardTitle>
                        <CardDescription>{member.role}</CardDescription>
                      </div>
                    </div>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openMemberProfile(member)}>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/team-members/edit/${member.id}`} className="flex w-full">
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setMemberToDelete(member)
                              setShowDeleteDialog(true)
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2 mb-3">{member.bio}</p>

                  <div>
                    <h4 className="text-xs font-medium mb-1.5">Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {member.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {member.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-3">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    Joined {member.joinedDate.toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openMemberProfile(member)}>
                      View Profile
                    </Button>
                    <Button size="sm">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl">
              <Users className="w-12 h-12 mx-auto mb-4 text-zinc-400 dark:text-zinc-600" />
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">No team members found</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md mx-auto">
                Try adjusting your filters or search query, or add a new team member.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedRole("")
                    setSelectedSkill("")
                  }}
                >
                  Clear All Filters
                </Button>
                <Link href="/team-members/create">
                  <Button variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Team Member
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Team Member</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove {memberToDelete?.name} from your team? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteMember}>
                Remove Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Member Dialog */}
        {selectedMember && (
          <Dialog open={!!selectedMember} onOpenChange={closeMemberProfile}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Team Member Profile</DialogTitle>
                <DialogDescription>View complete details about this team member.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                      <AvatarFallback>{selectedMember.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-2xl font-bold">{selectedMember.name}</h3>
                    <div className="flex items-center text-muted-foreground">
                      <Badge className="mr-2">{selectedMember.role}</Badge>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {selectedMember.location}
                      </div>
                    </div>
                    <p className="text-sm mt-2">{selectedMember.bio}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Contact Information</h4>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href={`mailto:${selectedMember.email}`} className="text-primary hover:underline">
                        {selectedMember.email}
                      </a>
                    </div>
                    {selectedMember.github && (
                      <div className="flex items-center text-sm">
                        <Github className="w-4 h-4 mr-2" />
                        <a
                          href={`https://${selectedMember.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedMember.github}
                        </a>
                      </div>
                    )}
                    {selectedMember.linkedin && (
                      <div className="flex items-center text-sm">
                        <Linkedin className="w-4 h-4 mr-2" />
                        <a
                          href={`https://${selectedMember.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedMember.linkedin}
                        </a>
                      </div>
                    )}
                    {selectedMember.website && (
                      <div className="flex items-center text-sm">
                        <Globe className="w-4 h-4 mr-2" />
                        <a
                          href={`https://${selectedMember.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedMember.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeMemberProfile}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  )
}
