import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import { Button } from "@/Components/ui/button"
import { CheckCircle, FileText, MessageCircle, ArrowLeft, Menu, X, ChevronRight } from 'lucide-react'
import { Link, useParams, useLocation } from "react-router-dom"
import API from "../api"
import logo from "@/assets/UniGuide_logo.PNG"

const PortalNavigation = ({ activeTab, setActiveTab }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { portalid } = useParams()
  const location = useLocation()

  // Fetch session data (portal details and associated user details)
  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        setLoading(true)

        // Fetch session from localStorage
        const savedSession = localStorage.getItem("session")
        if (!savedSession) {
          throw new Error("No session found")
        }
        const parsedSession = JSON.parse(savedSession)
        const token = parsedSession.token

        // Fetch portal data using portalId
        const portalResponse = await API.get(`/portal/${portalid}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const portalData = portalResponse.data

        // Determine the role and extract user details
        let userDetails, otherUserDetails
        if (parsedSession.role === "mentor") {
          userDetails = portalData.mentorId
          otherUserDetails = portalData.studentId
        } else if (parsedSession.role === "student") {
          userDetails = portalData.studentId
          otherUserDetails = portalData.mentorId
        }

        // Combine portal data, user details, and other user details into session
        setSession({
          ...parsedSession,
          ...portalData,
          name: `${userDetails.firstname} ${userDetails.lastname}`,
          profilePicture: userDetails.profilePic,
          university: userDetails.university || userDetails.major,
          otherUser: {
            name: `${otherUserDetails.firstname} ${otherUserDetails.lastname}`,
            profilePicture: otherUserDetails.profilePic,
            university: otherUserDetails.university,
            major: otherUserDetails.major,
          },
        })
      } catch (error) {
        console.error("Error fetching portal or user details:", error.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }

    // Fetch portal data whenever the location changes (e.g., navigating back)
    fetchPortalData()
  }, [portalid, location])

  // If still loading, show a placeholder
  if (loading) {
    return (
      <div className="w-[280px] bg-white shadow-lg h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // If session is null, show an error message
  if (!session) {
    return (
      <div className="w-[280px] bg-white shadow-lg h-screen flex items-center justify-center">
        <div className="text-center text-red-500 p-4">Failed to load session details.</div>
      </div>
    )
  }

  // Determine the portal title and profile link based on the session role
  const portalTitle = session?.role === "mentor" ? "Mentor Portal" : "Student Portal"
  const profileLink =
    session?.role === "mentor"
      ? `/publicstudentprofile/${session?.studentId?._id}`
      : `/mentorprofile/${session?.mentorId?._id}`

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Mobile Menu Button - Only visible on small screens */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" className="rounded-full shadow-md bg-white" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar - Hidden on mobile unless menu is open */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-[280px] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full border-r bg-white shadow-lg">
          {/* Header */}
          <div className="border-b p-4">
            <div className="flex flex-col items-center space-y-2">
              <img src={logo || "/placeholder.svg"} alt="UniGuide Logo" className="h-16 w-auto" />
              <h2 className="text-xl font-bold text-primary">{portalTitle}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto py-2">
            {/* Profile Card */}
            <Link
              to={profileLink}
              className="block mx-4 mt-6 mb-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md group"
            >
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={session?.otherUser?.profilePicture || "/default-avatar.png"}
                      alt={`${session?.otherUser?.name}'s profile`}
                      className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{session?.otherUser?.name}</p>
                    <p className="text-sm text-gray-600">
                      {session?.role === "mentor" ? session?.otherUser?.major : session?.otherUser?.university}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>

            {/* Navigation Menu */}
            <div className="px-3 py-2">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Portal Menu</h3>
              <nav className="space-y-1">
                <Button
                  variant={activeTab === "tasks" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab("tasks")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <span>Tasks</span>
                </Button>
                <Button
                  variant={activeTab === "chat" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab("chat")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  <span>Chat</span>
                </Button>
                <Button
                  variant={activeTab === "documents" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab("documents")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  <span>Documents</span>
                </Button>
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu - only visible when menu is open */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={toggleMobileMenu}></div>
      )}
    </>
  )
}

// Props Validation
PortalNavigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
}

export default PortalNavigation
