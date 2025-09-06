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
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Calendar,
  Crown,
  Edit,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio: string;
  skills: string[];
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editSkills, setEditSkills] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/users/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditName(data.name);
        setEditBio(data.bio || "");
        setEditSkills(data.skills.join(", "));
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);

    try {
      const skillsArray = editSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName.trim(),
          bio: editBio.trim(),
          skills: skillsArray,
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setEditing(false);

        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditName(profile.name);
      setEditBio(profile.bio || "");
      setEditSkills(profile.skills.join(", "));
    }
    setEditing(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session || !profile) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your profile information and preferences
            </p>
          </div>

          {!editing ? (
            <Button onClick={() => setEditing(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your personal information and role details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-2xl">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Badge variant="outline" className="gap-1">
                  {profile.role === "admin" ? (
                    <>
                      <Crown className="h-3 w-3" />
                      Admin
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3" />
                      Member
                    </>
                  )}
                </Badge>
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                {editing ? (
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        placeholder="Tell us about yourself"
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="skills">Skills</Label>
                      <Input
                        id="skills"
                        value={editSkills}
                        onChange={(e) => setEditSkills(e.target.value)}
                        placeholder="Enter skills separated by commas"
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate multiple skills with commas
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <div className="grid gap-1">
                      <Label className="text-sm font-medium">Full Name</Label>
                      <p className="text-lg">{profile.name}</p>
                    </div>

                    <div className="grid gap-1">
                      <Label className="text-sm font-medium flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <p>{profile.email}</p>
                    </div>

                    {profile.bio && (
                      <div className="grid gap-1">
                        <Label className="text-sm font-medium">Bio</Label>
                        <p className="text-muted-foreground">{profile.bio}</p>
                      </div>
                    )}

                    {profile.skills.length > 0 && (
                      <div className="grid gap-2">
                        <Label className="text-sm font-medium">Skills</Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="grid gap-1">
                      <Label className="text-sm font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Member Since
                      </Label>
                      <p className="text-muted-foreground">
                        {new Date(profile.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Account Activity</CardTitle>
            <CardDescription>
              Your activity and contribution statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">-</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">-</div>
                <div className="text-sm text-muted-foreground">
                  Tasks Completed
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">-</div>
                <div className="text-sm text-muted-foreground">
                  Contributions
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
