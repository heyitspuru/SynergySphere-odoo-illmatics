import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Project from "@/lib/models/Project";
import Task from "@/lib/models/Task";

// GET /api/users/profile - Get current user profile with statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user statistics
    const [
      ownedProjectsCount,
      memberProjectsCount,
      assignedTasksCount,
      completedTasksCount,
    ] = await Promise.all([
      Project.countDocuments({ ownerId: user._id }),
      Project.countDocuments({ "members.userId": user._id }),
      Task.countDocuments({ assigneeId: user._id }),
      Task.countDocuments({ assigneeId: user._id, status: "done" }),
    ]);

    const totalProjectsCount = ownedProjectsCount + memberProjectsCount;

    // Return user profile without password
    const profile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      role: user.role,
      location: user.location,
      jobTitle: user.jobTitle,
      company: user.company,
      timezone: user.timezone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      statistics: {
        totalProjects: totalProjectsCount,
        ownedProjects: ownedProjectsCount,
        memberProjects: memberProjectsCount,
        tasksAssigned: assignedTasksCount,
        tasksCompleted: completedTasksCount,
        completionRate:
          assignedTasksCount > 0
            ? Math.round((completedTasksCount / assignedTasksCount) * 100)
            : 0,
      },
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/profile - Update current user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, bio, skills, location, jobTitle, company, timezone } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user profile
    user.name = name.trim();
    user.bio = bio?.trim() || "";
    user.skills = Array.isArray(skills) ? skills : [];
    user.location = location?.trim() || "";
    user.jobTitle = jobTitle?.trim() || "";
    user.company = company?.trim() || "";
    user.timezone = timezone?.trim() || "";
    user.updatedAt = new Date();

    await user.save();

    // Get updated statistics
    const [
      ownedProjectsCount,
      memberProjectsCount,
      assignedTasksCount,
      completedTasksCount,
    ] = await Promise.all([
      Project.countDocuments({ ownerId: user._id }),
      Project.countDocuments({ "members.userId": user._id }),
      Task.countDocuments({ assigneeId: user._id }),
      Task.countDocuments({ assigneeId: user._id, status: "done" }),
    ]);

    const totalProjectsCount = ownedProjectsCount + memberProjectsCount;

    // Return updated profile without password
    const profile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      role: user.role,
      location: user.location,
      jobTitle: user.jobTitle,
      company: user.company,
      timezone: user.timezone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      statistics: {
        totalProjects: totalProjectsCount,
        ownedProjects: ownedProjectsCount,
        memberProjects: memberProjectsCount,
        tasksAssigned: assignedTasksCount,
        tasksCompleted: completedTasksCount,
        completionRate:
          assignedTasksCount > 0
            ? Math.round((completedTasksCount / assignedTasksCount) * 100)
            : 0,
      },
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
