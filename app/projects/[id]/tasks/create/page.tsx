"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, CalendarIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProjectMember {
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: "owner" | "admin" | "member";
}

interface Project {
  _id: string;
  name: string;
  description: string;
  members: ProjectMember[];
}

export default function CreateTaskPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [error, setError] = useState("");
  const [dueDate, setDueDate] = useState<Date>();

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    assigneeId: "",
    estimatedHours: "",
  });

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setIsLoadingProject(true);
      const response = await fetch(`/api/projects/${projectId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Project not found");
        } else if (response.status === 403) {
          setError("You don't have access to this project");
        } else {
          setError("Failed to load project");
        }
        return;
      }

      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error("Project fetch error:", error);
      setError("Failed to load project");
    } finally {
      setIsLoadingProject(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Task description is required");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
          projectId,
          assigneeId: formData.assigneeId || null,
          dueDate: dueDate ? dueDate.toISOString() : null,
          estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create task");
      }

      const task = await response.json();
      toast.success("Task created successfully!");
      
      // Redirect back to project
      router.push(`/projects/${projectId}`);
    } catch (error: any) {
      console.error("Create task error:", error);
      setError(error.message || "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProject) {
    return (
      <DashboardLayout title="Create Task">
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout title="Create Task">
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {error || "Project not found"}
              </h3>
              <p className="text-gray-500 mb-4">
                Unable to create task. Please check if you have access to this project.
              </p>
              <Link href="/projects">
                <Button>Back to Projects</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Create Task">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href={`/projects/${projectId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Project
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create New Task</h1>
              <p className="text-muted-foreground mt-1">
                Add a new task to <span className="font-medium">{project.name}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
                <CardDescription>
                  Provide the essential information for this task.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what needs to be done"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    disabled={isLoading}
                    required
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleInputChange("priority", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedHours">Estimated Hours</Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="e.g., 4.5"
                      value={formData.estimatedHours}
                      onChange={(e) => handleInputChange("estimatedHours", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignment & Due Date */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment & Timeline</CardTitle>
                <CardDescription>
                  Assign the task to a team member and set a due date.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assign to</Label>
                  <Select
                    value={formData.assigneeId}
                    onValueChange={(value) => handleInputChange("assigneeId", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {project.members.map((member) => (
                        <SelectItem key={member.userId._id} value={member.userId._id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.userId.avatar} />
                              <AvatarFallback className="text-xs">
                                {member.userId.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{member.userId.name}</span>
                            <span className="text-muted-foreground text-xs">
                              ({member.role})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Due Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {dueDate && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Due:</span>
                      <span className="text-sm font-medium">
                        {format(dueDate, "PPP")}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDueDate(undefined)}
                        disabled={isLoading}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6">
              <Link href={`/projects/${projectId}`}>
                <Button variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Task...
                  </>
                ) : (
                  "Create Task"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}