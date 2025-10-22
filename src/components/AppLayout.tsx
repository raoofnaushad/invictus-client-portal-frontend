
import { useState, ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { MainContent } from "./MainContent";

interface AppLayoutProps {
  children?: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen);
  };

  const closeLeftSidebar = () => {
    setLeftSidebarOpen(false);
  };

  const openLeftSidebar = () => {
    setLeftSidebarOpen(true);
  };

  const closeRightSidebar = () => {
    setRightSidebarOpen(false);
  };

  const openRightSidebar = () => {
    setRightSidebarOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <AppHeader 
        onLeftSidebarToggle={toggleLeftSidebar}
        onRightSidebarToggle={toggleRightSidebar}
      />

      {/* Main Content Area - Adjusts padding based on sidebar states */}
      <div className="relative">
        {children ? (
          <div className={`pt-16 transition-all duration-300 ${
            leftSidebarOpen ? 'pl-64' : 'pl-14'
          } ${
            rightSidebarOpen ? 'pr-64' : 'pr-14'
          } min-h-screen bg-background`}>
            {children}
          </div>
        ) : (
          <MainContent 
            leftSidebarOpen={leftSidebarOpen}
            rightSidebarOpen={rightSidebarOpen}
          />
        )}
      </div>

      {/* Left Sidebar - Overlays on top */}
      <LeftSidebar 
        isOpen={leftSidebarOpen}
        onClose={closeLeftSidebar}
        onOpen={openLeftSidebar}
      />

      {/* Right Sidebar - Overlays on top */}
      <RightSidebar 
        isOpen={rightSidebarOpen}
        onClose={closeRightSidebar}
        onOpen={openRightSidebar}
      />
    </div>
  );
}
