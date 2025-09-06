import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import User from "@/lib/models/User";

// GET /api/projects - List user's projects
export async function GET(request: NextRequest) {
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

    // Get projects where user is owner or member
    const projects = await Project.find({
      $or: [{ ownerId: user._id }, { "members.userId": user._id }],
    })
      .populate("ownerId", "name email avatar")
      .populate("members.userId", "name email avatar")
      .sort({ createdAt: -1 });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, members } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create project
    const project = new Project({
      name: name.trim(),
      description: description?.trim() || "",
      ownerId: user._id,
      members: [
        {
          userId: user._id,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    });

    // Add additional members if provided
    if (members && Array.isArray(members)) {
      for (const memberEmail of members) {
        const memberUser = await User.findOne({ email: memberEmail.trim() });
        if (memberUser && memberUser._id.toString() !== user._id.toString()) {
          project.members.push({
            userId: memberUser._id,
            role: "member",
            joinedAt: new Date(),
          });
        }
      }
    }

    await project.save();

    // Populate the response
    await project.populate("ownerId", "name email avatar");
    await project.populate("members.userId", "name email avatar");

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
