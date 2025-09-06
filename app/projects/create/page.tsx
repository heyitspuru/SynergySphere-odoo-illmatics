"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface TeamMember {
  email: string;
  role: "member" | "admin";
}

export default function CreateProjectPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    priority: "medium",
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTeamMember = () => {
    if (!memberEmail.trim()) return;
    
    // Check if email is already added
    if (teamMembers.some((member) => member.email === memberEmail.trim())) {
      toast.error("Team member already added");
      return;
    }

    // Check if it's the current user's email
    if (memberEmail.trim() === session?.user?.email) {
      toast.error("You are automatically added as the project owner");
      setMemberEmail("");
      return;
    }

    const newMember: TeamMember = {
      email: memberEmail.trim(),
      role: "member",
    };

    setTeamMembers((prev) => [...prev, newMember]);
    setMemberEmail("");
    toast.success("Team member added");
  };

  const removeTeamMember = (email: string) => {
    setTeamMembers((prev) => prev.filter((member) => member.email !== email));
    toast.success("Team member removed");
  };

  const updateMemberRole = (email: string, newRole: "member" | "admin") => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.email === email ? { ...member, role: newRole } : member
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Project name is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Project description is required");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          status: formData.status,
          priority: formData.priority,
          members: teamMembers.map((member) => member.email),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create project");
      }

      const project = await response.json();
      toast.success("Project created successfully!");
      
      // Redirect to the new project
      router.push(`/projects/${project._id}`);
    } catch (error: any) {
      console.error("Create project error:", error);
      setError(error.message || "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Project">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
            <p className="text-muted-foreground mt-2">
              Set up a new project and invite your team members to collaborate.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Provide the essential details for your project.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter project name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project goals and objectives"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    disabled={isLoading}
                    required
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Add team members by their email addresses. You will be added as the project owner automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter team member email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTeamMember())}
                    disabled={isLoading}
                    type="email"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addTeamMember}
                    disabled={isLoading || !memberEmail.trim()}
                    size="sm"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                {teamMembers.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Team Members ({teamMembers.length})</h4>
                    <div className="space-y-2">
                      {teamMembers.map((member) => (
                        <div
                          key={member.email}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="text-sm font-medium">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Select
                              value={member.role}
                              onValueChange={(value: "member" | "admin") =>
                                updateMemberRole(member.email, value)
                              }
                              disabled={isLoading}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTeamMember(member.email)}
                              disabled={isLoading}
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current user info */}
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{session?.user?.email}</p>
                      <p className="text-xs text-muted-foreground">You (Project Owner)</p>
                    </div>
                    <Badge variant="secondary">Owner</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6">
              <Link href="/projects">
                <Button variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}