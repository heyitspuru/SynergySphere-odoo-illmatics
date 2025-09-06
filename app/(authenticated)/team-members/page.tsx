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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusIcon,
  SearchIcon,
  Loader2,
  Mail,
  Users,
  Crown,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  projects: Array<{
    _id: string;
    name: string;
    role: "owner" | "admin" | "member";
  }>;
  tasksAssigned: number;
  tasksCompleted: number;
}

export default function TeamMembersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);

  // Invite member form state
  const [memberEmail, setMemberEmail] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchMembers();
    }
  }, [status, router]);

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/users/team-members");
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch team members",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Fetch members error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch team members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberEmail.trim()) {
      toast({
        title: "Error",
        description: "Email address is required",
        variant: "destructive",
      });
      return;
    }

    setInviteLoading(true);

    try {
      const response = await fetch("/api/users/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: memberEmail.trim(),
        }),
      });

      if (response.ok) {
        setInviteDialogOpen(false);
        setMemberEmail("");

        toast({
          title: "Success",
          description: "Invitation sent successfully",
        });

        // Refresh the members list
        fetchMembers();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to send invitation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Invite member error:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
            <p className="text-muted-foreground mt-2">
              Manage your team members and their roles
            </p>
          </div>

          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleInviteMember}>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your team.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setInviteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={inviteLoading}>
                    {inviteLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Send Invitation
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      {filteredMembers.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4">
              {members.length === 0
                ? "No team members yet"
                : "No members match your search"}
            </CardTitle>
            <CardDescription>
              {members.length === 0
                ? "Invite your first team member to start collaborating."
                : "Try adjusting your search criteria."}
            </CardDescription>
          </CardHeader>
          {members.length === 0 && (
            <CardContent>
              <Button
                onClick={() => setInviteDialogOpen(true)}
                className="gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Invite Your First Member
              </Button>
            </CardContent>
          )}
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <Card
              key={member._id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-lg">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-1">
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="w-fit mx-auto">
                  {member.role === "admin" ? (
                    <>
                      <Crown className="h-3 w-3 mr-1" />
                      Admin
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3 mr-1" />
                      Member
                    </>
                  )}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Project Memberships */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Projects</h4>
                  {member.projects.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No projects yet
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {member.projects.slice(0, 3).map((project) => (
                        <div
                          key={project._id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="truncate">{project.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {project.role}
                          </Badge>
                        </div>
                      ))}
                      {member.projects.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{member.projects.length - 3} more projects
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Task Statistics */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {member.tasksAssigned}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Assigned
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {member.tasksCompleted}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Completed
                    </div>
                  </div>
                </div>

                {/* Completion Rate */}
                {member.tasksAssigned > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span>
                        {Math.round(
                          (member.tasksCompleted / member.tasksAssigned) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.round(
                            (member.tasksCompleted / member.tasksAssigned) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
