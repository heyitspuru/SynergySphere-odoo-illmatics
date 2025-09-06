import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Task from "@/lib/models/Task";
import Project from "@/lib/models/Project";
import User from "@/lib/models/User";

// POST /api/tasks/[id]/comments - Add comment to task
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
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
    const hasAccess =
      project.ownerId.toString() === user._id.toString() ||
      project.members.some(
        (member: any) => member.userId.toString() === user._id.toString()
      );

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Add comment to task
    const newComment = {
      userId: user._id,
      content: content.trim(),
      createdAt: new Date(),
    };

    task.comments = task.comments || [];
    task.comments.push(newComment);
    await task.save();

    // Populate the response
    await task.populate("assigneeId", "name email avatar");
    await task.populate("projectId", "name");
    await task.populate("creatorId", "name email avatar");
    await task.populate("comments.userId", "name email avatar");

    return NextResponse.json(task);
  } catch (error) {
    console.error("Add comment error:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}

// GET /api/tasks/[id]/comments - Get task comments
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

    // Find task and check access through project
    const task = await Task.findById(params.id)
      .populate("projectId", "ownerId members")
      .populate("comments.userId", "name email avatar");

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

    return NextResponse.json(task.comments || []);
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}