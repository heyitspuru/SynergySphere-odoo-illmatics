"use client";

import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Send,
  Reply,
  MoreHorizontal,
  Edit,
  Trash2,
  Clock,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface Message {
  _id: string;
  content: string;
  authorId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  projectId: string;
  taskId?: string;
  parentMessageId?: {
    _id: string;
    content: string;
    authorId: {
      name: string;
      email: string;
    };
  };
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface DiscussionThreadProps {
  projectId: string;
  taskId?: string;
}

export function DiscussionThread({ projectId, taskId }: DiscussionThreadProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [projectId, taskId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const url = `/api/projects/${projectId}/messages${
        taskId ? `?taskId=${taskId}` : ""
      }`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch messages",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Fetch messages error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          parentMessageId: replyingTo,
          taskId,
        }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages([...messages, message]);
        setNewMessage("");
        setReplyingTo(null);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to send message",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const editMessage = async () => {
    if (!editContent.trim() || !editingMessage) return;

    try {
      const response = await fetch(
        `/api/projects/${projectId}/messages/${editingMessage}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editContent.trim(),
          }),
        }
      );

      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages(
          messages.map((msg) =>
            msg._id === editingMessage ? updatedMessage : msg
          )
        );
        setEditingMessage(null);
        setEditContent("");
        toast({
          title: "Success",
          description: "Message updated",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update message",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Edit message error:", error);
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/messages/${messageId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMessages(messages.filter((msg) => msg._id !== messageId));
        setDeleteDialog(null);
        toast({
          title: "Success",
          description: "Message deleted",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to delete message",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Delete message error:", error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString();
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => {
    const isOwn = message.authorId._id === session?.user?.id;

    return (
      <div
        className={`flex gap-3 ${isOwn ? "justify-end" : "justify-start"} mb-4`}
      >
        {!isOwn && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src={message.authorId.avatar} />
            <AvatarFallback className="text-xs">
              {message.authorId.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}

        <div
          className={`flex flex-col ${
            isOwn ? "items-end" : "items-start"
          } max-w-[70%]`}
        >
          {/* Reply indicator */}
          {message.parentMessageId && (
            <div className="text-xs text-muted-foreground mb-1 px-3">
              <Reply className="h-3 w-3 inline mr-1" />
              Replying to {message.parentMessageId.authorId.name}
            </div>
          )}

          <Card
            className={`p-3 relative group ${
              isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {!isOwn && (
                  <span className="text-sm font-medium">
                    {message.authorId.name}
                  </span>
                )}
                <span
                  className={`text-xs flex items-center gap-1 ${
                    isOwn
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  <Clock className="h-3 w-3" />
                  {formatTime(message.createdAt)}
                  {message.isEdited && " (edited)"}
                </span>
              </div>

              {/* Actions */}
              {isOwn && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingMessage(message._id);
                        setEditContent(message.content);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteDialog(message._id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Content */}
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>

            {/* Reply button */}
            {!isOwn && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-6 text-xs opacity-0 group-hover:opacity-100"
                onClick={() => setReplyingTo(message._id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </Card>
        </div>

        {isOwn && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src={message.authorId.avatar} />
            <AvatarFallback className="text-xs">
              {message.authorId.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message._id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-muted/50 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <Reply className="h-4 w-4 inline mr-1" />
            Replying to message
          </div>
          <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
            Cancel
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[40px] max-h-[120px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingMessage}
        onOpenChange={() => {
          setEditingMessage(null);
          setEditContent("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
            <DialogDescription>Make changes to your message.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingMessage(null);
                setEditContent("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={editMessage}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && deleteMessage(deleteDialog)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
