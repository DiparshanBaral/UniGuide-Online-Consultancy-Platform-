"use client"

import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { toast } from "sonner"
import API from "../api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar"
import { ScrollArea } from "@/Components/ui/scroll-area"
import {
  Loader2,
  CheckCircle,
  XCircle,
  UserPlus,
  Users,
  GraduationCap,
  Mail,
  School,
  Calendar,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/Components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"

// Student Card Component
const StudentCard = ({ student }) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
        <AvatarImage
          src={student.profilePic || "/placeholder-avatar.png"}
          alt={`${student.firstname} ${student.lastname}`}
        />
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {student.firstname[0]}
          {student.lastname[0]}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{`${student.firstname} ${student.lastname}`}</p>
        <p className="text-sm text-muted-foreground">{student.email}</p>
      </div>
    </div>
  )
}

StudentCard.propTypes = {
  student: PropTypes.shape({
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    profilePic: PropTypes.string,
  }).isRequired,
}

// Connected Student Card Component
const ConnectedStudentCard = ({ connection }) => {
  return (
    <a href={`/mentorportal/${connection.portalId}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-0 bg-white dark:bg-gray-800 shadow-md h-full group-hover:transform group-hover:scale-[1.02]">
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-primary/10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-3 border-white shadow-md">
              <AvatarImage
                src={connection.studentId.profilePic || "/placeholder-avatar.png"}
                alt={`${connection.studentId.firstname} ${connection.studentId.lastname}`}
              />
              <AvatarFallback className="bg-primary/20 text-primary font-medium text-xl">
                {connection.studentId.firstname[0]}
                {connection.studentId.lastname[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {`${connection.studentId.firstname} ${connection.studentId.lastname}`}
              </CardTitle>
              <CardDescription className="text-sm flex items-center gap-1 mt-1">
                <Mail className="h-3.5 w-3.5" />
                {connection.studentId.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Major</span>
                <p className="font-medium">{connection.studentId.major || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <School className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm text-muted-foreground">University</span>
                <p className="font-medium">{connection.studentId.university || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Connected Since</span>
                <p className="font-medium">
                  {new Date(connection.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-5 flex justify-between items-center">
          <span className="font-medium text-primary">Access Portal</span>
          <ChevronRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
        </CardFooter>
      </Card>
    </a>
  )
}

ConnectedStudentCard.propTypes = {
  connection: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    portalId: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    studentId: PropTypes.shape({
      firstname: PropTypes.string.isRequired,
      lastname: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      profilePic: PropTypes.string,
      major: PropTypes.string,
      university: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

// Pending Request Card Component
const PendingRequestCard = ({ request, onUpdateStatus }) => {
  return (
    <Card className="overflow-hidden mb-6 border-0 shadow-md hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4 bg-gradient-to-r from-yellow-50 to-yellow-100/50">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white shadow-md">
            <AvatarImage
              src={request.studentId.profilePic || "/placeholder-avatar.png"}
              alt={`${request.studentId.firstname} ${request.studentId.lastname}`}
            />
            <AvatarFallback className="bg-primary/20 text-primary font-medium text-xl">
              {request.studentId.firstname[0]}
              {request.studentId.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{`${request.studentId.firstname} ${request.studentId.lastname}`}</CardTitle>
            <CardDescription className="text-sm flex items-center gap-1 mt-1">
              <Mail className="h-3.5 w-3.5" />
              {request.studentId.email}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Major</span>
              <p className="font-medium">{request.studentId.major || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <School className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">University</span>
              <p className="font-medium">{request.studentId.university || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Request Date</span>
              <p className="font-medium">
                {new Date(request.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-5 flex justify-between items-center gap-4">
        <Button size="lg" className="flex-1 gap-2 py-6" onClick={() => onUpdateStatus(request._id, "Approved")}>
          <CheckCircle className="h-5 w-5" /> Approve
        </Button>
        <Button
          size="lg"
          variant="destructive"
          className="flex-1 gap-2 py-6"
          onClick={() => onUpdateStatus(request._id, "Rejected")}
        >
          <XCircle className="h-5 w-5" /> Reject
        </Button>
      </CardFooter>
    </Card>
  )
}

PendingRequestCard.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    studentId: PropTypes.shape({
      firstname: PropTypes.string.isRequired,
      lastname: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      profilePic: PropTypes.string,
      major: PropTypes.string,
      university: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
}

// Stats Card Component
const StatsCard = ({ title, value, icon }) => {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className="p-3 rounded-full bg-primary/10 text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
}

// Main Dashboard Component
export default function MentorDashboard() {
  const [pendingRequests, setPendingRequests] = useState([])
  const [approvedConnections, setApprovedConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("connectedStudents")

  // Fetch data on component mount
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const session = JSON.parse(localStorage.getItem("session"))
        const mentorId = session._id

        // Fetch pending requests
        const pendingResponse = await API.get(`/connections/pendingrequests?mentorId=${mentorId}`, {
          headers: { Authorization: `Bearer ${session.token}` },
        })
        setPendingRequests(pendingResponse.data)

        // Fetch approved connections
        const approvedResponse = await API.get(`/connections/approvedconnections?mentorId=${mentorId}`, {
          headers: { Authorization: `Bearer ${session.token}` },
        })
        setApprovedConnections(approvedResponse.data)
      } catch (error) {
        console.log(error)
        toast.error("Failed to fetch connections. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchConnections()
  }, [])

  // Approve or reject a connection request
  const handleUpdateStatus = async (id, status) => {
    try {
      const session = JSON.parse(localStorage.getItem("session"))
      const response = await API.put(
        `/connections/status`,
        { id, status },
        {
          headers: { Authorization: `Bearer ${session.token}` },
        },
      )

      if (response.status === 200) {
        toast.success(`Connection ${status.toLowerCase()} successfully.`)
        // Refresh the data after updating
        const updatedPending = pendingRequests.filter((req) => req._id !== id)
        setPendingRequests(updatedPending)

        if (status === "Approved") {
          const approvedRequest = pendingRequests.find((req) => req._id === id)
          setApprovedConnections((prev) => [...prev, approvedRequest])
        }
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to update connection status. Please try again.")
    }
  }

  return (
    <div className="mt-[30px] min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <CardTitle>Mentor Dashboard</CardTitle>
                <CardDescription className="text-white/80">Manage your student connections</CardDescription>
              </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="space-y-4">
              <StatsCard
                title="Connected Students"
                value={approvedConnections.length}
                icon={<Users className="h-6 w-6" />}
              />
              <StatsCard
                title="Pending Requests"
                value={pendingRequests.length}
                icon={<UserPlus className="h-6 w-6" />}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-white dark:bg-gray-800 p-0 rounded-lg shadow-md mb-6">
                <TabsTrigger
                  value="connectedStudents"
                  className="flex-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Connected Students
                </TabsTrigger>
                <TabsTrigger
                  value="pendingRequests"
                  className="flex-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Pending Requests
                  {pendingRequests.length > 0 && <Badge className="ml-2 bg-red-500">{pendingRequests.length}</Badge>}
                </TabsTrigger>
              </TabsList>

              {loading ? (
                <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <Loader2 className="animate-spin h-8 w-8 text-primary" />
                </div>
              ) : (
                <>
                  <TabsContent value="connectedStudents" className="mt-0">
                    <Card className="border-0 shadow-md">
                      <CardHeader>
                        <CardTitle>Connected Students</CardTitle>
                        <CardDescription>View all students you are connected with.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {approvedConnections.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {approvedConnections.map((connection) => (
                              <ConnectedStudentCard key={connection._id} connection={connection} />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-medium">No connected students yet</p>
                            <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
                              When students connect with you, they will appear here. Check your pending requests tab for
                              new connection requests.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="pendingRequests" className="mt-0">
                    <Card className="border-0 shadow-md">
                      <CardHeader>
                        <CardTitle>Pending Requests</CardTitle>
                        <CardDescription>Approve or reject student connection requests.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {pendingRequests.length > 0 ? (
                          <ScrollArea className="h-[600px] pr-4">
                            <div className="space-y-6">
                              {pendingRequests.map((request) => (
                                <PendingRequestCard
                                  key={request._id}
                                  request={request}
                                  onUpdateStatus={handleUpdateStatus}
                                />
                              ))}
                            </div>
                          </ScrollArea>
                        ) : (
                          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-medium">No pending requests</p>
                            <p className="text-gray-400 text-sm mt-2">
                              You&apos;re all caught up! Check back later for new connection requests.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
