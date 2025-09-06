"use client";

import type React from "react";

import { useState } from "react";
import Layout from "./layout";
import { Button } from "@/components/ui/button";
import {
  Users,
  Activity,
  CheckCircle,
  PlusCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Types
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "on-hold";
  progress: number;
  dueDate: Date;
  teamMembers: number;
}

interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  assignee: string;
  dueDate: Date;
  project: string;
}

interface ActivityItem {
  id: string;
  type: "team_joined" | "project_updated" | "task_completed" | "task_assigned";
  content: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar: string;
  };
}

export default function Dashboard() {
  // Sample data - will be replaced with real data from APIs
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Alex Johnson",
      role: "Full Stack Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["React", "Node.js", "TypeScript"],
    },
    {
      id: "2",
      name: "Sarah Kim",
      role: "Frontend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["React", "TypeScript", "Tailwind CSS"],
    },
    {
      id: "3",
      name: "David Rodriguez",
      role: "Backend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Python", "Node.js", "MongoDB"],
    },
  ]);

  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Mobile App Redesign",
      description: "Complete redesign of the mobile application UI/UX",
      status: "active",
      progress: 65,
      dueDate: new Date("2024-03-15"),
      teamMembers: 4,
    },
    {
      id: "2",
      name: "API Integration",
      description: "Integrate third-party APIs for enhanced functionality",
      status: "active",
      progress: 30,
      dueDate: new Date("2024-04-01"),
      teamMembers: 2,
    },
    {
      id: "3",
      name: "Database Migration",
      description: "Migrate from MySQL to PostgreSQL",
      status: "completed",
      progress: 100,
      dueDate: new Date("2024-02-28"),
      teamMembers: 3,
    },
  ]);

  const [recentTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design user authentication flow",
      status: "in-progress",
      assignee: "Sarah Kim",
      dueDate: new Date("2024-03-05"),
      project: "Mobile App Redesign",
    },
    {
      id: "2",
      title: "Set up API endpoints",
      status: "todo",
      assignee: "David Rodriguez",
      dueDate: new Date("2024-03-08"),
      project: "API Integration",
    },
    {
      id: "3",
      title: "Write unit tests",
      status: "done",
      assignee: "Alex Johnson",
      dueDate: new Date("2024-03-01"),
      project: "Mobile App Redesign",
    },
  ]);

  const [activities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "project_updated",
      content: "Mobile App Redesign project milestone reached",
      timestamp: new Date("2024-03-02T14:30:00"),
    },
    {
      id: "2",
      type: "task_completed",
      content: "Sarah completed 'User Authentication UI' task",
      timestamp: new Date("2024-03-02T10:15:00"),
      user: {
        name: "Sarah Kim",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "3",
      type: "team_joined",
      content: "Emily Chen joined the team",
      timestamp: new Date("2024-03-01T16:45:00"),
      user: {
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "4",
      type: "task_assigned",
      content: "David was assigned to 'Database Schema Update' task",
      timestamp: new Date("2024-03-01T09:20:00"),
      user: {
        name: "David Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ]);

  // Stats
  const stats = [
    { label: "Team Members", value: teamMembers.length, icon: Users },
    {
      label: "Active Projects",
      value: projects.filter((p) => p.status === "active").length,
      icon: Activity,
    },
    {
      label: "Tasks Completed",
      value: recentTasks.filter((t) => t.status === "done").length,
      icon: CheckCircle,
    },
    { label: "Overall Progress", value: 78, icon: Activity },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
            Welcome back, Alex!
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-1">
            Here's an overview of your team's progress and current projects.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border border-zinc-200 dark:border-zinc-800"
            >
              <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-3">
                  <stat.icon className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Projects */}
            <Card className="border border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Active Projects
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
                <CardDescription>
                  Your current project portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  {projects
                    .filter((p) => p.status === "active")
                    .map((project) => (
                      <div
                        key={project.id}
                        className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-zinc-900 dark:text-white">
                            {project.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {project.progress}% complete
                          </Badge>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                          <span>{project.teamMembers} members</span>
                          <span>
                            Due: {project.dueDate.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-2 bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
              </CardFooter>
            </Card>

            {/* Recent Activity */}
            <Card className="border border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates from your team</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  {activities.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className="p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                        {activity.type === "task_completed" && (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        )}
                        {activity.type === "project_updated" && (
                          <Activity className="h-3 w-3 text-blue-600" />
                        )}
                        {activity.type === "team_joined" && (
                          <Users className="h-3 w-3 text-purple-600" />
                        )}
                        {activity.type === "task_assigned" && (
                          <Clock className="h-3 w-3 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-900 dark:text-zinc-100">
                          {activity.content}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {activity.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center"
                >
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Team Members */}
            <Card className="border border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Your Team
                  </CardTitle>
                  <Link href="/team-members/create">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>Current team members</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center"
                >
                  View All Members
                </Button>
              </CardFooter>
            </Card>

            {/* Recent Tasks */}
            <Card className="border border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Recent Tasks
                </CardTitle>
                <CardDescription>Latest task updates</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  {recentTasks.slice(0, 4).map((task) => (
                    <div
                      key={task.id}
                      className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                          {task.title}
                        </h4>
                        <Badge
                          variant={
                            task.status === "done" ? "default" : "secondary"
                          }
                          className="text-xs ml-2"
                        >
                          {task.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{task.assignee}</span>
                        <span>Due: {task.dueDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center"
                >
                  View All Tasks
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
