import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Project from "@/lib/models/Project";
import Task from "@/lib/models/Task";

// GET /api/users/team-members - Get team members data
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

    // Find all projects where current user is owner or member
    const userProjects = await Project.find({
      $or: [
        { ownerId: currentUser._id },
        { "members.userId": currentUser._id },
      ],
    }).populate("members.userId", "name email avatar role");

    // Get all unique team members from these projects
    const teamMemberIds = new Set<string>();
    const projectMemberships = new Map<string, any[]>();

    userProjects.forEach((project) => {
      project.members.forEach((member: any) => {
        const memberId = member.userId._id.toString();
        teamMemberIds.add(memberId);

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

    // Get task statistics for each team member
    const teamMembers = [];

    for (const memberId of teamMemberIds) {
      const user = await User.findById(memberId);
      if (!user) continue;

      const [assignedTasks, completedTasks] = await Promise.all([
        Task.countDocuments({
          assigneeId: memberId,
          projectId: { $in: userProjects.map((p) => p._id) },
        }),
        Task.countDocuments({
          assigneeId: memberId,
          status: "done",
          projectId: { $in: userProjects.map((p) => p._id) },
        }),
      ]);

      teamMembers.push({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        projects: projectMemberships.get(memberId) || [],
        tasksAssigned: assignedTasks,
        tasksCompleted: completedTasks,
      });
    }

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Team members GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}
