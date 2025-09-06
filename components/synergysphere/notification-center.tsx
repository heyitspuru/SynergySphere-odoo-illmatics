"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Bell, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  type: "upcoming_deadline" | "overdue_task";
  title: string;
  message: string;
  taskId: string;
  taskTitle: string;
  projectName: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
}

export function NotificationCenter() {
  const { data: session } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
      // Set up periodic check every 5 minutes
      const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchNotifications = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      const response = await fetch("/api/notifications/upcoming-deadlines");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setTotalCount(data.counts.total);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "medium":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  const getPriorityIcon = (type: string, priority: string) => {
    if (type === "overdue_task") {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    return <Clock className={`h-4 w-4 ${getPriorityColor(priority)}`} />;
  };

  const handleNotificationClick = (notification: Notification) => {
    // Navigate to tasks page with filter for the specific task
    router.push(`/tasks?highlight=${notification.taskId}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {totalCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {totalCount > 9 ? "9+" : totalCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="pb-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            {totalCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {totalCount}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>

        <Separator />

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm text-muted-foreground">
                All caught up! No pending notifications.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className="p-3 cursor-pointer hover:bg-muted/50"
              >
                <div className="flex gap-3 w-full">
                  <div className="flex-shrink-0 mt-1">
                    {getPriorityIcon(notification.type, notification.priority)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-sm truncate">
                        {notification.title}
                      </h5>
                      <Badge
                        variant={
                          notification.priority === "critical"
                            ? "destructive"
                            : notification.priority === "high"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs ml-2"
                      >
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate">
                        {notification.projectName}
                      </span>
                      <span>{formatTimeAgo(notification.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => router.push("/tasks")}
              >
                View All Tasks
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
