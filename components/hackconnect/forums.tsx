"use client"

import { useState } from "react"
import Layout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageSquare, Plus, ThumbsUp, MessageCircle, Eye, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Types
interface ForumPost {
  id: string
  title: string
  content: string
  category: "general" | "technical" | "events" | "projects" | "teams" | "career"
  tags: string[]
  author: {
    id: string
    name: string
    avatar: string
  }
  createdAt: Date
  views: number
  likes: number
  replies: number
  isLiked: boolean
  isPinned: boolean
}

export default function Forums() {
  // State
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("recent")
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: "post1",
      title: "Tips for first-time hackathon participants?",
      content:
        "I'm planning to join my first hackathon next month and I'm a bit nervous. Any advice on how to prepare and what to expect?",
      category: "general",
      tags: ["beginner", "advice", "preparation"],
      author: {
        id: "user1",
        name: "Sarah Kim",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: new Date("2024-02-15"),
      views: 128,
      likes: 24,
      replies: 8,
      isLiked: false,
      isPinned: true,
    },
    {
      id: "post2",
      title: "Best tech stack for a hackathon project?",
      content:
        "I'm trying to decide on the tech stack for my next hackathon. What's a good balance between quick development and impressive features?",
      category: "technical",
      tags: ["tech-stack", "development", "tools"],
      author: {
        id: "user2",
        name: "David Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: new Date("2024-02-10"),
      views: 95,
      likes: 18,
      replies: 12,
      isLiked: true,
      isPinned: false,
    },
    {
      id: "post3",
      title: "Looking for teammates for the Global Health Hackathon",
      content:
        "I'm a frontend developer looking for a backend developer and a designer to join my team for the upcoming Global Health Hackathon.",
      category: "teams",
      tags: ["team-building", "health-tech", "collaboration"],
      author: {
        id: "user3",
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: new Date("2024-02-05"),
      views: 76,
      likes: 12,
      replies: 5,
      isLiked: false,
      isPinned: false,
    },
    {
      id: "post4",
      title: "How to pitch your hackathon project effectively?",
      content:
        "I've noticed that the winning teams at hackathons often have great pitches. Any tips on how to present your project in a compelling way?",
      category: "general",
      tags: ["pitching", "presentation", "communication"],
      author: {
        id: "user4",
        name: "Marcus Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: new Date("2024-01-28"),
      views: 112,
      likes: 32,
      replies: 15,
      isLiked: false,
      isPinned: false,
    },
    {
      id: "post5",
      title: "Upcoming hackathons in the San Francisco area?",
      content:
        "I'm based in San Francisco and looking for hackathons to participate in over the next few months. Any recommendations?",
      category: "events",
      tags: ["san-francisco", "events", "local"],
      author: {
        id: "user5",
        name: "Priya Patel",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: new Date("2024-01-20"),
      views: 89,
      likes: 14,
      replies: 7,
      isLiked: false,
      isPinned: false,
    },
    {
      id: "post6",
      title: "How to handle API rate limits during hackathons?",
      content:
        "I've run into issues with API rate limits during previous hackathons. How do you handle this, especially when you're demoing your project?",
      category: "technical",
      tags: ["api", "rate-limits", "development"],
      author: {
        id: "user6",
        name: "James Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: new Date("2024-01-15"),
      views: 64,
      likes: 9,
      replies: 6,
      isLiked: false,
      isPinned: false,
    },
  ])

  // Filter and sort posts
  const filteredPosts = posts
    .filter((post) => {
      // Search query filter
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Tab filter
      const matchesTab = activeTab === "all" || post.category === activeTab

      return matchesSearch && matchesTab
    })
    .sort((a, b) => {
      // Sort posts
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      if (sortBy === "recent") {
        return b.createdAt.getTime() - a.createdAt.getTime()
      } else if (sortBy === "popular") {
        return b.likes - a.likes
      } else if (sortBy === "active") {
        return b.replies - a.replies
      }
      return 0
    })

  // Toggle like
  const toggleLike = (id: string) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    )
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Community Forums</h1>
            <p className="text-zinc-600 dark:text-zinc-300">
              Connect with other hackathon enthusiasts and share your experiences
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search forums..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="active">Most Active</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
              orientation="vertical"
            >
              <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1">
                <TabsTrigger value="all" className="justify-start">
                  All Categories
                </TabsTrigger>
                <TabsTrigger value="general" className="justify-start">
                  General Discussion
                </TabsTrigger>
                <TabsTrigger value="technical" className="justify-start">
                  Technical Help
                </TabsTrigger>
                <TabsTrigger value="events" className="justify-start">
                  Events & Announcements
                </TabsTrigger>
                <TabsTrigger value="projects" className="justify-start">
                  Project Showcase
                </TabsTrigger>
                <TabsTrigger value="teams" className="justify-start">
                  Team Building
                </TabsTrigger>
                <TabsTrigger value="career" className="justify-start">
                  Career & Opportunities
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="col-span-12 md:col-span-9">
            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className={post.isPinned ? "border-l-4 border-l-blue-500" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {post.category}
                          </Badge>
                          {post.isPinned && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            >
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          {post.views} views
                        </div>
                      </div>
                      <CardTitle className="text-xl mt-2">
                        <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                          {post.title}
                        </a>
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">{post.content}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          {post.author.name} • {post.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-3">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(post.id)}
                          className={post.isLiked ? "text-blue-600 dark:text-blue-400" : ""}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {post.likes}
                        </Button>
                        <div className="flex items-center text-zinc-500 dark:text-zinc-400">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.replies} replies
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href="#">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Reply
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-zinc-400 dark:text-zinc-600" />
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">No matching posts found</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md mx-auto">
                  Try adjusting your search query or filters to find more posts.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setActiveTab("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
