"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import {
  PlusIcon,
  FolderIcon,
  CheckCircle2Icon,
  ClockIcon,
  UsersIcon,
  TrendingUpIcon,
  CalendarIcon,
  AlertTriangleIcon,
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
  projectId: {
    _id: string;
    name: string;
  };
  dueDate?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      const [projectsResponse, tasksResponse] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/tasks"),
      ]);

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      }

      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      }
    } catch (error) {
      console.error("Fetch dashboard data error:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
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

  if (!session) {
    return null;
  }

  // Calculate statistics
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "done").length,
    inProgressTasks: tasks.filter((t) => t.status === "in-progress").length,
    overdueTasks: tasks.filter(
      (t) =>
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done"
    ).length,
  };

  const recentProjects = projects
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 6);

  const recentTasks = tasks
    .filter((t) => t.status !== "done")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);

  const upcomingTasks = tasks
    .filter((t) => t.dueDate && t.status !== "done")
    .sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    )
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user.name}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your projects and tasks.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProjects} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle2Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">
              tasks being worked on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.overdueTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              tasks need attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Your most recently updated projects
                </CardDescription>
              </div>
              <Link href="/projects">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="text-center py-6">
                <FolderIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
                <p className="text-muted-foreground">
                  Create your first project to get started.
                </p>
                <Link href="/projects">
                  <Button className="mt-4 gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Create Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{project.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {project.status}
                          </Badge>
                          <div className="flex -space-x-2">
                            {project.members
                              .slice(0, 3)
                              .map((member, index) => (
                                <Avatar
                                  key={member.userId._id}
                                  className="h-5 w-5 border border-background"
                                >
                                  <AvatarImage src={member.userId.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {member.userId.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            {project.members.length > 3 && (
                              <div className="h-5 w-5 rounded-full bg-muted border border-background flex items-center justify-center text-xs font-medium">
                                +{project.members.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {project.progress}%
                      </div>
                      <Progress
                        value={project.progress}
                        className="w-16 h-2 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Your latest tasks and updates</CardDescription>
              </div>
              <Link href="/tasks">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle2Icon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No tasks yet</h3>
                <p className="text-muted-foreground">
                  Create your first task to get started.
                </p>
                <Link href="/tasks">
                  <Button className="mt-4 gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Create Task
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              task.status === "todo"
                                ? "outline"
                                : task.status === "in-progress"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {task.status.replace("-", " ")}
                          </Badge>
                          <Badge
                            variant={
                              task.priority === "critical" ||
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {task.projectId.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    {task.assigneeId && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assigneeId.avatar} />
                        <AvatarFallback className="text-xs">
                          {task.assigneeId.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingTasks.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Tasks with approaching due dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => {
                const dueDate = new Date(task.dueDate!);
                const today = new Date();
                const diffTime = dueDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                return (
                  <div
                    key={task._id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      diffDays <= 1
                        ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                        : diffDays <= 3
                        ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {task.projectId.name}
                          </Badge>
                          <Badge
                            variant={
                              task.priority === "critical" ||
                              task.priority === "high"
                                ? "destructive"
                                : "default"
                            }
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${
                          diffDays <= 1
                            ? "text-red-600"
                            : diffDays <= 3
                            ? "text-yellow-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {diffDays === 0
                          ? "Due today"
                          : diffDays === 1
                          ? "Due tomorrow"
                          : diffDays < 0
                          ? `${Math.abs(diffDays)} days overdue`
                          : `${diffDays} days left`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {dueDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/projects">
              <Button variant="outline" className="w-full gap-2">
                <FolderIcon className="h-4 w-4" />
                Create Project
              </Button>
            </Link>
            <Link href="/tasks">
              <Button variant="outline" className="w-full gap-2">
                <PlusIcon className="h-4 w-4" />
                Add Task
              </Button>
            </Link>
            <Link href="/team-members">
              <Button variant="outline" className="w-full gap-2">
                <UsersIcon className="h-4 w-4" />
                Manage Team
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
