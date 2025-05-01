import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { Book, User, Settings, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminMenuItem {
  label: string;
  icon: React.FC<{ className?: string }>;
  path: string;
}

const adminMenuItems: AdminMenuItem[] = [
  { label: 'Books', icon: Book, path: '/admin' },
  { label: 'Users', icon: User, path: '/admin/users' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <Sidebar className="bg-gradient-to-b from-library-primary to-library-secondary flex flex-col">
      <SidebarContent className="flex-1">
        <div className="p-4">
          <Link to="/" className="flex items-center mb-6">
            <Book className="h-6 w-6 text-white mr-2" />
            <span className="text-white font-bold text-xl">Admin Panel</span>
          </Link>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-white opacity-80">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className={
                    location.pathname === item.path 
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }>
                    <Link to={item.path} className="flex items-center py-2 px-3 rounded">
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="p-4 mt-auto border-t border-white/10">
        <Link to="/home" className="block">
          <Button 
            className="w-full bg-white hover:bg-white/90 text-library-primary font-medium flex items-center justify-center"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Main Site
          </Button>
        </Link>
      </div>
    </Sidebar>
  );
};

export default AdminSidebar;
