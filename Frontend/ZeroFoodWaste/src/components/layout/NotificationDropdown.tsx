import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Bell,
  CheckCheck,
  Trash2,
  Loader2,
  AlertCircle,
  Gift,
  Award,
  Truck,
  Clock,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Notification {
  _id: string;
  message: string;
  type: string;
  readStatus: boolean;
  createdAt: string;
  relatedId?: string;
  metadata?: any;
}

const notificationTypeIcons: Record<string, any> = {
  DONATION_ACCEPTED: Gift,
  DONATION_COMPLETED: CheckCheck,
  DONATION_IN_TRANSIT: Truck,
  VOLUNTEER_ASSIGNED: Clock,
  BADGE_EARNED: Award,
  POINTS_EARNED: Award,
  DONATION_PICKUP_CANCELLED: AlertCircle,
  SYSTEM: AlertCircle,
  ADMIN: AlertCircle,
};

const notificationTypeColors: Record<string, string> = {
  DONATION_ACCEPTED: "bg-green-100 text-green-700",
  DONATION_COMPLETED: "bg-blue-100 text-blue-700",
  DONATION_IN_TRANSIT: "bg-yellow-100 text-yellow-700",
  VOLUNTEER_ASSIGNED: "bg-purple-100 text-purple-700",
  BADGE_EARNED: "bg-pink-100 text-pink-700",
  POINTS_EARNED: "bg-orange-100 text-orange-700",
  DONATION_PICKUP_CANCELLED: "bg-red-100 text-red-700",
  SYSTEM: "bg-gray-100 text-gray-700",
  ADMIN: "bg-red-100 text-red-700",
};

export function NotificationDropdown() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = (await api.getNotifications(false, 10)) as any;
      if (response.success && response.data?.notifications) {
        setNotifications(response.data.notifications);
        const unread = response.data.notifications.filter(
          (n: Notification) => !n.readStatus,
        ).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch unread count on component mount and when dropdown opens
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = (await api.markNotificationAsRead(
        notificationId,
      )) as any;
      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, readStatus: true } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = (await api.markAllNotificationsAsRead()) as any;
      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, readStatus: true })),
        );
        setUnreadCount(0);
        toast({
          title: "Done",
          description: "All notifications marked as read",
        });
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const response = (await api.deleteNotification(notificationId)) as any;
      if (response.success) {
        const deletedNotif = notifications.find(
          (n) => n._id === notificationId,
        );
        setNotifications((prev) =>
          prev.filter((n) => n._id !== notificationId),
        );
        if (deletedNotif && !deletedNotif.readStatus) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        toast({
          title: "Deleted",
          description: "Notification removed",
        });
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-96 z-50"
          >
            <Card className="shadow-xl">
              <div className="max-h-96 overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-xs"
                    >
                      <CheckCheck className="w-4 h-4 mr-1" />
                      Mark all as read
                    </Button>
                  )}
                </div>

                {/* Notifications List */}
                {isLoading ? (
                  <div className="p-8 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notification) => {
                      const TypeIcon =
                        notificationTypeIcons[notification.type] || AlertCircle;
                      const colorClass =
                        notificationTypeColors[notification.type] ||
                        "bg-gray-100 text-gray-700";

                      return (
                        <motion.div
                          key={notification._id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`p-4 transition-colors ${
                            !notification.readStatus
                              ? "bg-primary/5 hover:bg-primary/10"
                              : "hover:bg-secondary"
                          }`}
                        >
                          <div className="flex gap-3">
                            {/* Icon */}
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}
                            >
                              <TypeIcon className="w-4 h-4" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!notification.readStatus && (
                                <button
                                  onClick={() =>
                                    handleMarkAsRead(notification._id)
                                  }
                                  className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                                  title="Mark as read"
                                >
                                  <CheckCheck className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  handleDeleteNotification(notification._id)
                                }
                                className="p-1 rounded hover:bg-background text-muted-foreground hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
