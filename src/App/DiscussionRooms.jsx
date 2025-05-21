"use client"

import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useAtom } from "jotai"
import { sessionAtom } from "@/atoms/session"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Users, MessageSquare, Plus, Search, Filter, Sparkles } from "lucide-react"
import { CreateRoom } from "@/Components/create-room"
import API from "../api"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

// Room Card Component with prop validation
const RoomCard = ({ room, buttonText, buttonAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-200 hover:border-primary/20 bg-white h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-semibold">{room.title}</CardTitle>
          </div>
          <CardDescription className="text-gray-600 mt-1.5">{room.description}</CardDescription>
        </CardHeader>

        <CardContent className="pb-3">
          <motion.div
            className="flex flex-wrap gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {room.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                {tag}
              </Badge>
            ))}
          </motion.div>
          <div className="flex items-center text-sm text-gray-500">
            <div className="flex items-center">
              <Users className="mr-1.5 h-4 w-4" />
              <span>{room.participants} participants</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full gap-1.5" onClick={buttonAction}>
              <MessageSquare className="h-4 w-4" />
              {buttonText}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Prop validation for RoomCard
RoomCard.propTypes = {
  room: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    participants: PropTypes.number.isRequired,
  }).isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonAction: PropTypes.func.isRequired,
}

// Empty State Component with prop validation
const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <Icon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
      </motion.div>
      <motion.h3
        className="text-lg font-medium mb-2"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h3>
      <motion.p
        className="text-gray-500 mb-6"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {description}
      </motion.p>
      {actionText && onAction && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={onAction}>{actionText}</Button>
        </motion.div>
      )}
    </motion.div>
  )
}

// Prop validation for EmptyState
EmptyState.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
}

export default function DiscussionRooms() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [rooms, setRooms] = useState([]) // State to store fetched rooms
  const [joinedRooms, setJoinedRooms] = useState([]) // State to store joined rooms
  const [loading, setLoading] = useState(true) // Loading state for API call
  const [session] = useAtom(sessionAtom) // Use Jotai's sessionAtom instead of local state
  const navigate = useNavigate()

  // Fetch all rooms from the backend API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await API.get("/discussion/rooms") // Replace with your API endpoint
        if (!response.data.success) {
          throw new Error("Failed to fetch rooms")
        }
        setRooms(response.data.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching rooms:", error)
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  // Fetch joined rooms for the logged-in user
  useEffect(() => {
    const fetchJoinedRooms = async () => {
      try {
        // Still keep this check for safety
        if (!session || !session._id) {
          console.log("Session not loaded yet, skipping joined rooms fetch")
          return
        }

        const response = await API.get(`/discussion/joined?userId=${session._id}`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        })

        // Process response...
        if (response.data.success) {
          setJoinedRooms(response.data.data)
        }
      } catch (error) {
        console.error("Error fetching joined rooms:", error)
      }
    }

    fetchJoinedRooms()
  }, [session]) // Keep session as dependency

  // Handle room creation
  const handleCreateRoom = async (roomData) => {
    try {
      const response = await API.post("/discussion/create", roomData, {
        headers: {
          Authorization: `Bearer ${session?.token}`, // Add token to headers
        },
      })
      if (!response.data.success) {
        throw new Error("Failed to create room")
      } else {
        toast.success("Room created successfully. Waiting for admin's approval!")
      }
      setShowCreateRoom(false) // Close the modal after successful creation
    } catch (error) {
      console.error("Error creating room:", error)
      alert("Failed to create room. Please try again.")
    }
  }

  // Handle joining a room
  const handleJoinRoom = async (roomId) => {
    try {
      const response = await API.post(
        `/discussion/${roomId}/join`,
        { userId: session?._id },
        {
          headers: {
            Authorization: `Bearer ${session?.token}`, // Add token to headers
          },
        },
      )
      if (!response.data.success) {
        throw new Error("Failed to join room")
      }

      // Show success toast notification
      toast.success("Successfully joined the room!", {
        description: "You are now part of this discussion room.",
        duration: 3000, // Duration in milliseconds
      })

      // Update the joinedRooms state
      setJoinedRooms((prev) => [...prev, response.data.data])
    } catch (error) {
      console.error("Error joining room:", error)
      alert("Failed to join room. Please try again.")
    }
  }

  // Filter rooms based on search query
  const filteredRooms = rooms.filter(
    (room) =>
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Define categories dynamically based on room data
  const categories = [
    { id: "general", name: "General" },
    { id: "joined", name: "Joined Rooms" },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="pt-[90px] px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header Section */}
        <motion.div className="mb-12" initial="hidden" animate="visible" variants={containerVariants}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20 rounded-full">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Connect & Collaborate
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Discussion Rooms</h1>
              <p className="text-gray-600 max-w-2xl">
                Connect with peers, mentors, and experts in our vibrant discussion rooms. Share ideas, collaborate, and
                grow together.
              </p>
            </motion.div>
            <motion.div
              className="w-full md:w-auto"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={() => setShowCreateRoom(true)} className="gap-1.5 w-full md:w-auto">
                <Plus className="h-4 w-4" /> Create Room
              </Button>
            </motion.div>
          </div>

          {/* Search Bar */}
          <motion.div className="relative max-w-md mb-8" variants={itemVariants}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search rooms by title, description or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-gray-200 focus:border-primary"
              />
            </div>
          </motion.div>

          {/* Room Categories Tabs */}
          <Tabs defaultValue="general" className="w-full">
            <motion.div className="border-b border-gray-200 mb-6" variants={itemVariants}>
              <TabsList className="bg-transparent h-auto p-0 mb-0">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </motion.div>

            {/* General Rooms Tab */}
            <TabsContent value="general" className="mt-0">
              {loading ? (
                <motion.div
                  className="flex justify-center items-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </motion.div>
              ) : filteredRooms.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredRooms.map((room, index) => (
                    <RoomCard
                      key={index}
                      room={room}
                      buttonText="Join Room"
                      buttonAction={() => handleJoinRoom(room._id)}
                    />
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  icon={Filter}
                  title="No rooms found"
                  description="Try adjusting your search or create a new room"
                  actionText="Create a Room"
                  onAction={() => setShowCreateRoom(true)}
                />
              )}
            </TabsContent>

            {/* Joined Rooms Tab */}
            <TabsContent value="joined" className="mt-0">
              {joinedRooms.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {joinedRooms.map((room, index) => (
                    <RoomCard
                      key={index}
                      room={room}
                      buttonText="Enter Room"
                      buttonAction={() => navigate(`/discussionroom/${room._id}`)}
                    />
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  icon={MessageSquare}
                  title="No joined rooms"
                  description="Join a room to start participating in discussions"
                  actionText="Browse Rooms"
                  onAction={() => document.querySelector('[data-value="general"]').click()}
                />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Benefits Section */}
        <motion.section
          className="mt-20 bg-white rounded-xl p-8 border border-gray-100 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-center mb-8">Why Join Discussion Rooms?</h2>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <BenefitCard
              icon={Users}
              title="Connect with Peers"
              description="Build relationships with like-minded students and professionals from around the world."
            />
            <BenefitCard
              icon={MessageSquare}
              title="Exchange Knowledge"
              description="Share your expertise and learn from others in collaborative discussion environments."
            />
            <BenefitCard
              icon={Sparkles}
              title="Grow Together"
              description="Accelerate your personal and professional growth through community support and feedback."
            />
          </motion.div>
        </motion.section>
      </div>

      {/* Create Room Dialog */}
      {showCreateRoom && <CreateRoom onClose={() => setShowCreateRoom(false)} onSubmit={handleCreateRoom} />}
    </div>
  )
}

// Benefit Card Component with prop validation
const BenefitCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 100 },
        },
      }}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
    >
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 h-full">
        <motion.div
          className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Icon className="h-6 w-6 text-primary" />
        </motion.div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  )
}

// Prop validation for BenefitCard
BenefitCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

// Prop validation for CreateRoom component
CreateRoom.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
