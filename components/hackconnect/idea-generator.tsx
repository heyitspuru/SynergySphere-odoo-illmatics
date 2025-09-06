"use client"

import { useState, useEffect } from "react"
import Layout from "./layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lightbulb, Sparkles, Save, RefreshCw, ThumbsUp, ThumbsDown, Tag, Trash, Edit, Filter, Code, BookOpen, Clock, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Types
interface IdeaType {
  _id?: string
  id?: string
  title: string
  description: string
  category: string
  tags: string[]
  techStack?: string[]
  implementation?: {
    frontend: string
    backend: string
    database: string
    deployment: string
  }
  features?: string[]
  challenges?: string[]
  timeline?: string
  createdAt: Date
  isSaved: boolean
  rating: number
}

interface PromptType {
  id: string
  text: string
  category: string
}

export default function IdeaGenerator() {
  // State for the idea generator
  const [activeTab, setActiveTab] = useState("generate")
  const [customPrompt, setCustomPrompt] = useState("")
  const [techStack, setTechStack] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [complexity, setComplexity] = useState([50])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentIdea, setCurrentIdea] = useState<IdeaType | null>(null)
  const [savedIdeas, setSavedIdeas] = useState<IdeaType[]>([])

  // Sample prompts
  const prompts: PromptType[] = [
    { id: "p1", text: "A solution for climate change using blockchain technology", category: "Sustainability" },
    { id: "p2", text: "An AR application to help people learn new skills", category: "Education" },
    { id: "p3", text: "A health monitoring system using wearable devices", category: "Healthcare" },
    { id: "p4", text: "A platform to connect local farmers with consumers", category: "Food & Agriculture" },
    { id: "p5", text: "An AI tool to improve accessibility for visually impaired users", category: "Accessibility" },
  ]

  // Categories
  const categories = [
    "All",
    "AI & ML",
    "Blockchain",
    "Education",
    "Healthcare",
    "Fintech",
    "Social Impact",
    "Sustainability",
    "AR/VR",
    "IoT",
    "Cybersecurity",
    "Entertainment",
  ]

  // Fetch saved ideas on component mount
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('/api/ideas');
        if (response.ok) {
          const data = await response.json();
          // Convert MongoDB _id to id if needed
          const formattedData = data.map((idea: any) => ({
            ...idea,
            id: idea._id || idea.id,
            createdAt: new Date(idea.createdAt)
          }));
          setSavedIdeas(formattedData);
        } else {
          console.error('Failed to fetch ideas');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching ideas:', error);
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  // Generate a new idea using Nebius API
  const generateIdea = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          complexity: complexity[0],
          customPrompt,
          techStack,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentIdea({
          ...data,
          createdAt: new Date(data.createdAt),
        });
        toast.success('New idea generated!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to generate idea');
      }
    } catch (error) {
      console.error('Error generating idea:', error);
      toast.error('Failed to connect to the idea generation service');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save the current idea to MongoDB
  const saveIdea = async () => {
    if (currentIdea) {
      try {
        const response = await fetch('/api/ideas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...currentIdea,
            isSaved: true,
          }),
        });

        if (response.ok) {
          const savedIdea = await response.json();
          // Add the new idea to the savedIdeas array with MongoDB _id
          const formattedIdea = {
            ...savedIdea,
            id: savedIdea._id,
            createdAt: new Date(savedIdea.createdAt),
          };
          setSavedIdeas([formattedIdea, ...savedIdeas]);
          setCurrentIdea({
            ...currentIdea,
            isSaved: true,
          });
          toast.success('Idea saved successfully!');
        } else {
          const error = await response.json();
          toast.error(error.error || 'Failed to save idea');
        }
      } catch (error) {
        console.error('Error saving idea:', error);
        toast.error('Failed to save idea');
      }
    }
  };

  // Delete a saved idea
  const deleteIdea = async (id: string) => {
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSavedIdeas(savedIdeas.filter((idea) => (idea._id || idea.id) !== id));
        toast.success('Idea deleted successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete idea');
      }
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast.error('Failed to delete idea');
    }
  };

  // Rate an idea
  const rateIdea = async (id: string, rating: number) => {
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });

      if (response.ok) {
        const updatedIdea = await response.json();
        
        // Update the current idea if it matches
        if (currentIdea && (currentIdea._id === id || currentIdea.id === id)) {
          setCurrentIdea({ ...currentIdea, rating });
        }

        // Update the idea in the savedIdeas array
        setSavedIdeas(
          savedIdeas.map((idea) => {
            const ideaId = idea._id || idea.id;
            return ideaId === id ? { ...idea, rating } : idea;
          })
        );

        toast.success('Rating updated');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update rating');
      }
    } catch (error) {
      console.error('Error updating rating:', error);
      toast.error('Failed to update rating');
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Idea Generator</h1>
          <p className="text-zinc-600 dark:text-zinc-300">Generate, refine, and manage your hackathon project ideas</p>
        </div>

        <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generate" className="text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Ideas
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-sm">
              <Save className="w-4 h-4 mr-2" />
              Saved Ideas ({savedIdeas.length})
            </TabsTrigger>
          </TabsList>

          {/* Generate Ideas Tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Idea Generation Form */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Idea Parameters
                    </CardTitle>
                    <CardDescription>Customize your idea generation settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.toLowerCase()} value={category.toLowerCase()}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Complexity</label>
                      <div className="pt-2">
                        <Slider value={complexity} onValueChange={setComplexity} max={100} step={1} />
                        <div className="flex justify-between mt-2 text-xs text-zinc-500">
                          <span>Simple</span>
                          <span>Medium</span>
                          <span>Complex</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tech Stack (Optional)</label>
                      <Input
                        placeholder="e.g., React, Node.js, MongoDB..."
                        value={techStack}
                        onChange={(e) => setTechStack(e.target.value)}
                      />
                      <p className="text-xs text-zinc-500">
                        Comma-separated list of technologies you want to work with
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Custom Prompt (Optional)</label>
                      <Textarea
                        placeholder="Enter a specific problem or domain you want to address..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={generateIdea} disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Idea
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Inspiration Prompts</CardTitle>
                    <CardDescription>Click on any prompt to use it as a starting point</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {prompts.map((prompt) => (
                        <button
                          key={prompt.id}
                          className="w-full text-left p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-sm"
                          onClick={() => setCustomPrompt(prompt.text)}
                        >
                          <div className="flex justify-between items-start">
                            <span>{prompt.text}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {prompt.category}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Generated Idea */}
              <div className="lg:col-span-2">
                {currentIdea ? (
                  <Card className="overflow-auto max-h-[80vh]">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{currentIdea.title}</span>
                        <Badge>{currentIdea.category}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Description</h3>
                        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{currentIdea.description}</p>
                      </div>
                      
                      {currentIdea.techStack && currentIdea.techStack.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <Code className="w-5 h-5 mr-2 text-primary" />
                            Technology Stack
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {currentIdea.techStack.map((tech, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {currentIdea.implementation && (
                        <div>
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <Zap className="w-5 h-5 mr-2 text-primary" />
                            Implementation Details
                          </h3>
                          <Accordion type="single" collapsible className="w-full">
                            {currentIdea.implementation.frontend && (
                              <AccordionItem value="frontend">
                                <AccordionTrigger className="text-sm font-medium">Frontend</AccordionTrigger>
                                <AccordionContent>
                                  <p className="text-sm text-zinc-600 dark:text-zinc-300">{currentIdea.implementation.frontend}</p>
                                </AccordionContent>
                              </AccordionItem>
                            )}
                            {currentIdea.implementation.backend && (
                              <AccordionItem value="backend">
                                <AccordionTrigger className="text-sm font-medium">Backend</AccordionTrigger>
                                <AccordionContent>
                                  <p className="text-sm text-zinc-600 dark:text-zinc-300">{currentIdea.implementation.backend}</p>
                                </AccordionContent>
                              </AccordionItem>
                            )}
                            {currentIdea.implementation.database && (
                              <AccordionItem value="database">
                                <AccordionTrigger className="text-sm font-medium">Database</AccordionTrigger>
                                <AccordionContent>
                                  <p className="text-sm text-zinc-600 dark:text-zinc-300">{currentIdea.implementation.database}</p>
                                </AccordionContent>
                              </AccordionItem>
                            )}
                            {currentIdea.implementation.deployment && (
                              <AccordionItem value="deployment">
                                <AccordionTrigger className="text-sm font-medium">Deployment</AccordionTrigger>
                                <AccordionContent>
                                  <p className="text-sm text-zinc-600 dark:text-zinc-300">{currentIdea.implementation.deployment}</p>
                                </AccordionContent>
                              </AccordionItem>
                            )}
                          </Accordion>
                        </div>
                      )}
                      
                      {currentIdea.features && currentIdea.features.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-primary" />
                            Key Features
                          </h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {currentIdea.features.map((feature, index) => (
                              <li key={index} className="text-zinc-600 dark:text-zinc-300">
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {currentIdea.challenges && currentIdea.challenges.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Technical Challenges</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {currentIdea.challenges.map((challenge, index) => (
                              <li key={index} className="text-zinc-600 dark:text-zinc-300">
                                {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {currentIdea.timeline && (
                        <div>
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-primary" />
                            Timeline
                          </h3>
                          <p className="text-zinc-600 dark:text-zinc-300">{currentIdea.timeline}</p>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <h3 className="text-lg font-medium mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {currentIdea.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="flex items-center">
                              <Tag className="w-3 h-3 mr-1 opacity-70" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex space-x-2">
                        <Button
                          size="icon"
                          variant={currentIdea.rating > 0 ? "default" : "outline"}
                          onClick={() => currentIdea._id && rateIdea(currentIdea._id, currentIdea.rating > 0 ? 0 : 1)}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant={currentIdea.rating < 0 ? "default" : "outline"}
                          onClick={() => currentIdea._id && rateIdea(currentIdea._id, currentIdea.rating < 0 ? 0 : -1)}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={generateIdea} variant="outline" size="sm" disabled={isGenerating}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          New Idea
                        </Button>
                        <Button
                          onClick={saveIdea}
                          variant="default"
                          size="sm"
                          disabled={currentIdea.isSaved}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {currentIdea.isSaved ? "Saved" : "Save Idea"}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card className="border-dashed bg-zinc-50 dark:bg-zinc-900 flex flex-col items-center justify-center py-12">
                    <div className="text-center space-y-4 max-w-md px-6">
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                        <Lightbulb className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Generate Your First Idea</h3>
                      <p className="text-zinc-500 dark:text-zinc-400">
                        Set your parameters and click "Generate Idea" to create a unique hackathon project concept using
                        AI.
                      </p>
                      <Button onClick={generateIdea} disabled={isGenerating}>
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Idea
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Saved Ideas Tab */}
          <TabsContent value="saved">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2">Loading saved ideas...</span>
              </div>
            ) : savedIdeas.length > 0 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{savedIdeas.length} Saved Ideas</h2>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedIdeas.map((idea) => (
                    <Card key={idea._id || idea.id} className="overflow-hidden">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-base">
                          <span>{idea.title}</span>
                          <Badge>{idea.category}</Badge>
                        </CardTitle>
                        <CardDescription>
                          {new Date(idea.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-zinc-600 dark:text-zinc-300 text-sm line-clamp-3">{idea.description}</p>
                        
                        {idea.techStack && idea.techStack.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-1 flex items-center">
                              <Code className="w-4 h-4 mr-1 text-primary" />
                              Tech Stack
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {idea.techStack.slice(0, 3).map((tech, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                              {idea.techStack.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{idea.techStack.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          {idea.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="flex items-center text-xs">
                              <Tag className="w-3 h-3 mr-1 opacity-70" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center space-x-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => {
                              const ideaId = idea._id || idea.id;
                              if (ideaId) rateIdea(ideaId, idea.rating === 1 ? 0 : 1);
                            }}
                          >
                            <ThumbsUp
                              className={`w-4 h-4 ${idea.rating === 1 ? "text-primary fill-primary" : ""}`}
                            />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => {
                              const ideaId = idea._id || idea.id;
                              if (ideaId) rateIdea(ideaId, idea.rating === -1 ? 0 : -1);
                            }}
                          >
                            <ThumbsDown
                              className={`w-4 h-4 ${idea.rating === -1 ? "text-primary fill-primary" : ""}`}
                            />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8"
                            onClick={() => {
                              setCurrentIdea(idea);
                              setActiveTab("generate");
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500"
                            onClick={() => {
                              const ideaId = idea._id || idea.id;
                              if (ideaId) deleteIdea(ideaId);
                            }}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Save className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">No Saved Ideas Yet</h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                  Generate some ideas and save them to build your collection of hackathon project concepts.
                </p>
                <Button onClick={() => setActiveTab("generate")} variant="default">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Ideas
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
