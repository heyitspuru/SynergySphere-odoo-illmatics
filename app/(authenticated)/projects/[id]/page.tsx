"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
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
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  Edit,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface Project {
  _id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "on-hold" | "archived";
  progress: number;
  ownerId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  members: Array<{
    userId: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    role: "owner" | "admin" | "member";
    joinedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
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
}

export default function ProjectDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const projectId = params.id as string;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated" && projectId) {
      fetchProjectData();
    }
  }, [status, router, projectId]);

  const fetchProjectData = async () => {
    try {
      const [projectResponse, tasksResponse] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/tasks?projectId=${projectId}`),
      ]);

      if (projectResponse.ok) {
        const projectData = await projectResponse.json();
        setProject(projectData);
      } else if (projectResponse.status === 404) {
        toast({
          title: "Error",
          description: "Project not found",
          variant: "destructive",
        });
        router.push("/projects");
        return;
      }

      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      }
    } catch (error) {
      console.error("Fetch project data error:", error);
      toast({
        title: "Error",
        description: "Failed to load project data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Project not found</h2>
            <p className="text-muted-foreground mb-4">
              The project you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Link href="/projects">
              <Button>Back to Projects</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    overdue: tasks.filter(
      (t) =>
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done"
    ).length,
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "on-hold":
        return "outline";
      case "archived":
        return "secondary";
      default:
        return "default";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/projects">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {project.name}
              </h1>
              <Badge variant={getStatusBadgeVariant(project.status)}>
                {project.status.replace("-", " ")}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {project.description || "No description provided"}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Project
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">
                    {project.members.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Members</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">{taskStats.total}</div>
                  <div className="text-xs text-muted-foreground">
                    Total Tasks
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">
                    {taskStats.inProgress}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    In Progress
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {taskStats.done}
                  </div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Project Progress</span>
              <span className="text-sm text-muted-foreground">
                {project.progress}%
              </span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          {tasks.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <CardTitle className="mt-4">No tasks yet</CardTitle>
                <CardDescription>
                  Create your first task to get started with this project.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tasks">
                  <Button>Create Task</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task._id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={
                              task.status === "todo"
                                ? "outline"
                                : task.status === "in-progress"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {task.status.replace("-", " ")}
                          </Badge>
                          <Badge
                            variant={getPriorityBadgeVariant(task.priority)}
                          >
                            {task.priority}
                          </Badge>
                          {task.dueDate && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <CardDescription className="mt-2">
                            {task.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {task.assigneeId && (
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={task.assigneeId.avatar} />
                            <AvatarFallback className="text-xs">
                              {task.assigneeId.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {project.members.map((member) => (
              <Card key={member.userId._id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.userId.avatar} />
                      <AvatarFallback>
                        {member.userId.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{member.userId.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {member.userId.email}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {member.role}
                    </Badge>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Activity Timeline</h3>
              <p className="text-muted-foreground mt-2">
                Project activity tracking will be implemented soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
