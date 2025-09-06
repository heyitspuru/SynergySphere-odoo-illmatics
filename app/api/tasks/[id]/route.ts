import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Task from "@/lib/models/Task";
import Project from "@/lib/models/Project";
import User from "@/lib/models/User";

// GET /api/tasks/[id] - Get task details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get task and populate related data
    const task = await Task.findById(params.id)
      .populate("assigneeId", "name email avatar")
      .populate("projectId", "name ownerId members");

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check if user has access to this task through project membership
    const project = task.projectId as any;
    const hasAccess =
      project.ownerId.toString() === user._id.toString() ||
      project.members.some(
        (member: any) => member.userId.toString() === user._id.toString()
      );

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Task GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] - Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, status, assigneeId, priority, dueDate } = body;

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find task and check access through project
    const task = await Task.findById(params.id).populate("projectId");
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const project = task.projectId as any;
    const hasAccess =
      project.ownerId.toString() === user._id.toString() ||
      project.members.some(
        (member: any) => member.userId.toString() === user._id.toString()
      );

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Update task fields
    if (title?.trim()) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status) task.status = status;
    if (assigneeId !== undefined) task.assigneeId = assigneeId || null;
    if (priority) task.priority = priority;
    if (dueDate !== undefined)
      task.dueDate = dueDate ? new Date(dueDate) : null;

    await task.save();

    // Populate response
    await task.populate("assigneeId", "name email avatar");
    await task.populate("projectId", "name");

    return NextResponse.json(task);
  } catch (error) {
    console.error("Task PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find task and check access through project
    const task = await Task.findById(params.id).populate("projectId");
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const project = task.projectId as any;

    // Only project owner/admin or task creator can delete tasks
    const isProjectOwner = project.ownerId.toString() === user._id.toString();
    const isProjectAdmin = project.members.some(
      (member: any) =>
        member.userId.toString() === user._id.toString() &&
        member.role === "admin"
    );

    if (!isProjectOwner && !isProjectAdmin) {
      return NextResponse.json(
        {
          error: "Only project owner or admin can delete tasks",
        },
        { status: 403 }
      );
    }

    // Delete task
    await Task.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Task DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
