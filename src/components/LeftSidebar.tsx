
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginApi } from "@/services/loginApi";
import { 
  Home,
  TrendingUp,
  Building,
  RefreshCw,
  FolderOpen,
  Activity,
  Target,
  Settings,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut
} from "lucide-react";
import { useState } from "react";

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const navigationItems = [
  { icon: Home, label: "Dashboards", hasSubmenu: false, link: "/dashboard" },
  { icon: TrendingUp, label: "Investment Pipeline", hasSubmenu: false },
  { icon: Building, label: "Accounts & Asset", hasSubmenu: true, routes: ["/investment-accounts", "/bank-accounts", "/illiquid-investments", "/liabilities"] },
  { icon: RefreshCw, label: "All Transactions", hasSubmenu: false, link: "/all-transactions" },
  { icon: FolderOpen, label: "Document Vault", hasSubmenu: true },
  { icon: Activity, label: "Activity", hasSubmenu: true, routes: ["/activity"] },
  { icon: Target, label: "Investment Targets", hasSubmenu: false },
  { icon: Settings, label: "Settings", hasSubmenu: true, routes: ["/integration-settings", "/account-settings", "/personal-settings"] },
];

const submenuItems = {
  "Accounts & Asset": [
    { label: "Investment Accounts", link: "/investment-accounts" },
    { label: "Bank Accounts", link: "/bank-accounts" },
    { label: "Illiquid Accounts", link: "/illiquid-investments" },
    { label: "Liabilities", link: "/liabilities" },
  ],
  "Activity": [
    { label: "To Do", link: "/activity/todo" },
    { label: "Email", link: "/activity/email" },
    { label: "Meetings", link: "/activity/meetings" },
    { label: "Notes", link: "/activity/notes" },
    { label: "Activity Stream", link: "/activity/stream" },
  ],
  "Settings": [
    { label: "Integration Settings", link: "/integration-settings" },
    { label: "Account Settings", link: "/account-settings" },
    { label: "Personal Settings", link: "/personal-settings" },
  ],
  "Document Vault": [
    { label: "Financial Documents", link: "/document-vault" },
    { label: "Legal Documents", link: "/404" },
  ],
};

export function LeftSidebar({ isOpen, onClose, onOpen }: LeftSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  // Determine which item should be active based on current path
  const getActiveItem = () => {
    return navigationItems.find(item => {
      if (item.link && currentPath === item.link) return true;
      if (item.routes && item.routes.some(route => currentPath.startsWith(route))) return true;
      return false;
    });
  };

  const activeItem = getActiveItem();
  const [expandedItems, setExpandedItems] = useState<string[]>(
    activeItem?.hasSubmenu ? [activeItem.label] : []
  );

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isItemActive = (item: typeof navigationItems[0]) => {
    if (item.link && currentPath === item.link) return true;
    if (item.routes && item.routes.some(route => currentPath.startsWith(route))) return true;
    return false;
  };

  const handleLogout = () => {
    loginApi.clearTokens();
    navigate('/login');
  };

  if (isOpen) {
    return (
      <>
        {/* Overlay for mobile */}
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onClose}
        />
        
        {/* Full Sidebar with Labels */}
        <div className="fixed left-0 top-16 bottom-0 w-64 bg-sidebar-bg border-r border-sidebar-border z-50 overflow-y-auto shadow-lg">
          <div className="p-4">
            <nav className="space-y-1">
              {/* Close sidebar button */}
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-normal hover:bg-sidebar-hover mb-2"
                onClick={onClose}
              >
                <PanelLeftClose className="h-4 w-4 mr-3" />
                <span className="flex-1">Close Sidebar</span>
              </Button>
              
              {navigationItems.map((item) => (
                <div key={item.label}>
                  {item.link ? (
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left font-normal ${
                        isItemActive(item)
                          ? 'bg-black text-white hover:bg-black' 
                          : 'hover:bg-black hover:text-white'
                      }`}
                      asChild
                    >
                      <Link to={item.link}>
                        <item.icon className="h-4 w-4 mr-3" />
                        <span className="flex-1">{item.label}</span>
                        {item.hasSubmenu && (
                          <ChevronRight 
                            className={`h-4 w-4 transition-transform ${
                              expandedItems.includes(item.label) ? 'rotate-90' : ''
                            }`} 
                          />
                        )}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left font-normal ${
                        isItemActive(item)
                          ? 'bg-black text-white hover:bg-black' 
                          : 'hover:bg-black hover:text-white'
                      }`}
                      onClick={() => {
                        if (item.hasSubmenu) {
                          toggleExpanded(item.label);
                        }
                      }}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      <span className="flex-1">{item.label}</span>
                      {item.hasSubmenu && (
                        <ChevronRight 
                          className={`h-4 w-4 transition-transform ${
                            expandedItems.includes(item.label) ? 'rotate-90' : ''
                          }`} 
                        />
                      )}
                    </Button>
                  )}
                  
                  {item.hasSubmenu && expandedItems.includes(item.label) && submenuItems[item.label as keyof typeof submenuItems] && (
                    <div className="ml-7 mt-1 space-y-1">
                      {submenuItems[item.label as keyof typeof submenuItems].map((subItem) => (
                        <Button
                          key={subItem.label}
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start text-sm ${
                            currentPath === subItem.link || currentPath.startsWith(subItem.link)
                              ? 'bg-gray-100 text-black font-medium'
                              : 'text-muted-foreground hover:bg-sidebar-hover'
                          }`}
                          asChild
                        >
                          <Link to={subItem.link}>
                            {subItem.label}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            
            {/* Logout button at bottom */}
            <div className="absolute bottom-4 left-4 right-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-normal hover:bg-black hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                <span className="flex-1">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Mini Icon Bar - Only visible when sidebar is closed
  return (
    <div className="fixed left-0 top-16 bottom-0 w-14 bg-sidebar-bg border-r border-sidebar-border z-40">
      <div className="p-2">
        <nav className="space-y-1">
          {/* Open sidebar button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 p-0 hover:bg-sidebar-hover mb-1"
            onClick={onOpen}
            title="Open Sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
          
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              size="sm"
              className={`w-10 h-10 p-0 ${
                isItemActive(item)
                  ? 'bg-black text-white hover:bg-black' 
                  : 'hover:bg-black hover:text-white'
              }`}
              title={item.label}
            >
              <item.icon className="h-4 w-4" />
            </Button>
          ))}
        </nav>
        
        {/* Logout button at bottom */}
        <div className="absolute bottom-2 left-2 right-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 p-0 hover:bg-black hover:text-white"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
