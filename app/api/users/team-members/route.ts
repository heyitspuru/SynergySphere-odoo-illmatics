import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Project from "@/lib/models/Project";
import Task from "@/lib/models/Task";

// GET /api/users/team-members - Get all database users (team members)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get ALL users from the database
    const allUsers = await User.find({}).select("name email avatar role");

    // Get all projects to map memberships
    const allProjects = await Project.find({}).populate(
      "members.userId",
      "name email avatar role"
    );

    // Build project memberships map for all users
    const projectMemberships = new Map<string, any[]>();

    allProjects.forEach((project) => {
      // Add project owner
      const ownerId = project.ownerId.toString();
      if (!projectMemberships.has(ownerId)) {
        projectMemberships.set(ownerId, []);
      }
      projectMemberships.get(ownerId)!.push({
        _id: project._id,
        name: project.name,
        role: "owner",
      });

      // Add project members
      project.members.forEach((member: any) => {
        const memberId = member.userId._id.toString();
        if (!projectMemberships.has(memberId)) {
          projectMemberships.set(memberId, []);
        }
        projectMemberships.get(memberId)!.push({
          _id: project._id,
          name: project.name,
          role: member.role,
        });
      });
    });

    // Get task statistics for each user
    const teamMembers = [];

    for (const user of allUsers) {
      const userId = user._id.toString();

      const [assignedTasks, completedTasks] = await Promise.all([
        Task.countDocuments({ assigneeId: userId }),
        Task.countDocuments({ assigneeId: userId, status: "done" }),
      ]);

      teamMembers.push({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        projects: projectMemberships.get(userId) || [],
        tasksAssigned: assignedTasks,
        tasksCompleted: completedTasks,
      });
    }

    // Sort by name for better UX
    teamMembers.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Team members GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}
