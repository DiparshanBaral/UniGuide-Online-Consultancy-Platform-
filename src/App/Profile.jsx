import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import API from "../api"
import { Button } from "@/components/ui/button"
import { AvatarUpload } from "@/components/ui/avatarupload"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, BookOpen, School, UserRound, Edit, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import StudentProfileForm from "@/components/Student-form"
import PasswordUpdateForm from "@/components/PasswordUpdateForm" 

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [updatedUser, setUpdatedUser] = useState({})
  const [profilePic, setProfilePic] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [wishlistUniversities, setWishlistUniversities] = useState([])
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false) // State for controlling the dialog

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData()
  }, [])

  // Function to fetch user data
  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      const session = JSON.parse(localStorage.getItem("session"))
      if (session && session._id && session.token) {
        const response = await API.get(`/student/${session._id}`, {
          headers: { Authorization: `Bearer ${session.token}` },
        })
        if (response.status === 200) {
          const userData = response.data
          setUser(userData)
          setUpdatedUser(userData)
        } else {
          console.error("Failed to fetch user data:", response.statusText)
          toast.error("Failed to fetch user data. Please log in again.")
        }
      } else {
        console.error("No valid session found in localStorage")
        toast.error("No valid session found. Please log in again.")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast.error("An error occurred while fetching user data.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUpdatedUser((prev) => ({ ...prev, [name]: value }))
  }

  // Handle profile update submission
  const handleUpdateProfile = async () => {
    if (!updatedUser.firstname || !updatedUser.lastname || !updatedUser.email) {
      toast.error("Please fill in all required fields.")
      return
    }
    setIsLoading(true)
    try {
      const session = JSON.parse(localStorage.getItem("session"))
      const formData = new FormData()
      // Append updated fields to FormData
      formData.append("firstname", updatedUser.firstname)
      formData.append("lastname", updatedUser.lastname)
      formData.append("email", updatedUser.email)
      formData.append("bio", updatedUser.bio || "")
      formData.append("major", updatedUser.major || "")
      // Append profile picture if available
      if (profilePic) {
        formData.append("profilePic", profilePic)
      }
      const response = await API.put(`/student/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      })
      if (response.status === 200) {
        setUser(response.data)
        setUpdatedUser(response.data)
        setProfilePic(null) // Reset profile picture state
        setIsEditing(false) // Exit editing mode
        toast.success("Profile updated successfully!")
      } else {
        toast.error(`Failed to update profile: ${response.data.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("An error occurred while updating the profile. " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch wishlist universities
  useEffect(() => {
    const fetchWishlistUniversities = async () => {
      try {
        const session = JSON.parse(localStorage.getItem("session"))
        if (!session || !session.token) {
          toast.error("You must be logged in to view your wishlist.")
          return
        }
        const response = await API.get("/student/wishlist", {
          headers: { Authorization: `Bearer ${session.token}` },
        })
        if (response.status === 200) {
          setWishlistUniversities(response.data.wishlistUniversities)
        } else {
          console.error("Failed to fetch wishlist universities:", response.statusText)
          toast.error("Failed to fetch wishlist universities.")
        }
      } catch (error) {
        console.error("Error fetching wishlist universities:", error)
        toast.error("An error occurred while fetching wishlist universities.")
      }
    }
    fetchWishlistUniversities()
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // No user data found
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">No user data found.</p>
      </div>
    )
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-16 bg-gradient-to-b from-background to-primary/5 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {!user.profileCompleted && (
          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <AlertTitle className="text-amber-500 font-medium">Complete your profile</AlertTitle>
            <AlertDescription className="text-amber-500/90">
              Your profile is incomplete. Complete your profile to access all features.
            </AlertDescription>
            <Button
              className="mt-2 bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => setIsProfileFormOpen(true)} // Open the StudentProfileForm dialog
            >
              Complete Profile
            </Button>
          </Alert>
        )}
        <Card className="border-primary/10 shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary to-primary/60"></div>
          <div className="px-6 sm:px-10 pb-6 -mt-16 relative">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              <div className="relative flex justify-center">
                <div className="h-32 w-32 rounded-full border-4 border-background overflow-hidden bg-background flex items-center justify-center">
                  <AvatarUpload
                    currentAvatar={user.profilePic}
                    onImageSelect={(file) => setProfilePic(file)}
                    onRemove={() => setProfilePic(null)}
                    isEditing={isEditing}
                  />
                </div>
                {user.profileCompleted && (
                  <Badge className="absolute bottom-0 right-0 bg-green-500 text-white border-0 flex items-center gap-1 px-2 py-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">{`${user.firstname} ${user.lastname}`}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="sm:self-start flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      {user.profileCompleted ? "Edit Profile" : "Complete Profile"}
                    </Button>
                  ) : (
                    <div className="flex gap-2 sm:self-start">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateProfile}>Save Changes</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Tabs defaultValue="profile" className="px-6 sm:px-10 pb-6">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="universities">Universities</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              {!isEditing ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <UserRound className="h-5 w-5 text-primary" />
                        About Me
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{user.bio || "No bio available."}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <School className="h-5 w-5 text-primary" />
                        Academic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Major:</span>
                          <span className="text-muted-foreground ml-2">{user.major || "Not specified"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <input
                        type="text"
                        name="firstname"
                        value={updatedUser.firstname}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <input
                        type="text"
                        name="lastname"
                        value={updatedUser.lastname}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={updatedUser.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea
                      name="bio"
                      value={updatedUser.bio || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Major</label>
                    <input
                      type="text"
                      name="major"
                      value={updatedUser.major || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="universities">
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle>Targeted Universities</CardTitle>
                  <CardDescription>Universities you&apos;re interested in</CardDescription>
                </CardHeader>
                <CardContent>
                  {wishlistUniversities.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {wishlistUniversities.map((uni, index) => (
                        <Card key={index} className="border-primary/10">
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{uni.name}</p>
                              <p className="text-sm text-muted-foreground">{uni.country}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No targeted universities added yet.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/universities")}>
                    Explore Universities
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="security">
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Update Password
                  </CardTitle>
                  <CardDescription>Change your account password</CardDescription>
                </CardHeader>
                <CardContent>
                  <PasswordUpdateForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Render the StudentProfileForm dialog */}
        <StudentProfileForm
          isOpen={isProfileFormOpen}
          onClose={() => {
            setIsProfileFormOpen(false)
            fetchUserData() // Refetch user data to update the profile
          }}
          userId={user?._id}
        />
      </div>
    </div>
  )
}

export default Profile
