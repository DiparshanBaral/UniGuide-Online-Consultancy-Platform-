import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { io } from "socket.io-client"
import API from "../api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar"
import { MessageSquare, Video, Send, Loader2, VideoIcon, ExternalLink } from "lucide-react"
import { useCallContext } from "../contexts/CallContext"
import { motion, AnimatePresence } from "framer-motion"

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [session, setSession] = useState(null)
  const [socket, setSocket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [portalDetails, setPortalDetails] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState(null)

  const { portalid } = useParams()
  const chatContainerRef = useRef(null)
  const messagesRef = useRef(messages)
  const { client } = useCallContext()

  // Update the ref whenever `messages` changes
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem("session")
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession)
      setSession(parsedSession)
    }
  }, [])

  // Fetch portal details using the portalId
  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        const token = session?.token
        if (!portalid) {
          console.error("No portalId found in URL.")
          setLoading(false)
          return
        }

        const portalResponse = await API.get(`/portal/${portalid}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const portalData = portalResponse.data
        setPortalDetails(portalData)
      } catch (error) {
        console.error("Error fetching portal details:", error.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPortalData()
  }, [portalid, session])

  // Initialize Socket.IO connection and handle incoming messages
  useEffect(() => {
    if (!session || !portalDetails) return

    const { studentId, mentorId } = portalDetails

    let senderId, senderRole
    if (session.role === "student") {
      senderId = studentId._id
      senderRole = "Student"
    } else if (session.role === "mentor") {
      senderId = mentorId._id
      senderRole = "Mentor"
    }

    // Create a new socket instance
    // const socketInstance = io("http://localhost:5000", {
    const socketInstance = io("https://uni-guide-frontend-git-main-diparshanbarals-projects.vercel.app", {
      query: { userId: senderId, userRole: senderRole },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    // Set up event listeners on the new socket instance
    socketInstance.on("receiveMessage", (message) => {
      setMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg._id === message._id)) {
          return [...prevMessages, { ...message, message: message.content }]
        }
        return prevMessages
      })
    })

    socketInstance.on("userTyping", () => {
      setIsTyping(true)
      // Clear typing indicator after 3 seconds
      setTimeout(() => setIsTyping(false), 3000)
    })

    // Update socket state with the new instance
    setSocket(socketInstance)

    // Cleanup: disconnect socket when component unmounts or dependencies change
    return () => {
      socketInstance.disconnect()
    }
  }, [session, portalDetails]) // socket removed as dependency as we handle it properly now

  // Fetch chat history
  useEffect(() => {
    if (!session || !portalDetails) return

    const { studentId, mentorId } = portalDetails

    // Determine sender and receiver
    let senderId, senderRole, receiverId, receiverRole
    if (session.role === "student") {
      senderId = studentId._id
      senderRole = "Student"
      receiverId = mentorId._id
      receiverRole = "Mentor"
    } else if (session.role === "mentor") {
      senderId = mentorId._id
      senderRole = "Mentor"
      receiverId = studentId._id
      receiverRole = "Student"
    }

    // Fetch chat history
    const fetchChatHistory = async () => {
      try {
        const chatHistoryResponse = await API.get("/chat/history", {
          params: {
            userId: senderId,
            userRole: senderRole,
            otherUserId: receiverId,
            otherUserRole: receiverRole,
          },
        })
        setMessages(chatHistoryResponse.data.messages)
      } catch (error) {
        console.error("Error fetching chat history:", error.response?.data || error.message)
      }
    }

    fetchChatHistory()
  }, [session, portalDetails])

  // Scroll to the bottom of the chat container when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Function to send a new message
  const sendMessage = async (messageContent) => {
    const messageToSend = messageContent || newMessage
    if (!messageToSend.trim() || !session || !portalDetails) return

    const { studentId, mentorId } = portalDetails

    // Determine sender and receiver
    let senderId, senderRole, receiverId, receiverRole
    if (session.role === "student") {
      senderId = studentId._id
      senderRole = "Student"
      receiverId = mentorId._id
      receiverRole = "Mentor"
    } else if (session.role === "mentor") {
      senderId = mentorId._id
      senderRole = "Mentor"
      receiverId = studentId._id
      receiverRole = "Student"
    }

    try {
      // Emit the message via Socket.IO
      socket.emit("sendMessage", {
        receiverId,
        receiverRole,
        content: messageToSend,
      })

      // Update local state immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          _id: Date.now(),
          senderId,
          senderRole,
          message: messageToSend,
        },
      ])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message)
    }
  }

  // Function to start a video call
  const startVideoCall = async (recipientId) => {
    if (!client) {
      console.error("StreamVideoClient is not initialized")
      return
    }

    try {
      const newCall = client.call("default", `call-${Date.now()}`)
      await newCall.getOrCreate({
        data: {
          custom: {
            uniguideCall: true,
            participants: [session._id, recipientId],
          },
        },
      })

      // Send the call link to the chat
      const callUrl = `/call/${newCall.id}`
      sendMessage(`Join the call: ${window.location.origin}${callUrl}`)
    } catch (error) {
      console.error("Error starting video call:", error)
    }
  }

  // Handle typing indicator
  const handleTyping = () => {
    if (!socket) return

    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Emit typing event
    socket.emit("typing")

    // Set new timeout
    const timeout = setTimeout(() => {
      // Typing stopped
    }, 1000)
    setTypingTimeout(timeout)
  }

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {}
    messages.forEach((message) => {
      const date = new Date(message.createdAt || Date.now()).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    return groups
  }

  // If still loading, show a placeholder
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-lg font-medium text-gray-600">Loading chat...</p>
        </div>
      </div>
    )
  }

  // If no portal details are found, show a fallback message
  if (!portalDetails) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="text-center text-gray-500 max-w-md">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Chat Available</h3>
          <p>No chat available. Please connect with a mentor/student.</p>
        </div>
      </div>
    )
  }

  const groupedMessages = groupMessagesByDate(messages)
  const otherUser = session.role === "student" ? portalDetails.mentorId : portalDetails.studentId

  return (
    <>
      <div className="space-y-8">
        

        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage
                    src={otherUser.profilePic || "/placeholder-avatar.png"}
                    alt={`${otherUser.firstname} ${otherUser.lastname}`}
                  />
                  <AvatarFallback className="bg-primary/20 text-primary font-medium">
                    {otherUser.firstname?.[0]}
                    {otherUser.lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{`${otherUser.firstname} ${otherUser.lastname}`}</CardTitle>
                  <CardDescription className="text-xs">
                    {session.role === "student" ? "Mentor" : "Student"} 
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full hover:bg-primary/10 hover:text-primary"
                  onClick={() => {
                    if (portalDetails) {
                      const { studentId, mentorId } = portalDetails
                      const recipientId = session.role === "student" ? mentorId._id : studentId._id
                      startVideoCall(recipientId)
                    }
                  }}
                >
                  <Video className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="flex flex-col h-[600px]">
              {/* Chat Messages */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Messages Yet</h3>
                    <p className="text-gray-500 max-w-md">
                      Start the conversation with {session.role === "student" ? "your mentor" : "your student"}.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                      <div key={date} className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600">
                            {new Date(date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                        {dateMessages.map((msg, index) => {
                          const isCurrentUser = msg.senderId === session._id
                          const isCallLink = msg.message?.startsWith("Join the call:")
                          return (
                            <motion.div
                              key={msg._id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[80%]`}
                              >
                                {!isCurrentUser && (
                                  <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarImage
                                      src={otherUser.profilePic || "/placeholder-avatar.png"}
                                      alt={`${otherUser.firstname} ${otherUser.lastname}`}
                                    />
                                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                      {otherUser.firstname?.[0]}
                                      {otherUser.lastname?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div
                                  className={`px-4 py-3 rounded-lg ${
                                    isCurrentUser
                                      ? "bg-blue-500 text-white rounded-tr-none"
                                      : "bg-white border rounded-tl-none"
                                  } shadow-sm`}
                                >
                                  {isCallLink ? (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <VideoIcon
                                          className={`h-4 w-4 ${isCurrentUser ? "text-white" : "text-primary"}`}
                                        />
                                        <span className="font-medium">Video Call</span>
                                      </div>
                                      <a
                                        href={msg.message.replace("Join the call: ", "")}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-1 text-sm ${
                                          isCurrentUser
                                            ? "text-white/90 hover:text-white"
                                            : "text-primary hover:text-primary/90"
                                        }`}
                                      >
                                        <span>Join call</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </div>
                                  ) : (
                                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                  )}
                                  <div
                                    className={`text-xs mt-1 ${
                                      isCurrentUser ? "text-white/70 text-right" : "text-gray-500"
                                    }`}
                                  >
                                    {formatTime(msg.createdAt || Date.now())}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    ))}
                  </AnimatePresence>
                )}
                {isTyping && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={otherUser.profilePic || "/placeholder-avatar.png"}
                        alt={`${otherUser.firstname} ${otherUser.lastname}`}
                      />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {otherUser.firstname?.[0]}
                        {otherUser.lastname?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border rounded-lg px-4 py-3 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="flex items-center p-4 border-t border-gray-200 bg-white">
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value)
                    handleTyping()
                  }}
                  placeholder="Type a message..."
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button
                  type="button"
                  size="icon"
                  className="ml-2 rounded-full bg-primary hover:bg-primary/90"
                  onClick={() => sendMessage()}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default Chat
