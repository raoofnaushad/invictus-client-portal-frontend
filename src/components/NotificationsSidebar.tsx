
import { Bell, X, Settings, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
}

interface NotificationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Document Processed",
    message: "Your financial statement has been successfully processed and is ready for review.",
    time: "2 minutes ago",
    type: "success",
    read: false
  },
  {
    id: "2",
    title: "Approval Required",
    message: "Transaction verification pending approval for account ending in 1234.",
    time: "15 minutes ago",
    type: "warning",
    read: false
  },
  {
    id: "3",
    title: "System Update",
    message: "New features have been added to the investment accounts dashboard.",
    time: "1 hour ago",
    type: "info",
    read: true
  },
  {
    id: "4",
    title: "Error in Processing",
    message: "Failed to process document upload. Please try again.",
    time: "2 hours ago",
    type: "error",
    read: false
  },
  {
    id: "5",
    title: "Monthly Report Ready",
    message: "Your monthly portfolio report is now available for download.",
    time: "1 day ago",
    type: "success",
    read: true
  }
];

export function NotificationsSidebar({ isOpen, onClose, onOpen }: NotificationsSidebarProps) {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed right-4 top-20 z-40">
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpen}
          className="relative bg-white shadow-md hover:shadow-lg border"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white border-l border-gray-200 flex flex-col z-40 shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {mockNotifications.map((notification, index) => (
            <div key={notification.id}>
              <div className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-start space-x-3">
                  <span className="text-lg mt-1">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
              {index < mockNotifications.length - 1 && (
                <Separator className="my-2" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button variant="outline" className="w-full" size="sm">
          Mark All as Read
        </Button>
      </div>
    </div>
  );
}
