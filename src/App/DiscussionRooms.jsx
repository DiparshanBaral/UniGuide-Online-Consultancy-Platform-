"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, Plus, TrendingUp, Award } from "lucide-react"
import { CreateRoom } from "@/components/create-room"

export default function DiscussionRooms() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateRoom, setShowCreateRoom] = useState(false)

  const categories = [
    { id: "general", name: "General" },
    { id: "joined", name: "Joined Rooms" },
    { id: "your", name: "Your Rooms" },
  ]

  const rooms = [
    {
      title: "IELTS Preparation",
      description: "Strategies, practice tests, and tips for achieving your target IELTS score.",
      participants: 12,
      category: "general",
      activity: "high",
      tags: ["English", "Exams", "International"],
      joined: false,
      owner: false,
    },
    {
      title: "University Applications",
      description: "Get help with your university applications, personal statements, and interviews.",
      participants: 8,
      category: "general",
      activity: "medium",
      tags: ["Applications", "Admissions", "Essays"],
      joined: true,
      owner: false,
    },
    {
      title: "Scholarship Discussions",
      description: "Find and discuss scholarship opportunities worldwide.",
      participants: 10,
      category: "general",
      activity: "medium",
      tags: ["Funding", "Financial Aid", "Opportunities"],
      joined: true,
      owner: false,
    },
    {
      title: "Career Guidance",
      description: "Career planning, job search strategies, and professional development advice.",
      participants: 6,
      category: "general",
      activity: "low",
      tags: ["Jobs", "Internships", "Networking"],
      joined: false,
      owner: false,
    },
    {
      title: "Subject-Specific Rooms",
      description: "Dive deep into specific academic subjects with peers and experts.",
      participants: 15,
      category: "general",
      activity: "high",
      tags: ["Mathematics", "Sciences", "Humanities"],
      joined: false,
      owner: true,
    },
    {
      title: "General Discussion",
      description: "Open forum for all education-related topics and casual conversations.",
      participants: 20,
      category: "general",
      activity: "high",
      tags: ["Community", "Casual", "Networking"],
      joined: false,
      owner: true,
    },
  ]

  const filteredRooms = rooms.filter(
    (room) =>
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getActivityColor = (activity) => {
    switch (activity) {
      case "high":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const handleCreateRoom = (roomData) => {
    console.log("Room created:", roomData)
    setShowCreateRoom(false)
    // Here you would typically add the new room to your rooms array
  }

  return (
    <div className="mt-[30px] min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      {/* Hero Section with Search */}
      <div className="relative bg-primary text-primary-foreground py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="md:max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Discussion Rooms</h1>
              <p className="text-lg opacity-90 mb-6">
                Connect with peers, mentors, and experts in our vibrant discussion rooms. Share ideas, collaborate, and
                grow together.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => setShowCreateRoom(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Room
                </Button>
                <Button variant="secondary" size="lg">
                  <TrendingUp className="mr-2 h-4 w-4" /> Trending Rooms
                </Button>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Input
                  placeholder="Search rooms..."
                  className="bg-primary-foreground/10 border-primary-foreground/20 placeholder:text-primary-foreground/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Rooms Grid with Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-auto mb-6">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="general" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room, index) => (
                <Card
                  key={index}
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/20"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{room.title}</CardTitle>
                      <div
                        className={`w-3 h-3 rounded-full ${getActivityColor(room.activity)}`}
                        title={`${room.activity} activity`}
                      ></div>
                    </div>
                    <CardDescription>{room.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        <span>{room.participants} participants</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Join Room
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="joined" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms
                .filter((room) => room.joined)
                .map((room, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/20"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{room.title}</CardTitle>
                        <div
                          className={`w-3 h-3 rounded-full ${getActivityColor(room.activity)}`}
                          title={`${room.activity} activity`}
                        ></div>
                      </div>
                      <CardDescription>{room.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          <span>{room.participants} participants</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Enter Room
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="your" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms
                .filter((room) => room.owner)
                .map((room, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/20"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{room.title}</CardTitle>
                        <div
                          className={`w-3 h-3 rounded-full ${getActivityColor(room.activity)}`}
                          title={`${room.activity} activity`}
                        ></div>
                      </div>
                      <CardDescription>{room.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          <span>{room.participants} participants</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Manage Room
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Benefits Section */}
        <section className="mt-20 bg-slate-100 rounded-xl p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-center mb-8">Why Join Discussion Rooms?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect with Peers</h3>
              <p className="text-muted-foreground">
                Build relationships with like-minded students and professionals from around the world.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Exchange Knowledge</h3>
              <p className="text-muted-foreground">
                Share your expertise and learn from others in collaborative discussion environments.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Grow Together</h3>
              <p className="text-muted-foreground">
                Accelerate your personal and professional growth through community support and feedback.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Create Room Dialog */}
      {showCreateRoom && <CreateRoom onClose={() => setShowCreateRoom(false)} onSubmit={handleCreateRoom} />}
    </div>
  )
}

