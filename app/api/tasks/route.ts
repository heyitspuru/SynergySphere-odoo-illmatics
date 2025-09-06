import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Task from "@/lib/models/Task";
import Project from "@/lib/models/Project";
import User from "@/lib/models/User";

// GET /api/tasks - Get tasks (filtered by project or assigned user)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const assignedToMe = searchParams.get("assignedToMe") === "true";

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let query: any = {};

    if (projectId) {
      // Check if user has access to the project
      const project = await Project.findById(projectId);
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      const hasAccess =
        project.ownerId.toString() === user._id.toString() ||
        project.members.some(
          (member: any) => member.userId.toString() === user._id.toString()
        );

      if (!hasAccess) {
        return NextResponse.json(
          { error: "Access denied to project" },
          { status: 403 }
        );
      }

      query.projectId = projectId;
    }

    if (assignedToMe) {
      query.assigneeId = user._id;
    }

    // If no specific filter, get tasks from user's projects
    if (!projectId && !assignedToMe) {
      const userProjects = await Project.find({
        $or: [{ ownerId: user._id }, { "members.userId": user._id }],
      }).select("_id");

      query.projectId = { $in: userProjects.map((p) => p._id) };
    }

    const tasks = await Task.find(query)
      .populate("assigneeId", "name email avatar")
      .populate("projectId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Tasks GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, projectId, assigneeId, priority, dueDate } =
      body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has access to create tasks in this project
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const hasAccess =
      project.ownerId.toString() === user._id.toString() ||
      project.members.some(
        (member: any) => member.userId.toString() === user._id.toString()
      );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied to project" },
        { status: 403 }
      );
    }

    // Create task
    const task = new Task({
      title: title.trim(),
      description: description?.trim() || "",
      projectId,
      assigneeId: assigneeId || null,
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      creatorId: user._id,
    });

    await task.save();

    // Populate response
    await task.populate("assigneeId", "name email avatar");
    await task.populate("projectId", "name");

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Tasks POST error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
