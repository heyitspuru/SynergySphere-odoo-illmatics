import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Message content is required"],
    trim: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
  parentMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  mentions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  attachments: [
    {
      filename: String,
      url: String,
      type: String,
      size: Number,
    },
  ],
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
  },
  reactions: [
    {
      emoji: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
MessageSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes
MessageSchema.index({ projectId: 1, createdAt: -1 });
MessageSchema.index({ taskId: 1, createdAt: -1 });
MessageSchema.index({ authorId: 1 });
MessageSchema.index({ parentMessageId: 1 });

export const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
export default Message;
