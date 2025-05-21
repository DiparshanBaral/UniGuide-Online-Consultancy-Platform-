"use client"

import { useState, useEffect } from "react"
import { CallProvider } from "../contexts/CallContext"
import PortalNavigation from "@/Components/PortalNavigation"
import Tasks from "@/Components/Tasks"
import Chat from "@/Components/Chat"
import PortalDocuments from "@/Components/PortalDocuments"
import { Loader2 } from "lucide-react"

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState("tasks")
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem("session")
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession)
      setSession(parsedSession)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-lg font-medium text-gray-600">Loading portal...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Session Expired</h2>
          <p className="text-gray-600 mb-6">Your session has expired or you&apos;re not logged in. Please log in again.</p>
          <a
            href="/login"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <CallProvider session={session}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Left Navigation Bar */}
        <PortalNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === "tasks" && <Tasks sessionRole="student" />}
            {activeTab === "documents" && <PortalDocuments />}
            {activeTab === "chat" && <Chat />}
          </div>
        </div>
      </div>
    </CallProvider>
  )
}

export default StudentPortal
