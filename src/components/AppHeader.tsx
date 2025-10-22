
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Bell, 
  Settings,
  HelpCircle,
  Grid3X3
} from "lucide-react";

interface AppHeaderProps {
  onLeftSidebarToggle: () => void;
  onRightSidebarToggle: () => void;
}

export function AppHeader({ onLeftSidebarToggle, onRightSidebarToggle }: AppHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-header-bg border-b border-header-border">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/71b282dc-8d2e-4652-a7d5-8a027f928bee.png" 
              alt="Watar Partners Logo" 
              className="h-8 w-auto"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm">
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <Grid3X3 className="h-5 w-5" />
          </Button>
          
          <ThemeToggle />

          <div className="flex items-center space-x-2 ml-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-primary text-primary-foreground">AM</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Al Muharijo</span>
          </div>
        </div>
      </div>
    </header>
  );
}
