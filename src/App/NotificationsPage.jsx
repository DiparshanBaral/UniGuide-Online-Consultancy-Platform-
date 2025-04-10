'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAtom } from 'jotai';
import { sessionAtom } from '@/atoms/session';
import { Bell, Trash2, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import API from '../api';

export default function NotificationsPage() {
  const [session] = useAtom(sessionAtom);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || !session._id) {
      navigate('/login');
      return;
    }

    // Check if we have cached notifications from the navbar
    const cachedNotifications = sessionStorage.getItem('cachedNotifications');
    if (cachedNotifications) {
      setNotifications(JSON.parse(cachedNotifications));
      setIsLoading(false);
      // Clear the cache after using it
      sessionStorage.removeItem('cachedNotifications');
    }

    // Still fetch from API to ensure we have the latest data
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const fetchNotifications = async () => {
    if (!session || !session._id || !session.token) return;

    try {
      setIsLoading(true);
      // Make sure we're using the correct endpoint format
      const response = await API.get(`/notifications/${session._id}`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      console.log('Notifications response:', response.data);

      if (response.data && response.data.notifications) {
        setNotifications(response.data.notifications);
      } else {
        console.error('Invalid notification response format:', response.data);
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId, e) => {
    e.stopPropagation();

    // Fetch session from localStorage as a fallback
    const savedSession = localStorage.getItem('session');
    const parsedSession = savedSession ? JSON.parse(savedSession) : null;

    const token = session?.token || parsedSession?.token; // Use session state or fallback to localStorage

    if (!token) {
      toast.error('You need to be logged in to mark notifications as read.');
      return;
    }

    try {
      const response = await API.put(
        `/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Mark as read response:', response);

      if (response.status === 200) {
        // Update local state
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n)),
        );
        toast.success('Notification marked as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllNotificationsAsRead = async () => {
    // Fetch session from localStorage as a fallback
    const savedSession = localStorage.getItem('session');
    const parsedSession = savedSession ? JSON.parse(savedSession) : null;

    const token = session?.token || parsedSession?.token; // Use session state or fallback to localStorage

    if (!token) {
      toast.error('You need to be logged in to mark notifications as read.');
      return;
    }

    try {
      const response = await API.put(
        `/notifications/${session?._id || parsedSession?._id}/readall`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Mark all as read response:', response);

      if (response.status === 200) {
        // Update local state
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const deleteNotification = async (notificationId, e) => {
    e.stopPropagation();

    if (!session || !session.token) return;

    try {
      await API.delete(`/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      // Update local state
      setNotifications(notifications.filter((n) => n._id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        const response = await API.put(
          `/notifications/${notification._id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          },
        );

        if (response.status === 200) {
          // Update local state
          setNotifications((prev) =>
            prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n)),
          );
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate to the link if provided
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    if (activeTab === 'read') return notification.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Notifications</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Your Notifications</CardTitle>
            <CardDescription className="text-base">
              Stay updated with the latest information
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllNotificationsAsRead}
                className="h-9 text-sm"
              >
                Mark all as read
              </Button>
            )}
            <Badge variant="secondary" className="ml-2 text-sm px-3 py-1">
              {unreadCount} unread
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="text-base px-6 py-2">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-base px-6 py-2">
                Unread
              </TabsTrigger>
              <TabsTrigger value="read" className="text-base px-6 py-2">
                Read
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={cn(
                        'flex items-start space-x-4 p-4 border rounded-lg transition-colors',
                        !notification.isRead ? 'bg-accent/20' : 'hover:bg-accent/10',
                        notification.link && 'cursor-pointer',
                      )}
                      onClick={() => notification.link && handleNotificationClick(notification)}
                    >
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bell className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={cn('text-lg', !notification.isRead && 'font-medium')}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="h-3 w-3 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-base text-muted-foreground">
                          {notification.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 px-3 text-sm"
                                onClick={(e) => markNotificationAsRead(notification._id, e)}
                              >
                                Mark as read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={(e) => deleteNotification(notification._id, e)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium">No notifications</h3>
                  <p className="text-lg text-muted-foreground">
                    {activeTab === 'all'
                      ? "You don't have any notifications yet"
                      : activeTab === 'unread'
                      ? "You don't have any unread notifications"
                      : "You don't have any read notifications"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
