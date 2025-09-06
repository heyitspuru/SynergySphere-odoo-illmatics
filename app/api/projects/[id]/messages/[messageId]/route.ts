import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Message from "@/lib/models/Message";

// PUT /api/projects/[id]/messages/[messageId] - Update message
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const message = await Message.findById(params.messageId);
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Check if user is the author
    if (message.authorId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Can only edit your own messages" },
        { status: 403 }
      );
    }

    // Update message
    message.content = content.trim();
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    // Populate author information
    await message.populate("authorId", "name email avatar");

    return NextResponse.json(message);
  } catch (error) {
    console.error("Message PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]/messages/[messageId] - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const message = await Message.findById(params.messageId);
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Check if user is the author
    if (message.authorId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Can only delete your own messages" },
        { status: 403 }
      );
    }

    await Message.findByIdAndDelete(params.messageId);

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Message DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
