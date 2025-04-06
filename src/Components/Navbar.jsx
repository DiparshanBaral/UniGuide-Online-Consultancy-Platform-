"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAtom } from "jotai"
import { sessionAtom } from "@/atoms/session"
import { Bell, GraduationCap, LogOut, Menu, MessageSquare, Search, Settings, User} from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import API from "@/api"

export default function Navbar() {
  const [session, setSession] = useAtom(sessionAtom)
  const [isFetchingUser, setIsFetchingUser] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New mentor available in Computer Science", read: false },
    { id: 2, text: "Your application to Harvard was viewed", read: false },
    { id: 3, text: "New discussion in 'US Visa Requirements'", read: true },
  ])
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem("session")
    if (savedSession) {
      setSession(JSON.parse(savedSession))
    }
    setIsFetchingUser(false)
  }, [setSession])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchUserData = async (userId, token, role) => {
    try {
      setIsFetchingUser(true)
      const endpoint = role === "mentor" ? `/mentor/${userId}` : `/student/${userId}`
      const response = await API.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setSession((prevSession) => {
        if (JSON.stringify(prevSession) !== JSON.stringify(response.data)) {
          return response.data
        }
        return prevSession
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast.error(
        "Failed to fetch user data. Please try again."
      )
    } finally {
      setIsFetchingUser(false)
    }
  }

  // Fetch user data when session changes
  useEffect(() => {
    if (session && session._id && session.token) {
      fetchUserData(session._id, session.token, session.role)
    } else {
      setIsFetchingUser(false)
    }
  }, [session])

  const handleLogout = () => {
    setSession(null)
    localStorage.removeItem("session")
    toast.success("Logged out successfully")
    navigate("/login")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
    }
  }

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    toast.success("All notifications marked as read")
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (isFetchingUser) {
    return (
      <div className="fixed top-0 left-0 w-full h-16 bg-background/80 backdrop-blur-lg z-50 flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="h-2 w-2 bg-primary rounded-full"></div>
          <div className="h-2 w-2 bg-primary rounded-full"></div>
          <div className="h-2 w-2 bg-primary rounded-full"></div>
        </div>
      </div>
    )
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Universities", href: "/universities" },
    { name: "Discussion Rooms", href: "/discussionrooms" },
    { name: "Visa Section", href: "/visasection" },
    { name: "About Us", href: "/aboutus" },
  ]

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-lg shadow-md" 
          : "bg-white/60 backdrop-blur-md"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold ">
                UniGuide
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
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
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSearch(!showSearch)}
              className="relative"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Search Overlay */}
            {showSearch && (
              <div 
                ref={searchRef}
                className="absolute top-16 left-0 right-0 bg-background shadow-lg p-4 border-t z-50"
              >
                <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
                  <Input
                    type="search"
                    placeholder="Search universities, courses, mentors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button type="submit">Search</Button>
                </form>
              </div>
            )}

            {/* Notifications */}
            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={markAllNotificationsAsRead}
                        className="text-xs h-7"
                      >
                        Mark all as read
                      </Button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                        <div className="flex w-full">
                          <span className={cn(
                            "text-sm flex-1", 
                            !notification.read && "font-medium"
                          )}>
                            {notification.text}
                          </span>
                          {!notification.read && (
                            <span className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-1.5"></span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">2 hours ago</span>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center">
                    <Link to="/notifications" className="text-sm text-primary">View all notifications</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User Menu */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.profilePic || "/placeholder.svg?height=32&width=32"} alt={session?.firstname} />
                      <AvatarFallback>{session?.firstname?.charAt(0)}{session?.lastname?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session?.firstname} {session?.lastname}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <Link to={session?.role === "mentor" ? "/mentorprofilepersonal" : "/profile"}>
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <Link to={session?.role === "mentor" ? "/mentordashboard" : "/studentdashboard"}>
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/login">Log in</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="px-2 py-1 text-lg hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {session && (
                    <>
                      <div className="h-px bg-border my-2" />
                      <Link
                        href={session?.role === "mentor" ? "/mentorprofilepersonal" : "/profile"}
                        className="px-2 py-1 text-lg hover:text-primary transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        href={session?.role === "mentor" ? "/mentordashboard" : "/studentdashboard"}
                        className="px-2 py-1 text-lg hover:text-primary transition-colors"
                      >
                        Dashboard
                      </Link>
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
  )
}
