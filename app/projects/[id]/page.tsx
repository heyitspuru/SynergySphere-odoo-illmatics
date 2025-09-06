"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FolderIcon,
  UsersIcon,
  CheckSquareIcon,
  PlusIcon,
  MoreVerticalIcon,
  CalendarIcon,
  ClockIcon,
  EditIcon,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

interface ProjectMember {
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: "owner" | "admin" | "member";
  joinedAt: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "on-hold" | "completed" | "archived";
  priority: "low" | "medium" | "high" | "critical";
  progress: number;
  ownerId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assigneeId?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
      fetchProjectTasks();
    }
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
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
    }
  };

  const fetchProjectTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?projectId=${projectId}`);
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Tasks fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "planning":
        return "bg-blue-500";
      case "on-hold":
        return "bg-yellow-500";
      case "completed":
        return "bg-purple-500";
      case "archived":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "on-hold":
        return "On Hold";
      case "todo":
        return "To Do";
      case "in-progress":
        return "In Progress";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  const isOwnerOrAdmin = project && session?.user?.email && 
    (project.ownerId.email === session.user.email ||
     project.members.some(m => m.userId.email === session.user.email && m.role === "admin"));

  if (isLoading) {
    return (
      <DashboardLayout title="Project">
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout title="Project">
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <FolderIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {error || "Project not found"}
              </h3>
              <p className="text-gray-500 mb-4">
                The project you're looking for doesn't exist or you don't have access to it.
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
    <DashboardLayout title={project.name}>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight truncate">
                {project.name}
              </h1>
              <Badge
                variant="secondary"
                className={`text-white ${getStatusColor(project.status)}`}
              >
                {getStatusText(project.status)}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(project.priority)}>
                {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          
          {isOwnerOrAdmin && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <EditIcon className="mr-2 h-4 w-4" />
                Edit Project
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <EditIcon className="mr-2 h-4 w-4" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UsersIcon className="mr-2 h-4 w-4" />
                    Manage Members
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    Archive Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks ({taskStats.total})</TabsTrigger>
            <TabsTrigger value="team">Team ({project.members.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Project Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{taskStats.total}</div>
                      <div className="text-sm text-muted-foreground">Total Tasks</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
                      <div className="text-sm text-muted-foreground">In Progress</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">{taskStats.done}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{project.members.length}</div>
                      <div className="text-sm text-muted-foreground">Team Members</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Progress</CardTitle>
                    <CardDescription>Overall completion status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="w-full" />
                      {taskStats.total > 0 && (
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-medium">{taskStats.todo}</div>
                            <div className="text-muted-foreground">To Do</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-blue-600">{taskStats.inProgress}</div>
                            <div className="text-muted-foreground">In Progress</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-green-600">{taskStats.done}</div>
                            <div className="text-muted-foreground">Done</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Tasks */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Tasks</CardTitle>
                        <CardDescription>Latest activity in this project</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/projects/${projectId}/tasks/create`}>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          New Task
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {tasks.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckSquareIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-500">No tasks yet</p>
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <Link href={`/projects/${projectId}/tasks/create`}>
                            Create First Task
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {tasks.slice(0, 5).map((task) => (
                          <div key={task._id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{task.title}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {task.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              {task.assigneeId && (
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={task.assigneeId.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {task.assigneeId.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <Badge
                                variant="secondary"
                                className={`text-white ${getStatusColor(task.status)}`}
                              >
                                {getStatusText(task.status)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {tasks.length > 5 && (
                          <div className="text-center pt-2">
                            <Button variant="ghost" size="sm" onClick={() => setActiveTab("tasks")}>
                              View All Tasks ({tasks.length})
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Project Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Owner</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={project.ownerId.avatar} />
                          <AvatarFallback className="text-xs">
                            {project.ownerId.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{project.ownerId.name}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Created</div>
                      <div className="text-sm mt-1">
                        {format(new Date(project.createdAt), "MMM d, yyyy")}
                      </div>
                    </div>

                    {project.dueDate && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Due Date</div>
                        <div className="flex items-center space-x-1 mt-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span className="text-sm">
                            {format(new Date(project.dueDate), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                      <div className="flex items-center space-x-1 mt-1">
                        <ClockIcon className="h-4 w-4" />
                        <span className="text-sm">
                          {format(new Date(project.updatedAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.members.slice(0, 5).map((member) => (
                        <div key={member.userId._id} className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.userId.avatar} />
                            <AvatarFallback className="text-xs">
                              {member.userId.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {member.userId.name}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      ))}
                      {project.members.length > 5 && (
                        <div className="text-center pt-2">
                          <Button variant="ghost" size="sm" onClick={() => setActiveTab("team")}>
                            View All Members ({project.members.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Project Tasks</h2>
              <Button asChild>
                <Link href={`/projects/${projectId}/tasks/create`}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Task
                </Link>
              </Button>
            </div>

            {tasks.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckSquareIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                  <p className="text-gray-500 mb-4">
                    Get started by creating your first task for this project.
                  </p>
                  <Button asChild>
                    <Link href={`/projects/${projectId}/tasks/create`}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create First Task
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <Card key={task._id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {task.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge
                            variant="secondary"
                            className={`text-white ${getStatusColor(task.status)}`}
                          >
                            {getStatusText(task.status)}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          {task.assigneeId && (
                            <div className="flex items-center">
                              <Avatar className="h-4 w-4 mr-1">
                                <AvatarImage src={task.assigneeId.avatar} />
                                <AvatarFallback className="text-xs">
                                  {task.assigneeId.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>Assigned to {task.assigneeId.name}</span>
                            </div>
                          )}
                          {task.dueDate && (
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              <span>Due {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs">
                          Created {format(new Date(task.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Team Members</h2>
              {isOwnerOrAdmin && (
                <Button variant="outline">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.members.map((member) => (
                <Card key={member.userId._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.userId.avatar} />
                        <AvatarFallback>
                          {member.userId.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{member.userId.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {member.userId.email}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="capitalize">
                            {member.role}
                          </Badge>
                          {isOwnerOrAdmin && member.role !== "owner" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVerticalIcon className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>Change Role</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  Remove Member
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}