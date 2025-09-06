"use client"

import type React from "react"

import { useState } from "react"
import Layout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, HelpCircle, Book, MessageSquare, Video, Mail, ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Help Center</h1>
          <p className="text-zinc-600 dark:text-zinc-300">
            Find answers to common questions and learn how to use HackThisIdea
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search for help articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="faq" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq" className="text-sm">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="guides" className="text-sm">
              <Book className="w-4 h-4 mr-2" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="videos" className="text-sm">
              <Video className="w-4 h-4 mr-2" />
              Video Tutorials
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-sm">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find answers to the most common questions about HackThisIdea</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I find teammates for a hackathon?</AccordionTrigger>
                    <AccordionContent>
                      You can use our Team Builder feature to find potential teammates. Navigate to the Team Builder
                      page from the sidebar, where you can search for other users based on skills, interests, and
                      availability. Once you find someone you'd like to work with, you can send them a team request.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How does the Idea Generator work?</AccordionTrigger>
                    <AccordionContent>
                      The Idea Generator uses AI to help you brainstorm project ideas for hackathons. You can specify
                      parameters like category, complexity, and even provide a custom prompt. The system will generate
                      innovative ideas based on your inputs, which you can save, rate, and refine.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can I register for hackathons through HackThisIdea?</AccordionTrigger>
                    <AccordionContent>
                      Yes! You can browse upcoming hackathons in the Events section and register directly through our
                      platform. We'll send you reminders and updates about the events you've registered for.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How do I update my profile and skills?</AccordionTrigger>
                    <AccordionContent>
                      You can update your profile by clicking on your avatar in the top-right corner and selecting "My
                      Profile". From there, click the "Edit Profile" button to update your information, skills, and
                      other details.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Is HackThisIdea free to use?</AccordionTrigger>
                    <AccordionContent>
                      Yes, HackThisIdea is free for individual users. We offer a basic plan that includes all essential
                      features for finding teammates, generating ideas, and participating in hackathons. We also have
                      premium plans for organizations and hackathon organizers with additional features.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-6">
                    <AccordionTrigger>How can I showcase my hackathon projects?</AccordionTrigger>
                    <AccordionContent>
                      You can add your hackathon projects to your profile by going to "My Profile" and updating your
                      Hackathon History section. This allows other users to see your past work and achievements.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All FAQs
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Guides & Tutorials</CardTitle>
                <CardDescription>Step-by-step guides to help you make the most of HackThisIdea</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GuideCard
                    title="Getting Started with HackThisIdea"
                    description="Learn the basics of using HackThisIdea to enhance your hackathon experience."
                    category="Beginner"
                    readTime="5 min read"
                  />
                  <GuideCard
                    title="Building the Perfect Team"
                    description="Tips and strategies for finding and forming an effective hackathon team."
                    category="Team Building"
                    readTime="8 min read"
                  />
                  <GuideCard
                    title="Maximizing the Idea Generator"
                    description="Advanced techniques for getting the most useful project ideas."
                    category="Ideation"
                    readTime="6 min read"
                  />
                  <GuideCard
                    title="Creating a Standout Profile"
                    description="How to optimize your profile to attract the best teammates."
                    category="Profile"
                    readTime="4 min read"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Browse All Guides
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>Watch video walkthroughs of HackThisIdea features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <VideoCard
                    title="HackThisIdea Walkthrough"
                    description="A complete tour of the HackThisIdea platform and its features."
                    duration="10:25"
                    thumbnail="/placeholder.svg?height=180&width=320"
                  />
                  <VideoCard
                    title="Team Builder Tutorial"
                    description="How to use the Team Builder to find the perfect teammates."
                    duration="7:15"
                    thumbnail="/placeholder.svg?height=180&width=320"
                  />
                  <VideoCard
                    title="Idea Generator Demo"
                    description="See the Idea Generator in action and learn how to use it effectively."
                    duration="6:42"
                    thumbnail="/placeholder.svg?height=180&width=320"
                  />
                  <VideoCard
                    title="Hackathon Registration Guide"
                    description="How to find and register for hackathons on HackThisIdea."
                    duration="5:30"
                    thumbnail="/placeholder.svg?height=180&width=320"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Videos
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get help from our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input placeholder="Your email" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="What's your question about?" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Input placeholder="Describe your issue or question" className="min-h-[100px]" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SupportCard
            icon={<MessageSquare className="h-8 w-8" />}
            title="Community Forums"
            description="Ask questions and get answers from the community"
            action="Browse Forums"
            href="/forums"
          />
          <SupportCard
            icon={<Book className="h-8 w-8" />}
            title="Documentation"
            description="Detailed documentation for all HackThisIdea features"
            action="Read Docs"
            href="#"
          />
          <SupportCard
            icon={<Mail className="h-8 w-8" />}
            title="Email Support"
            description="Get direct help from our support team"
            action="Contact Us"
            href="#"
          />
        </div>
      </div>
    </Layout>
  )
}

// Guide Card Component
function GuideCard({
  title,
  description,
  category,
  readTime,
}: { title: string; description: string; category: string; readTime: string }) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white">{title}</h3>
        <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-300">
          {category}
        </span>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-3">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{readTime}</span>
        <Button variant="ghost" size="sm" className="h-7 px-2">
          Read Guide
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

// Video Card Component
function VideoCard({
  title,
  description,
  duration,
  thumbnail,
}: { title: string; description: string; duration: string; thumbnail: string }) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="relative">
        <img src={thumbnail || "/placeholder.svg"} alt={title} className="w-full h-40 object-cover" />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{duration}</div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-1">{title}</h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-3">{description}</p>
        <Button variant="ghost" size="sm" className="h-7 px-2">
          Watch Video
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

// Support Card Component
function SupportCard({
  icon,
  title,
  description,
  action,
  href,
}: { icon: React.ReactNode; title: string; description: string; action: string; href: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6 flex flex-col items-center text-center">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">{description}</p>
        <Button asChild variant="outline" className="mt-auto">
          <a href={href}>{action}</a>
        </Button>
      </CardContent>
    </Card>
  )
}
