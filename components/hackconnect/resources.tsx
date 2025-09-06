"use client"

import { useState } from "react"
import Layout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, BookOpen, Code, Video, FileText, ExternalLink, ThumbsUp, Bookmark, Share2 } from "lucide-react"

// Types
interface Resource {
  id: string
  title: string
  description: string
  url: string
  type: "article" | "video" | "tutorial" | "tool" | "template"
  tags: string[]
  author: {
    name: string
    avatar: string
  }
  publishedAt: Date
  likes: number
  bookmarked: boolean
}

export default function Resources() {
  // State
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "res1",
      title: "How to Win Your First Hackathon",
      description: "A comprehensive guide for beginners on how to prepare for and succeed in your first hackathon.",
      url: "#",
      type: "article",
      tags: ["beginner", "guide", "preparation"],
      author: {
        name: "Sarah Kim",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      publishedAt: new Date("2024-01-15"),
      likes: 128,
      bookmarked: false,
    },
    {
      id: "res2",
      title: "Building a Full-Stack App in 48 Hours",
      description: "Learn how to efficiently build a complete web application during a weekend hackathon.",
      url: "#",
      type: "tutorial",
      tags: ["web-development", "full-stack", "time-management"],
      author: {
        name: "David Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      publishedAt: new Date("2024-02-10"),
      likes: 95,
      bookmarked: true,
    },
    {
      id: "res3",
      title: "Rapid Prototyping with Figma",
      description: "A video tutorial on how to quickly create UI prototypes for your hackathon projects.",
      url: "#",
      type: "video",
      tags: ["design", "ui/ux", "figma"],
      author: {
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      publishedAt: new Date("2024-01-28"),
      likes: 76,
      bookmarked: false,
    },
    {
      id: "res4",
      title: "Hackathon Project Starter Template",
      description: "A ready-to-use template for React and Node.js projects to help you get started quickly.",
      url: "#",
      type: "template",
      tags: ["react", "node.js", "template"],
      author: {
        name: "Marcus Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      publishedAt: new Date("2024-02-05"),
      likes: 112,
      bookmarked: false,
    },
    {
      id: "res5",
      title: "10 APIs Every Hackathon Developer Should Know",
      description: "A curated list of useful APIs that can help you build impressive hackathon projects.",
      url: "#",
      type: "article",
      tags: ["api", "integration", "tools"],
      author: {
        name: "Priya Patel",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      publishedAt: new Date("2024-01-20"),
      likes: 89,
      bookmarked: false,
    },
    {
      id: "res6",
      title: "Pitching Your Hackathon Project",
      description: "Tips and techniques for delivering a compelling presentation of your hackathon project.",
      url: "#",
      type: "video",
      tags: ["presentation", "pitching", "communication"],
      author: {
        name: "James Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      publishedAt: new Date("2024-02-15"),
      likes: 64,
      bookmarked: false,
    },
  ])

  // Filter resources based on search and active tab
  const filteredResources = resources.filter((resource) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // Tab filter
    const matchesTab = activeTab === "all" || resource.type === activeTab

    return matchesSearch && matchesTab
  })

  // Toggle bookmark
  const toggleBookmark = (id: string) => {
    setResources(
      resources.map((resource) => (resource.id === id ? { ...resource, bookmarked: !resource.bookmarked } : resource)),
    )
  }

  // Like resource
  const likeResource = (id: string) => {
    setResources(
      resources.map((resource) => (resource.id === id ? { ...resource, likes: resource.likes + 1 } : resource)),
    )
  }

  // Get icon based on resource type
  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "article":
        return <FileText className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "tutorial":
        return <BookOpen className="h-5 w-5" />
      case "tool":
        return <Code className="h-5 w-5" />
      case "template":
        return <Code className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Resources</h1>
          <p className="text-zinc-600 dark:text-zinc-300">
            Discover articles, tutorials, and tools to help you succeed in hackathons
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search resources..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="article">Articles</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
                <TabsTrigger value="tutorial">Tutorials</TabsTrigger>
                <TabsTrigger value="template">Templates</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-purple-100 dark:bg-purple-900/20 rounded-md text-purple-600 dark:text-purple-400">
                        {getResourceIcon(resource.type)}
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {resource.type}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(resource.id)}
                      className={resource.bookmarked ? "text-yellow-500" : "text-zinc-400"}
                    >
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl mt-2">{resource.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">{resource.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={resource.author.avatar || "/placeholder.svg"} alt={resource.author.name} />
                      <AvatarFallback>{resource.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {resource.author.name} • {resource.publishedAt.toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-3">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => likeResource(resource.id)}>
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {resource.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      View Resource
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-zinc-400 dark:text-zinc-600" />
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">No matching resources found</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md mx-auto">
              Try adjusting your search query or filters to find more resources.
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
    </Layout>
  )
}
