
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  User,
  ChevronRight,
  FileText,
  AlertCircle,
  CheckSquare,
  Activity,
  PanelRightClose,
  PanelRightOpen
} from "lucide-react";

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const todoItems = [
  {
    title: "Abingworth Capital Call Request",
    assignedTo: "Sam Spade",
    dueDate: "May 28, 2025",
    priority: "High"
  },
  {
    title: "KYC Request",
    assignedTo: "Sam Spade", 
    dueDate: "May 28, 2025",
    priority: "Medium"
  },
  {
    title: "Task Name - Lorem Ipsum",
    assignedTo: "Sam Spade",
    dueDate: "May 28, 2025", 
    priority: "Low"
  },
  {
    title: "Task Name - Lorem Ipsum",
    assignedTo: "Sam Spade",
    dueDate: "May 28, 2025",
    priority: "High"
  },
  {
    title: "Task Name - Lorem Ipsum", 
    assignedTo: "Sam Spade",
    dueDate: "May 28, 2025",
    priority: "Medium"
  },
  {
    title: "Task Name - Lorem Ipsum",
    assignedTo: "Sam Spade", 
    dueDate: "May 28, 2025",
    priority: "Low"
  }
];

const activityItems = [
  {
    type: "document",
    title: "Document processed",
    description: "Financial statement Q4 2024",
    time: "2 hours ago"
  },
  {
    type: "transaction", 
    title: "New transaction",
    description: "$300,000 transfer approved",
    time: "4 hours ago"
  },
  {
    type: "user",
    title: "User activity",
    description: "John Doe updated KYC documents", 
    time: "6 hours ago"
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function RightSidebar({ isOpen, onClose, onOpen }: RightSidebarProps) {
  if (isOpen) {
    return (
      <>
        {/* Overlay for mobile */}
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onClose}
        />
        
        {/* Full Sidebar */}
        <div className="fixed right-0 top-16 bottom-0 w-80 bg-sidebar-bg border-l border-sidebar-border z-50 overflow-y-auto shadow-lg">
          <div className="p-4 space-y-6">
            {/* Close sidebar button */}
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-sidebar-hover"
                onClick={onClose}
                title="Close Sidebar"
              >
                <PanelRightClose className="h-4 w-4 mr-2" />
                <span>Close Sidebar</span>
              </Button>
            </div>
            
            {/* To Do Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckSquare className="h-5 w-5 mr-2" />
                    To Do
                  </div>
                  <Badge variant="secondary" className="text-xs">6</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todoItems.map((item, index) => (
                  <div key={index} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-foreground leading-tight">
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {item.assignedTo}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {item.dueDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={`text-xs px-2 py-0.5 ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Activity Stream Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Activity Stream
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activityItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="mt-1">
                      {item.type === 'document' && <FileText className="h-4 w-4 text-blue-600" />}
                      {item.type === 'transaction' && <AlertCircle className="h-4 w-4 text-green-600" />}
                      {item.type === 'user' && <User className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Mini Icon Bar - Only visible when sidebar is closed
  return (
    <div className="fixed right-0 top-16 bottom-0 w-14 bg-sidebar-bg border-l border-sidebar-border z-40">
      <div className="p-2">
        <div className="space-y-2">
          {/* Open sidebar button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 p-0 hover:bg-sidebar-hover"
            onClick={onOpen}
            title="Open Sidebar"
          >
            <PanelRightOpen className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 p-0 hover:bg-sidebar-hover relative"
            title="To Do"
          >
            <CheckSquare className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs">
              6
            </Badge>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 p-0 hover:bg-sidebar-hover"
            title="Activity Stream"
          >
            <Activity className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
