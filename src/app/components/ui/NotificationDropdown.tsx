import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./popover";
import { Button } from "./button";
import {
  Bell,
  MessageSquare,
  Calendar,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

export type NotificationType = "message" | "session" | "request" | "system";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "request",
    title: "New mentorship request received",
    description: "Michael Chen wants to connect with you",
    timestamp: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "session",
    title: "Session scheduled for tomorrow",
    description: "Career Growth Strategy with Dr. Sarah Johnson at 2:00 PM",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "message",
    title: "New message from mentor",
    description: "Dr. Sarah Johnson: 'Looking forward to our session!'",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "session",
    title: "Session completed — leave feedback",
    description: "Your session with Alex Kumar has ended. Rate your experience",
    timestamp: "3 hours ago",
    read: false,
  },
  {
    id: "5",
    type: "request",
    title: "Mentor accepted your request",
    description: "Emily Rodriguez has accepted your mentorship request",
    timestamp: "5 hours ago",
    read: true,
  },
  {
    id: "6",
    type: "system",
    title: "Reminder: session in 1 hour",
    description: "You have a session with Michael Chen starting soon",
    timestamp: "1 day ago",
    read: false,
  },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "message":
      return <MessageSquare size={18} className="text-indigo-600" />;
    case "session":
      return <Calendar size={18} className="text-emerald-600" />;
    case "request":
      return <UserCheck size={18} className="text-blue-600" />;
    case "system":
      return <AlertCircle size={18} className="text-amber-600" />;
    default:
      return <Bell size={18} className="text-gray-600" />;
  }
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell size={20} className="text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[380px] p-0 border-0 shadow-lg"
        sideOffset={8}
      >
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
              >
                Mark all as read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600 font-medium">You're all caught up!</p>
                <p className="text-sm text-gray-500 mt-1">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      notification.read ? "bg-white" : "bg-indigo-50/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p
                            className={`text-sm font-medium ${
                              notification.read ? "text-gray-700" : "text-gray-900 font-semibold"
                            }`}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1.5 line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
