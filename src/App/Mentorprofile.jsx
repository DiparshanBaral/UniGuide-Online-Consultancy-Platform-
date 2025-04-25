import { useState, useEffect } from "react"
import { toast } from "sonner"
import API from "../api"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Briefcase, Globe, BookOpen, School, DollarSign, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import RatingStars from "@/components/ui/rating-stars"
import MentorReview from "@/components/mentor-review"
import MentorReviewsList from "@/components/mentor-reviews-list"

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function MentorProfile() {
  const { id } = useParams()
  const [mentor, setMentor] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [averageRating, setAverageRating] = useState(0)
  const session = JSON.parse(localStorage.getItem("session"))

  useEffect(() => {
    const fetchMentorData = async () => {
      setIsLoading(true)
      try {
        const response = await API.get(`/mentor/${id}`)
        setMentor(response.data)
        fetchAverageRating()
      } catch (error) {
        console.error("Error fetching mentor data:", error)
        toast.error("Failed to fetch mentor data.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMentorData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchAverageRating = async () => {
    try {
      if (session?.token) {
        const response = await API.get(`/review/${id}/average`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        })
        setAverageRating(Number.parseFloat(response.data.averageRating) || 0)
      }
    } catch (error) {
      console.error("Error fetching average rating:", error)
    }
  }

  // Handle connection request submission
  const handleApplyForConnection = async () => {
    if (!description.trim()) {
      toast.error("Please provide a description for your connection request.")
      return
    }
    try {
      const session = JSON.parse(localStorage.getItem("session"))
      if (!session || !session.token) {
        toast.error("You must be logged in to apply for a connection.")
        return
      }
      const response = await API.post(
        "/connections/apply",
        {
          studentId: session._id,
          mentorId: id,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        },
      )
      if (response.status === 201) {
        toast.success("Connection request submitted successfully!")
        setIsDialogOpen(false)
        setDescription("")
      }
    } catch (error) {
      console.error("Error submitting connection request:", error)
      toast.error(error.response?.data?.error || "An error occurred while submitting the request.")
    }
  }

  const handleReviewSubmitted = () => {
    // Refresh average rating after a new review is submitted
    fetchAverageRating()
  }

  if (isLoading) {
    return (
      <div className="pt-[90px] min-h-screen bg-gradient-to-b from-background to-primary/5 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="pt-[90px] min-h-screen bg-gradient-to-b from-background to-primary/5 flex justify-center items-center">
        <p className="text-muted-foreground">Mentor profile not found.</p>
      </div>
    )
  }

  return (
    <div className="mt-[60px] min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Mentor Info */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <Card className="border-primary/10 shadow-lg overflow-hidden sticky top-24">
              <div className="h-24 bg-gradient-to-r from-primary to-primary/60"></div>
              <div className="flex flex-col items-center -mt-12 p-6">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage
                    src={mentor.profilePic || "/placeholder.svg"}
                    alt={`${mentor.firstname} ${mentor.lastname}`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {mentor.firstname?.[0]}
                    {mentor.lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mt-4">{`${mentor.firstname} ${mentor.lastname}`}</h2>
                <p className="text-muted-foreground flex items-center gap-1 mt-1">
                  <School className="h-4 w-4" />
                  {mentor.university || "University not specified"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <RatingStars rating={averageRating} />
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                </div>
                {/* Connect with Mentor Button */}
                {session && session.role === "student" && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default" className="mt-6 w-full">
                        Connect with Mentor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Request Connection</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Textarea
                          placeholder="Describe why you want to connect with this mentor..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="resize-none min-h-[120px] border-primary/20 focus-visible:ring-primary/30"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleApplyForConnection}>Submit</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                <Separator className="my-6" />
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span>Experience</span>
                    </div>
                    <span className="font-medium">{mentor.yearsOfExperience || 0} years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span>Consultation Fee</span>
                    </div>
                    <span className="font-medium">
                      {mentor.consultationFee || 0} {mentor.currency || "USD"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          {/* Right Column - Content */}
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {mentor.bio || "This mentor hasn't added a bio yet."}
                </p>
              </CardContent>
            </Card>
            {/* Expertise */}
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Areas of Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(mentor.expertise || []).map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {mentor.expertise?.length === 0 && (
                    <p className="text-muted-foreground">No expertise areas specified.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Languages */}
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentor.languages && mentor.languages.length > 0
                    ? mentor.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          {language}
                        </Badge>
                      ))
                    : ["English", "Nepali"].map((language) => (
                        <Badge key={language} variant="outline" className="px-3 py-1">
                          {language}
                        </Badge>
                      ))}
                </div>
              </CardContent>
            </Card>
            {/* Education & Experience */}
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-primary" />
                  Education & Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <School className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{mentor.university || "University not specified"}</h3>
                      <p className="text-muted-foreground">{mentor.degree || "Degree not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Professional Experience</h3>
                      <p className="text-muted-foreground">{mentor.yearsOfExperience || 0} years of experience</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Review Section (only for students who are logged in) */}
            {session && session.role === "student" && (
              <MentorReview mentorId={id} onReviewSubmitted={handleReviewSubmitted} />
            )}

            {/* Reviews */}
            <Card className="border-primary/10 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Student Reviews
                  </CardTitle>
                  <CardDescription>What students say about this mentor</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <RatingStars rating={averageRating} />
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <MentorReviewsList mentorId={id} />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default MentorProfile
