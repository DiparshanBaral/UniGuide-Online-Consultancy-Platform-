import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAtom } from 'jotai';
import { sessionAtom } from '@/atoms/session';
import { Bell, GraduationCap, LogOut, Menu, User, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import logo from '@/assets/UniGuide_logo.png';
import API from '../api';

export default function Navbar() {
  const [session, setSession] = useAtom(sessionAtom);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      setSession(parsedSession);
    }
    setIsFetchingUser(false);
  }, [setSession]);

  const fetchUserData = async (userId, token, role) => {
    try {
      setIsFetchingUser(true);
      const endpoint = role === 'mentor' ? `/mentor/${userId}` : `/student/${userId}`;
      const response = await API.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSession((prevSession) => {
        if (JSON.stringify(prevSession) !== JSON.stringify(response.data)) {
          return response.data;
        }
        return prevSession;
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data. Please try again.');
    } finally {
      setIsFetchingUser(false);
    }
  };

  const fetchNotifications = async () => {
    if (!session || !session._id || !session.token) return;

    try {
      setIsLoadingNotifications(true);
      const response = await API.get(`/notifications/${session._id}`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (response.data && response.data.notifications) {
        setNotifications(response.data.notifications);
        const unread = response.data.notifications.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } else {
        console.error('Invalid notification response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const markAllNotificationsAsRead = async (e) => {
    // Prevent default behavior and stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Fetch session from localStorage as a fallback
    const savedSession = localStorage.getItem('session');
    const parsedSession = savedSession ? JSON.parse(savedSession) : null;

    const token = session?.token || parsedSession?.token; // Use session state or fallback to localStorage

    if (!token) {
      toast.error('You need to be logged in to mark notifications as read.');
      return;
    }

    try {
      // Optimistically update the local state to mark all notifications as read
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);

      // Make the API call to mark all notifications as read
      const response = await API.put(
        `/notifications/${session?._id || parsedSession?._id}/readall`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        toast.success('All notifications marked as read.');
      } else {
        // If the API call fails, revert the local state
        fetchNotifications();
        toast.error('Failed to mark all notifications as read.');
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      // Revert the local state by re-fetching notifications
      fetchNotifications();
      toast.error('Failed to mark notifications as read. Please try again.');
    }
  };

  const handleNotificationClick = async (notification, e) => {
    e.preventDefault();
    e.stopPropagation();

    // Close the dropdown
    setNotificationOpen(false);

    // Mark as read if not already read
    if (!notification.isRead) {
      try {
        await API.put(
          `/notifications/${notification._id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          },
        );

        // Update local state after successful API call
        setNotifications(
          notifications.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate to the link if provided
    if (notification.link) {
      navigate(notification.link);
    }
  };

  // Fetch user data when session changes
  useEffect(() => {
    if (session && session._id && session.token) {
      fetchUserData(session._id, session.token, session.role);
    } else {
      setIsFetchingUser(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (session && session._id) {
      fetchNotifications();

      // Set up polling for new notifications every 30 seconds
      const intervalId = setInterval(fetchNotifications, 30000);

      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleLogout = (e) => {
    e.preventDefault();
    setUserMenuOpen(false);
    setSession(null);
    localStorage.removeItem('session');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleProfileClick = (e, path) => {
    e.preventDefault();
    setUserMenuOpen(false);
    navigate(path);
  };

  const handleMobileNavClick = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleViewAllNotifications = (e) => {
    e.preventDefault();
    setNotificationOpen(false);

    // Store notifications in sessionStorage to access them immediately on the notifications page
    sessionStorage.setItem('cachedNotifications', JSON.stringify(notifications));

    navigate('/notifications');
  };

  if (isFetchingUser) {
    return (
      <div className="fixed top-0 left-0 w-full h-16 bg-background/80 backdrop-blur-lg z-50 flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <div className="h-3 w-3 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Universities', href: '/universities' },
    { name: 'Discussion Rooms', href: '/discussionrooms' },
    { name: 'Visa Section', href: '/visasection' },
    { name: 'About Us', href: '/aboutus' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-19',
        isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-md' : 'bg-white/60 backdrop-blur-md',
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logo} alt="UniGuide Logo" className="h-14 w-14" />
              <span className="text-xl font-bold ">UniGuide</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            {session && (
              <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative transition-all hover:bg-accent/80 h-10 w-10"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex justify-between items-center">
                    <span className="text-base">Notifications</span>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAllNotificationsAsRead(e);
                        }}
                      >
                        Mark all as read
                      </Button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {isLoadingNotifications ? (
                    <div className="p-4 flex justify-center">
                      <div className="animate-pulse flex space-x-2">
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                      </div>
                    </div>
                  ) : notifications.length > 0 ? (
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.map((notification) => (
                        <DropdownMenuItem
                          key={notification._id}
                          className="flex flex-col items-start p-3 cursor-pointer hover:bg-accent"
                          onSelect={(e) => handleNotificationClick(notification, e)}
                        >
                          <div className="flex w-full">
                            <span
                              className={cn(
                                'text-sm flex-1',
                                !notification.isRead && 'font-medium',
                              )}
                            >
                              {notification.title}
                            </span>
                            {!notification.isRead && (
                              <span className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-1.5"></span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.description}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">No notifications</div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="justify-center"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleViewAllNotifications(e);
                    }}
                  >
                    <span className="text-sm text-primary">View all notifications</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User Menu */}
            {session ? (
              <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={session?.profilePic || '/placeholder.svg?height=40&width=40'}
                        alt={session?.firstname}
                      />
                      <AvatarFallback className="text-base">
                        {session?.firstname?.charAt(0)}
                        {session?.lastname?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session?.firstname} {session?.lastname}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{session?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onSelect={(e) =>
                        handleProfileClick(
                          e,
                          session?.role === 'mentor' ? '/mentorprofilepersonal' : '/profile',
                        )
                      }
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span className="text-sm">Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) =>
                        handleProfileClick(
                          e,
                          session?.role === 'mentor' ? '/mentordashboard' : '/studentdashboard',
                        )
                      }
                    >
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <span className="text-sm">Dashboard</span>
                    </DropdownMenuItem>
                    {session && session.role === 'mentor' && (
                      <DropdownMenuItem asChild>
                        <Link to="/payments" className="cursor-pointer w-full">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Payment</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="text-sm">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="h-9 px-4 text-sm">
                <Link to="/login">Log in</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="text-xl">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleMobileNavClick(item.href)}
                      className="px-2 py-1 text-lg text-left hover:text-primary transition-colors"
                    >
                      {item.name}
                    </button>
                  ))}
                  {session && (
                    <>
                      <div className="h-px bg-border my-2" />
                      <button
                        onClick={() =>
                          handleMobileNavClick(
                            session?.role === 'mentor' ? '/mentorprofilepersonal' : '/profile',
                          )
                        }
                        className="px-2 py-1 text-lg text-left hover:text-primary transition-colors"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() =>
                          handleMobileNavClick(
                            session?.role === 'mentor' ? '/mentordashboard' : '/studentdashboard',
                          )
                        }
                        className="px-2 py-1 text-lg text-left hover:text-primary transition-colors"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-2 py-1 text-lg text-left hover:text-primary transition-colors"
                      >
                        Log out
                      </button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
