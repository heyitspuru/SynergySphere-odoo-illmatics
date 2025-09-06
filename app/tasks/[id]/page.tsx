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
import { Badge } from "@/components/ui/badge";
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
  Loader2,
  CalendarIcon,
  ArrowLeftIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  MoreVerticalIcon,
  ClockIcon,
  UserIcon,
  MessageCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    avatar?: string;
  };
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  comments?: Array<{
    _id: string;
    userId: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    content: string;
    createdAt: string;
  }>;
}

export default function TaskDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);

  // Edit form data
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    assigneeId: "",
    estimatedHours: "",
    actualHours: "",
  });
  const [editDueDate, setEditDueDate] = useState<Date>();

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tasks/${taskId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Task not found");
        } else if (response.status === 403) {
          setError("You don't have access to this task");
        } else {
          setError("Failed to load task");
        }
        return;
      }

      const data = await response.json();
      setTask(data);
      
      // Initialize edit form
      setEditData({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assigneeId: data.assigneeId?._id || "",
        estimatedHours: data.estimatedHours?.toString() || "",
        actualHours: data.actualHours?.toString() || "",
      });
      
      if (data.dueDate) {
        setEditDueDate(new Date(data.dueDate));
      }
    } catch (error) {
      console.error("Task fetch error:", error);
      setError("Failed to load task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editData.title.trim(),
          description: editData.description.trim(),
          status: editData.status,
          priority: editData.priority,
          assigneeId: editData.assigneeId || null,
          dueDate: editDueDate ? editDueDate.toISOString() : null,
          estimatedHours: editData.estimatedHours ? parseFloat(editData.estimatedHours) : null,
          actualHours: editData.actualHours ? parseFloat(editData.actualHours) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update task");
      }

      const updatedTask = await response.json();
      setTask(updatedTask);
      setIsEditing(false);
      toast.success("Task updated successfully!");
    } catch (error: any) {
      console.error("Update task error:", error);
      toast.error(error.message || "Failed to update task");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedTask = await response.json();
      setTask(updatedTask);
      setEditData(prev => ({ ...prev, status: newStatus }));
      toast.success("Status updated successfully!");
    } catch (error: any) {
      console.error("Status update error:", error);
      toast.error("Failed to update status");
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setIsAddingComment(true);
      const response = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const updatedTask = await response.json();
      setTask(updatedTask);
      setNewComment("");
      toast.success("Comment added!");
    } catch (error: any) {
      console.error("Add comment error:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsAddingComment(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-500";
      case "in-progress":
        return "bg-blue-500";
      case "done":
        return "bg-green-500";
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
      case "todo":
        return "To Do";
      case "in-progress":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  const canEdit = task && session?.user?.email && (
    task.creatorId.email === session.user.email ||
    task.assigneeId?.email === session.user.email
  );

  if (isLoading) {
    return (
      <DashboardLayout title="Task">
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
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
              <div>
                <Card className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded"></div>
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

  if (error || !task) {
    return (
      <DashboardLayout title="Task">
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {error || "Task not found"}
              </h3>
              <p className="text-gray-500 mb-4">
                The task you're looking for doesn't exist or you don't have access to it.
              </p>
              <Link href="/tasks">
                <Button>Back to Tasks</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={task.title}>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/projects/${task.projectId._id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Project
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
              <p className="text-muted-foreground">
                in <Link href={`/projects/${task.projectId._id}`} className="hover:underline font-medium">{task.projectId.name}</Link>
              </p>
            </div>
          </div>
          
          {canEdit && (
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <EditIcon className="mr-2 h-4 w-4" />
                  Edit Task
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <SaveIcon className="mr-2 h-4 w-4" />
                    )}
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    <XIcon className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleStatusChange("todo")}>
                    Mark as To Do
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                    Mark as In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("done")}>
                    Mark as Done
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="details" className="space-y-6">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="comments">
                  Comments ({task.comments?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Task Information</CardTitle>
                      <div className="flex items-center gap-2">
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
                  <CardContent className="space-y-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={editData.title}
                            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                            disabled={isSaving}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={editData.description}
                            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                            disabled={isSaving}
                            rows={4}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                              value={editData.status}
                              onValueChange={(value) => setEditData(prev => ({ ...prev, status: value }))}
                              disabled={isSaving}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="todo">To Do</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select
                              value={editData.priority}
                              onValueChange={(value) => setEditData(prev => ({ ...prev, priority: value }))}
                              disabled={isSaving}
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
                        </div>

                        <div className="space-y-2">
                          <Label>Due Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !editDueDate && "text-muted-foreground"
                                )}
                                disabled={isSaving}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {editDueDate ? format(editDueDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={editDueDate}
                                onSelect={setEditDueDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Estimated Hours</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.5"
                              value={editData.estimatedHours}
                              onChange={(e) => setEditData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                              disabled={isSaving}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Actual Hours</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.5"
                              value={editData.actualHours}
                              onChange={(e) => setEditData(prev => ({ ...prev, actualHours: e.target.value }))}
                              disabled={isSaving}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-muted-foreground">Description</Label>
                          <p className="mt-1">{task.description}</p>
                        </div>

                        {(task.estimatedHours || task.actualHours) && (
                          <div className="grid grid-cols-2 gap-4">
                            {task.estimatedHours && (
                              <div>
                                <Label className="text-muted-foreground">Estimated Hours</Label>
                                <p className="mt-1 font-medium">{task.estimatedHours}h</p>
                              </div>
                            )}
                            {task.actualHours && (
                              <div>
                                <Label className="text-muted-foreground">Actual Hours</Label>
                                <p className="mt-1 font-medium">{task.actualHours}h</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Comments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add Comment */}
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={isAddingComment}
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={addComment}
                          disabled={isAddingComment || !newComment.trim()}
                          size="sm"
                        >
                          {isAddingComment ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <MessageCircleIcon className="mr-2 h-4 w-4" />
                          )}
                          Add Comment
                        </Button>
                      </div>
                    </div>

                    {/* Comments List */}
                    {task.comments && task.comments.length > 0 ? (
                      <div className="space-y-4">
                        {task.comments.map((comment) => (
                          <div key={comment._id} className="flex gap-3 p-4 border rounded-lg">
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarImage src={comment.userId.avatar} />
                              <AvatarFallback className="text-xs">
                                {comment.userId.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">
                                  {comment.userId.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                </span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircleIcon className="mx-auto h-8 w-8 mb-2" />
                        <p>No comments yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Meta */}
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Assigned to</div>
                  <div className="flex items-center space-x-2 mt-1">
                    {task.assigneeId ? (
                      <>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assigneeId.avatar} />
                          <AvatarFallback className="text-xs">
                            {task.assigneeId.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assigneeId.name}</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Created by</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.creatorId.avatar} />
                      <AvatarFallback className="text-xs">
                        {task.creatorId.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.creatorId.name}</span>
                  </div>
                </div>

                {task.dueDate && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Due Date</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="text-sm">
                        {format(new Date(task.dueDate), "PPP")}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Created</div>
                  <div className="flex items-center space-x-1 mt-1">
                    <ClockIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {format(new Date(task.createdAt), "PPP")}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                  <div className="flex items-center space-x-1 mt-1">
                    <ClockIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {format(new Date(task.updatedAt), "PPP")}
                    </span>
                  </div>
                </div>

                {task.completedAt && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Completed</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <ClockIcon className="h-4 w-4" />
                      <span className="text-sm">
                        {format(new Date(task.completedAt), "PPP")}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}