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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusIcon,
  SearchIcon,
  Loader2,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  MoreHorizontal,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  creatorId: {
    _id: string;
    name: string;
    email: string;
  };
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  _id: string;
  name: string;
}

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Create task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskProjectId, setTaskProjectId] = useState("");
  const [taskPriority, setTaskPriority] = useState<
    "low" | "medium" | "high" | "critical"
  >("medium");
  const [taskDueDate, setTaskDueDate] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchTasks();
      fetchProjects();
    }
  }, [status, router]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch tasks",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Fetch tasks error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Fetch projects error:", error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle.trim() || !taskProjectId) {
      toast({
        title: "Error",
        description: "Task title and project are required",
        variant: "destructive",
      });
      return;
    }

    setCreateLoading(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskTitle.trim(),
          description: taskDescription.trim(),
          projectId: taskProjectId,
          priority: taskPriority,
          dueDate: taskDueDate || undefined,
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks([newTask, ...tasks]);
        setCreateDialogOpen(false);
        setTaskTitle("");
        setTaskDescription("");
        setTaskProjectId("");
        setTaskPriority("medium");
        setTaskDueDate("");

        toast({
          title: "Success",
          description: "Task created successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create task",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Create task error:", error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done"
  ) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(
          tasks.map((task) => (task._id === taskId ? updatedTask : task))
        );

        toast({
          title: "Success",
          description: "Task status updated",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update task status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Update task error:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Circle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "done":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "todo":
        return "outline";
      case "in-progress":
        return "default";
      case "done":
        return "secondary";
      default:
        return "outline";
    }
  };

  const tasksByStatus = {
    todo: filteredTasks.filter((task) => task.status === "todo"),
    "in-progress": filteredTasks.filter(
      (task) => task.status === "in-progress"
    ),
    done: filteredTasks.filter((task) => task.status === "done"),
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground mt-2">
              Manage your tasks and track progress
            </p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleCreateTask}>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Create a new task and assign it to a project.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter task title"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter task description"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project">Project</Label>
                    <Select
                      value={taskProjectId}
                      onValueChange={setTaskProjectId}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project._id} value={project._id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={taskPriority}
                      onValueChange={(
                        value: "low" | "medium" | "high" | "critical"
                      ) => setTaskPriority(value)}
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
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date (optional)</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createLoading}>
                    {createLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Task
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks Display */}
      <Tabs defaultValue="board" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="board">Board View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {/* To Do Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4" />
                <h3 className="font-semibold">To Do</h3>
                <Badge variant="outline">{tasksByStatus.todo.length}</Badge>
              </div>
              <div className="space-y-3">
                {tasksByStatus.todo.map((task) => (
                  <Card
                    key={task._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm line-clamp-2">
                          {task.title}
                        </CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(task._id, "in-progress")
                              }
                            >
                              Move to In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(task._id, "done")
                              }
                            >
                              Mark as Done
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <Badge variant={getPriorityBadgeVariant(task.priority)}>
                          {task.priority}
                        </Badge>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {task.projectId.name}
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <h3 className="font-semibold">In Progress</h3>
                <Badge variant="outline">
                  {tasksByStatus["in-progress"].length}
                </Badge>
              </div>
              <div className="space-y-3">
                {tasksByStatus["in-progress"].map((task) => (
                  <Card
                    key={task._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm line-clamp-2">
                          {task.title}
                        </CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(task._id, "todo")
                              }
                            >
                              Move to To Do
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(task._id, "done")
                              }
                            >
                              Mark as Done
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <Badge variant={getPriorityBadgeVariant(task.priority)}>
                          {task.priority}
                        </Badge>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {task.projectId.name}
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Done Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <h3 className="font-semibold">Done</h3>
                <Badge variant="outline">{tasksByStatus.done.length}</Badge>
              </div>
              <div className="space-y-3">
                {tasksByStatus.done.map((task) => (
                  <Card
                    key={task._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm line-clamp-2">
                          {task.title}
                        </CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(task._id, "todo")
                              }
                            >
                              Move to To Do
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(task._id, "in-progress")
                              }
                            >
                              Move to In Progress
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <Badge variant={getPriorityBadgeVariant(task.priority)}>
                          {task.priority}
                        </Badge>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {task.projectId.name}
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <CardTitle className="mt-4">
                  {tasks.length === 0
                    ? "No tasks yet"
                    : "No tasks match your filters"}
                </CardTitle>
                <CardDescription>
                  {tasks.length === 0
                    ? "Create your first task to get started."
                    : "Try adjusting your search or filter criteria."}
                </CardDescription>
              </CardHeader>
              {tasks.length === 0 && (
                <CardContent>
                  <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className="gap-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Create Your First Task
                  </Button>
                </CardContent>
              )}
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <Card key={task._id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-0.5">
                          {getStatusIcon(task.status)}
                        </div>
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg">
                            {task.title}
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={getStatusBadgeVariant(task.status)}>
                              {task.status.replace("-", " ")}
                            </Badge>
                            <Badge
                              variant={getPriorityBadgeVariant(task.priority)}
                            >
                              {task.priority}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {task.projectId.name}
                            </span>
                          </div>
                          {task.description && (
                            <CardDescription className="mt-2">
                              {task.description}
                            </CardDescription>
                          )}
                        </div>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {task.status !== "todo" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(task._id, "todo")
                                }
                              >
                                Move to To Do
                              </DropdownMenuItem>
                            )}
                            {task.status !== "in-progress" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(task._id, "in-progress")
                                }
                              >
                                Move to In Progress
                              </DropdownMenuItem>
                            )}
                            {task.status !== "done" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(task._id, "done")
                                }
                              >
                                Mark as Done
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                        <Calendar className="h-4 w-4" />
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
