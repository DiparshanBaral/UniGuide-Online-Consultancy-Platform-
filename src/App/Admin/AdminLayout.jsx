import { useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'sonner';
import { Building2, Home, GraduationCap, MessageSquare, LogOut, Users } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/Components/ui/sidebar';
import { Button } from '@/Components/ui/button';
import logo from '@/assets/UniGuide_logo.PNG';

export default function AdminLayout() {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('session');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <img src={logo || '/placeholder.svg'} alt="UniGuide Logo" className="h-10 w-10" />
              <div className="flex flex-col">
                <span className="font-semibold text-lg">UniGuide</span>
                <span className="text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Home" onClick={() => navigate('/admin')}>
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2" />
                        <span>Home</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Universities"
                      onClick={() => navigate('/admin/universities')}
                    >
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        <span>Universities</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Mentor Affiliations"
                      onClick={() => navigate('/admin/affiliations')}
                    >
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        <span>Mentor Affiliations</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Discussion Rooms"
                      onClick={() => navigate('/admin/discussion-rooms')}
                    >
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span>Discussion Rooms</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Users"
                      onClick={() => navigate('/admin/users')}
                    >
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Users</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="px-3 py-2">
              <Button
                variant="outline"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
