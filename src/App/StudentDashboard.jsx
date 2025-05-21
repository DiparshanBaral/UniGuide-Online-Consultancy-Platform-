"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { toast } from "sonner"
import API from "../api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar"
import { Badge } from "@/Components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import {
  Loader2,
  CheckCircle,
  UserPlus,
  CircleDollarSign,
  Users,
  GraduationCap,
  Mail,
  Calendar,
  Clock,
  School,
  BookOpen,
  ChevronRight,
  ExternalLink,
} from "lucide-react"

// Mentor Card Component
const MentorCard = ({ mentor }) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
        <AvatarImage
          src={mentor.profilePic || "/placeholder-avatar.png"}
          alt={`${mentor.firstname} ${mentor.lastname}`}
        />
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {mentor.firstname[0]}
          {mentor.lastname[0]}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{`${mentor.firstname} ${mentor.lastname}`}</p>
        <p className="text-sm text-muted-foreground">{mentor.email}</p>
      </div>
    </div>
  )
}

MentorCard.propTypes = {
  mentor: PropTypes.shape({
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    profilePic: PropTypes.string,
  }).isRequired,
}

// Connected Mentor Card Component
const ConnectedMentorCard = ({ connection, onPortalAccess, onPayNow }) => {
  const isPaid = connection.paymentStatus === "paid"

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-xl border-0 bg-white dark:bg-gray-800 shadow-md h-full cursor-pointer transform hover:scale-[1.02] ${
        isPaid ? "hover:border-green-200" : "hover:border-yellow-200"
      }`}
      onClick={() => onPortalAccess(connection)}
    >
      <CardHeader
        className={`pb-4 relative ${
          isPaid ? "bg-gradient-to-r from-green-50 to-green-100/50" : "bg-gradient-to-r from-yellow-50 to-yellow-100/50"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-3 border-white shadow-md">
            <AvatarImage
              src={connection.mentorId.profilePic || "/placeholder-avatar.png"}
              alt={`${connection.mentorId.firstname} ${connection.mentorId.lastname}`}
            />
            <AvatarFallback className="bg-primary/20 text-primary font-medium text-xl">
              {connection.mentorId.firstname[0]}
              {connection.mentorId.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              {`${connection.mentorId.firstname} ${connection.mentorId.lastname}`}
            </CardTitle>
            <CardDescription className="text-sm flex items-center gap-1 mt-1">
              <Mail className="h-3.5 w-3.5" />
              {connection.mentorId.email}
            </CardDescription>
          </div>
          <div className="ml-auto">
            <Badge
              variant={isPaid ? "success" : "outline"}
              className={
                isPaid
                  ? "bg-green-100 text-green-800 border-green-200 px-3 py-1.5"
                  : "bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1.5"
              }
            >
              {isPaid ? "Paid" : "Payment Required"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <School className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">University</span>
              <p className="font-medium">{connection.mentorId.university || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Degree</span>
              <p className="font-medium">{connection.mentorId.degree || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Experience</span>
              <p className="font-medium">{connection.mentorId.yearsOfExperience || 0} years</p>
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
      <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-5 flex flex-col gap-3">
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onPortalAccess(connection)
          }}
          className="w-full gap-2 py-6"
          variant={isPaid ? "default" : "outline"}
          size="lg"
        >
          {isPaid ? (
            <>
              <CheckCircle className="h-5 w-5" />
              Access Portal
            </>
          ) : (
            <>
              <ExternalLink className="h-5 w-5" />
              View Details
            </>
          )}
        </Button>

        {!isPaid && (
          <Button
            variant="default"
            onClick={(e) => {
              e.stopPropagation()
              onPayNow(connection._id)
            }}
            className="w-full gap-2 py-6"
            size="lg"
          >
            <CircleDollarSign className="h-5 w-5" />
            Pay Now
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

ConnectedMentorCard.propTypes = {
  connection: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    portalId: PropTypes.string,
    createdAt: PropTypes.string,
    paymentStatus: PropTypes.string.isRequired,
    mentorId: PropTypes.shape({
      firstname: PropTypes.string.isRequired,
      lastname: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      profilePic: PropTypes.string,
      university: PropTypes.string,
      degree: PropTypes.string,
      yearsOfExperience: PropTypes.number,
    }).isRequired,
  }).isRequired,
  onPortalAccess: PropTypes.func.isRequired,
  onPayNow: PropTypes.func.isRequired,
}

// Pending Mentor Card Component
const PendingMentorCard = ({ connection }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-0 bg-white dark:bg-gray-800 shadow-md h-full">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-blue-100/50 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-3 border-white shadow-md">
            <AvatarImage
              src={connection.mentorId.profilePic || "/placeholder-avatar.png"}
              alt={`${connection.mentorId.firstname} ${connection.mentorId.lastname}`}
            />
            <AvatarFallback className="bg-primary/20 text-primary font-medium text-xl">
              {connection.mentorId.firstname[0]}
              {connection.mentorId.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              {`${connection.mentorId.firstname} ${connection.mentorId.lastname}`}
            </CardTitle>
            <CardDescription className="text-sm flex items-center gap-1 mt-1">
              <Mail className="h-3.5 w-3.5" />
              {connection.mentorId.email}
            </CardDescription>
          </div>
          <div className="ml-auto">
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1.5">
              Pending
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <School className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">University</span>
              <p className="font-medium">{connection.mentorId.university || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Degree</span>
              <p className="font-medium">{connection.mentorId.degree || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Experience</span>
              <p className="font-medium">{connection.mentorId.yearsOfExperience || 0} years</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Requested On</span>
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
        <div className="flex items-center gap-2 text-blue-600">
          <Clock className="h-5 w-5" />
          <span className="font-medium">Waiting for mentor approval</span>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </CardFooter>
    </Card>
  )
}

PendingMentorCard.propTypes = {
  connection: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    mentorId: PropTypes.shape({
      firstname: PropTypes.string.isRequired,
      lastname: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      profilePic: PropTypes.string,
      university: PropTypes.string,
      degree: PropTypes.string,
      yearsOfExperience: PropTypes.number,
    }).isRequired,
  }).isRequired,
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
export default function StudentDashboard() {
  const [pendingConnections, setPendingConnections] = useState([])
  const [connectedMentors, setConnectedMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("connectedMentors")
  const navigate = useNavigate()

  // Fetch data on component mount
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const session = JSON.parse(localStorage.getItem("session"))
        const studentId = session._id

        // Fetch connected mentors
        const connectedResponse = await API.get(`/connections/student/approvedconnections?studentId=${studentId}`, {
          headers: { Authorization: `Bearer ${session.token}` },
        })

        // Get payment status for each connection
        const connectionsWithPaymentStatus = await Promise.all(
          connectedResponse.data.map(async (connection) => {
            try {
              // Get payment status
              const paymentResponse = await API.get(`/payment/connection-status/${connection._id}`, {
                headers: { Authorization: `Bearer ${session.token}` },
              })

              return {
                ...connection,
                paymentStatus: paymentResponse.data.status || "pending",
              }
            } catch (error) {
              console.error("Error fetching payment status:", error)
              return {
                ...connection,
                paymentStatus: "pending",
              }
            }
          }),
        )

        setConnectedMentors(connectionsWithPaymentStatus)

        // Fetch pending connections
        const pendingResponse = await API.get(`/connections/student/pendingconnections?studentId=${studentId}`, {
          headers: { Authorization: `Bearer ${session.token}` },
        })
        setPendingConnections(pendingResponse.data)
      } catch (error) {
        console.log(error)
        toast.error("Failed to fetch connections. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchConnections()
  }, [])

  const handlePortalAccess = (connection) => {
    // Check if payment is completed
    if (connection.paymentStatus === "paid") {
      navigate(`/studentportal/${connection.portalId}`)
    } else {
      // Redirect to access denied page with connection info
      navigate(`/access-denied/${connection._id}`, {
        state: {
          mentorName: `${connection.mentorId.firstname} ${connection.mentorId.lastname}`,
          connectionId: connection._id,
        },
      })
    }
  }

  const handlePayNow = (connectionId) => {
    navigate(`/payments/${connectionId}`)
  }

  const paidMentorsCount = connectedMentors.filter((c) => c.paymentStatus === "paid").length
  const pendingPaymentsCount = connectedMentors.filter((c) => c.paymentStatus === "pending").length

  return (
    <div className="mt-[30px] min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <CardTitle>Student Dashboard</CardTitle>
                <CardDescription className="text-white/80">Manage your mentor connections</CardDescription>
              </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="space-y-4">
              <StatsCard
                title="Connected Mentors"
                value={connectedMentors.length}
                icon={<Users className="h-6 w-6" />}
              />
              <StatsCard
                title="Paid Mentors"
                value={paidMentorsCount}
                icon={<CircleDollarSign className="h-6 w-6" />}
              />
              <StatsCard title="Pending Payments" value={pendingPaymentsCount} icon={<Clock className="h-6 w-6" />} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-white dark:bg-gray-800 p-0 rounded-lg shadow-md mb-6">
                <TabsTrigger
                  value="connectedMentors"
                  className="flex-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Connected Mentors
                </TabsTrigger>
                <TabsTrigger
                  value="pendingRequests"
                  className="flex-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Pending Requests
                  {pendingConnections.length > 0 && (
                    <Badge className="ml-2 bg-blue-500">{pendingConnections.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {loading ? (
                <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <Loader2 className="animate-spin h-8 w-8 text-primary" />
                </div>
              ) : (
                <>
                  <TabsContent value="connectedMentors" className="mt-0">
                    <Card className="border-0 shadow-md">
                      <CardHeader>
                        <CardTitle>Connected Mentors</CardTitle>
                        <CardDescription>View all mentors you are connected with.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {connectedMentors.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {connectedMentors.map((connection) => (
                              <ConnectedMentorCard
                                key={connection._id}
                                connection={connection}
                                onPortalAccess={handlePortalAccess}
                                onPayNow={handlePayNow}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-medium">No connected mentors yet</p>
                            <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
                              Connect with mentors to get guidance on your university applications and career path.
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
                        <CardDescription>View all pending mentor connection requests.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {pendingConnections.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {pendingConnections.map((connection) => (
                              <PendingMentorCard key={connection._id} connection={connection} />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-medium">No pending requests</p>
                            <p className="text-gray-400 text-sm mt-2">
                              You&apos;re all caught up! Check back later for updates on your connection requests.
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
