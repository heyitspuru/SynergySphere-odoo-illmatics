import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Message from "@/lib/models/Message";
import Project from "@/lib/models/Project";

// GET /api/projects/[id]/messages - Get project messages
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

    const projectId = params.id;

    // Check if user has access to the project
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify user access to project
    const hasAccess =
      project.ownerId.toString() === session.user.id ||
      project.members.some(
        (member: any) => member.userId.toString() === session.user.id
      );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied to project" },
        { status: 403 }
      );
    }

    // Get messages with author and reply information
    const messages = await Message.find({ projectId })
      .populate("authorId", "name email avatar")
      .populate("parentMessageId")
      .populate({
        path: "parentMessageId",
        populate: {
          path: "authorId",
          select: "name email",
        },
      })
      .sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/messages - Create new message
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, parentMessageId, taskId } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const projectId = params.id;

    // Check if user has access to the project
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify user access to project
    const hasAccess =
      project.ownerId.toString() === session.user.id ||
      project.members.some(
        (member: any) => member.userId.toString() === session.user.id
      );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied to project" },
        { status: 403 }
      );
    }

    // Create message
    const message = new Message({
      content: content.trim(),
      authorId: session.user.id,
      projectId,
      taskId: taskId || undefined,
      parentMessageId: parentMessageId || undefined,
    });

    await message.save();

    // Populate author information
    await message.populate("authorId", "name email avatar");
    if (parentMessageId) {
      await message.populate({
        path: "parentMessageId",
        populate: {
          path: "authorId",
          select: "name email",
        },
      });
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Message POST error:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
