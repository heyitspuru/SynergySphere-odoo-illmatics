import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Task from "@/lib/models/Task";
import Project from "@/lib/models/Project";

// GET /api/notifications/upcoming-deadlines - Get tasks with upcoming deadlines
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.id;
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Find user's projects
    const userProjects = await Project.find({
      $or: [{ ownerId: userId }, { "members.userId": userId }],
    });

    const projectIds = userProjects.map((p) => p._id);

    // Find tasks with upcoming deadlines
    const upcomingTasks = await Task.find({
      projectId: { $in: projectIds },
      dueDate: {
        $gte: now,
        $lte: threeDaysFromNow,
      },
      status: { $ne: "done" },
    })
      .populate("assigneeId", "name email")
      .populate("projectId", "name")
      .sort({ dueDate: 1 });

    // Filter to only include tasks assigned to the current user
    const myUpcomingTasks = upcomingTasks.filter(
      (task) => !task.assigneeId || task.assigneeId._id.toString() === userId
    );

    // Find overdue tasks
    const overdueTasks = await Task.find({
      projectId: { $in: projectIds },
      dueDate: { $lt: now },
      status: { $ne: "done" },
    })
      .populate("assigneeId", "name email")
      .populate("projectId", "name")
      .sort({ dueDate: 1 });

    const myOverdueTasks = overdueTasks.filter(
      (task) => !task.assigneeId || task.assigneeId._id.toString() === userId
    );

    const notifications = [
      ...myUpcomingTasks.map((task) => {
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate.getTime() - now.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        return {
          id: `upcoming-${task._id}`,
          type: "upcoming_deadline",
          title: "Task Due Soon",
          message: `"${task.title}" is due ${
            daysLeft === 1 ? "tomorrow" : `in ${daysLeft} days`
          }`,
          taskId: task._id,
          taskTitle: task.title,
          projectName: task.projectId.name,
          dueDate: task.dueDate,
          priority: daysLeft === 1 ? "high" : daysLeft === 2 ? "medium" : "low",
          createdAt: new Date().toISOString(),
        };
      }),
      ...myOverdueTasks.map((task) => {
        const dueDate = new Date(task.dueDate);
        const timeDiff = now.getTime() - dueDate.getTime();
        const daysOverdue = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        return {
          id: `overdue-${task._id}`,
          type: "overdue_task",
          title: "Task Overdue",
          message: `"${task.title}" is ${daysOverdue} day${
            daysOverdue === 1 ? "" : "s"
          } overdue`,
          taskId: task._id,
          taskTitle: task.title,
          projectName: task.projectId.name,
          dueDate: task.dueDate,
          priority: "critical",
          createdAt: new Date().toISOString(),
        };
      }),
    ];

    return NextResponse.json({
      notifications,
      counts: {
        upcoming: myUpcomingTasks.length,
        overdue: myOverdueTasks.length,
        total: notifications.length,
      },
    });
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
