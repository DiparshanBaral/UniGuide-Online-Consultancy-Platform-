"use client"

import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Badge } from "@/Components/ui/badge"
import {
  Tabs as InnerTabs,
  TabsList as InnerTabsList,
  TabsTrigger as InnerTabsTrigger,
  TabsContent as InnerTabsContent,
} from "@/Components/ui/tabs"
import { ChevronRight, Calendar, User, Loader2, AlertCircle, Trash2, Heart, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import API from "../api"
import ExperienceDetail from "@/Components/experience-detail"

// Experience Card Component
const ExperienceCard = ({ experience, onViewFull, onLike, session }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden group hover:shadow-md transition-all duration-300 border border-gray-200 h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Badge className="px-2 py-1 bg-primary/10 text-primary border-primary/20">
                {experience.flag} {experience.country}
              </Badge>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {formatDate(experience.date)}
              </span>
            </div>
          </div>
          <CardTitle className="mt-2 text-xl group-hover:text-primary transition-colors">{experience.title}</CardTitle>
          <div className="flex items-center mt-2">
            <div className="bg-gray-100 rounded-full p-1 mr-2">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <CardDescription>By {experience.author.name}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-0 top-0 w-1 h-full bg-primary/30 rounded-full"></div>
            <p className="text-gray-700 pl-4 line-clamp-3">{experience.excerpt}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4 pb-4">
          <div className="flex gap-4 text-sm text-gray-500">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onLike(experience.country, experience.postid || experience._id?.toString(), session?._id)}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
            >
              <Heart className="h-4 w-4 text-red-500" fill="red" /> {experience.likes || 0}
            </motion.button>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              className="text-primary border-primary hover:bg-primary/10"
              onClick={() => onViewFull(experience)}
            >
              Read More <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Prop validation for ExperienceCard
ExperienceCard.propTypes = {
  experience: PropTypes.shape({
    _id: PropTypes.string,
    postid: PropTypes.string,
    title: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    flag: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    likes: PropTypes.number,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onViewFull: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired,
  session: PropTypes.object,
}

// Country Card Component
const CountryCard = ({ country }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-4xl"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {country.flag}
            </motion.span>
            <div>
              <CardTitle>{country.name}</CardTitle>
              <CardDescription>Student Visa Information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-gray-500 mb-2">Available Visa Types</h4>
              <div className="flex flex-wrap gap-2">
                {country.visaTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-500 mb-2">Average Processing Time</h4>
              <p>{country.processingTime}</p>
            </div>
            <div className="pt-2">
              <h4 className="font-medium text-sm text-gray-500 mb-2">Key Requirements</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Acceptance letter from institution</li>
                <li>Proof of financial support</li>
                <li>Valid passport</li>
                <li>Health insurance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Prop validation for CountryCard
CountryCard.propTypes = {
  country: PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    flag: PropTypes.string.isRequired,
    visaTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    processingTime: PropTypes.string.isRequired,
  }).isRequired,
}

// Format date helper function
const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), "MMM d, yyyy")
  } catch (error) {
    console.log(error)
    return dateString
  }
}

export default function VisaSection() {
  // State for tabs
  const [setActiveTab] = useState("experiences")
  const [innerTab, setInnerTab] = useState("all")
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  // State for form inputs
  const [title, setTitle] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [content, setContent] = useState("")

  // State for API data
  const [experiences, setExperiences] = useState([])
  const [recentExperiences, setRecentExperiences] = useState([])
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingRecent, setLoadingRecent] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [session, setSession] = useState(null)

  // State for pagination
  const [visibleExperiences, setVisibleExperiences] = useState(6)
  const [visibleRecentExperiences, setVisibleRecentExperiences] = useState(6)
  const [visibleUserPosts, setVisibleUserPosts] = useState(6)

  // State for selected experience
  const [selectedExperience, setSelectedExperience] = useState(null)
  const [showDetailView, setShowDetailView] = useState(false)

  const countries = [
    {
      name: "United States",
      code: "us",
      flag: "🇺🇸",
      visaTypes: ["F-1 Student Visa", "J-1 Exchange Visitor"],
      processingTime: "Instant (Interview Based)",
    },
    {
      name: "United Kingdom",
      code: "uk",
      flag: "🇬🇧",
      visaTypes: ["Student Visa (Tier 4)", "Short-term Study Visa"],
      processingTime: "3 weeks",
    },
    {
      name: "Canada",
      code: "canada",
      flag: "🇨🇦",
      visaTypes: ["Study Permit", "Student Direct Stream"],
      processingTime: "4-8 weeks",
    },
    {
      name: "Australia",
      code: "australia",
      flag: "🇦🇺",
      visaTypes: ["Student Visa (Subclass 500)"],
      processingTime: "4-6 weeks",
    },
  ]

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem("session")
    if (savedSession) {
      try {
        setSession(JSON.parse(savedSession)) // Set session from localStorage if it exists
      } catch (err) {
        console.error("Error parsing session from localStorage:", err)
      }
    }
  }, [])

  // Fetch all visa experiences
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true)
        const response = await API.get("/visa/experiences", {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        })
        // Check if response exists and is successful
        if (response && response.status === 200) {
          setExperiences(response.data || [])
          setError(null)
        } else {
          throw new Error("Failed to fetch experiences")
        }
      } catch (err) {
        setError("Failed to load visa experiences. Please try again later.")
        console.error("Error fetching experiences:", err)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchExperiences()
    }
  }, [session])

  // Fetch recent experiences
  useEffect(() => {
    const fetchRecentExperiences = async () => {
      try {
        setLoadingRecent(true)
        const response = await API.get("/visa/experiences/recent", {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        })

        // Check if response exists and is successful
        if (response && response.status === 200) {
          setRecentExperiences(response.data || [])
        } else {
          console.error("Failed to fetch recent experiences")
        }
      } catch (err) {
        console.error("Error fetching recent experiences:", err)
      } finally {
        setLoadingRecent(false)
      }
    }

    if (session) {
      fetchRecentExperiences()
    }
  }, [session])

  // Fetch user's posts when session is available
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!session || !session._id) return

      try {
        const response = await API.get(`/visa/experience/author/${session._id}`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        })

        // Check if response exists and is successful
        if (response && response.status === 200) {
          setUserPosts(response.data || [])
        } else {
          console.error("API Error: Failed to fetch your posts")
        }
      } catch (err) {
        console.error("Error fetching user posts:", err)
      }
    }

    if (session) {
      fetchUserPosts()
    }
  }, [session])

  // Handle form submission for new experience
  const handleSubmitExperience = async (e) => {
    e.preventDefault()

    if (!session) {
      toast.error("Please log in to share your experience.")
      return
    }

    if (!title || !selectedCountry || !content) {
      toast.error("Please fill in all required fields.")
      return
    }

    try {
      setSubmitting(true)

      // Find the selected country details
      const countryDetails = countries.find((c) => c.code === selectedCountry)
      if (!countryDetails) {
        throw new Error("Invalid country selected")
      }

      const response = await API.post(
        "/visa/experience",
        {
          country: countryDetails.name,
          flag: countryDetails.flag,
          title,
          excerpt: content,
          author: {
            authorId: session._id,
            name: `${session.firstname} ${session.lastname}`,
            avatar: session.profilePic || `https://ui-avatars.com/api/?name=${session.firstname}`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        },
      )

      // Check if response exists and is successful
      if (response && response.status === 201) {
        // Reset form and close dialog
        setTitle("")
        setSelectedCountry("")
        setContent("")
        setShareDialogOpen(false)

        // Fetch updated experiences
        const fetchUpdatedData = async () => {
          try {
            // Fetch updated experiences
            const experiencesResponse = await API.get("/visa/experiences", {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            })

            if (experiencesResponse && experiencesResponse.status === 200) {
              setExperiences(experiencesResponse.data || [])
            }

            // Fetch updated recent experiences
            const recentResponse = await API.get("/visa/experiences/recent", {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            })

            if (recentResponse && recentResponse.status === 200) {
              setRecentExperiences(recentResponse.data || [])
            }

            // Fetch updated user posts
            const userPostsResponse = await API.get(`/visa/experience/author/${session._id}`, {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            })

            if (userPostsResponse && userPostsResponse.status === 200) {
              setUserPosts(userPostsResponse.data || [])
            }
          } catch (error) {
            console.error("Error refreshing data:", error)
          }
        }

        await fetchUpdatedData()
        toast.success("Your visa experience has been posted successfully.")
      } else {
        throw new Error("Failed to post experience")
      }
    } catch (err) {
      console.error("Error posting experience:", err)
      toast.error("Failed to post your experience. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Handle deleting a post
  const handleDeletePost = async (country, postid) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return
    }

    try {
      const response = await API.delete("/visa/experience", {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        data: {
          country,
          postid,
        },
      })

      // Check if response exists and is successful
      if (response && response.status === 200) {
        // Remove the post from userPosts state
        setUserPosts(userPosts.filter((post) => post.postid !== postid))

        // Also remove from experiences if it exists there
        setExperiences(experiences.filter((exp) => exp.postid !== postid))

        // Also remove from recent experiences if it exists there
        setRecentExperiences(recentExperiences.filter((exp) => exp.postid !== postid))

        toast.success("Your post has been deleted successfully.")
      } else {
        throw new Error("Failed to delete post")
      }
    } catch (err) {
      console.error("Error deleting post:", err)
      toast.error("Failed to delete your post. Please try again.")
    }
  }

  // Handle liking a post
  const handleLikePost = async (country, postid, userId) => {
    if (!session) {
      toast.error("Please log in to like posts.")
      return
    }

    // Check if postid exists - DEBUG the issue
    if (!postid) {
      console.error("Missing postid for post:", { country, postid, userId })
      toast.error("Unable to like this post. Missing post ID.")
      return
    }

    try {
      const response = await API.post(
        "/visa/experience/like",
        {
          country,
          postid,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        },
      )

      if (response && response.status === 200) {
        // Update likes count in experiences
        setExperiences(
          experiences.map((exp) => {
            if (exp.postid === postid) {
              return { ...exp, likes: response.data.likes }
            }
            return exp
          }),
        )

        // Update likes count in recent experiences
        setRecentExperiences(
          recentExperiences.map((exp) => {
            if (exp.postid === postid) {
              return { ...exp, likes: response.data.likes }
            }
            return exp
          }),
        )

        // Update likes count in user posts
        setUserPosts(
          userPosts.map((post) => {
            if (post.postid === postid) {
              return { ...post, likes: response.data.likes }
            }
            return post
          }),
        )
        toast.success(response?.data.message)
      } else {
        throw new Error(response?.data?.message || "Failed to like post")
      }
    } catch (err) {
      console.error("Error liking post:", err)
      toast.error(err.message || "Failed to like post. Please try again.")
    }
  }

  // Handle viewing full post
  const handleViewFullPost = (post) => {
    setSelectedExperience(post)
    setShowDetailView(true)
  }

  // Handle going back from detail view
  const handleBackFromDetail = () => {
    setShowDetailView(false)
    setSelectedExperience(null)
  }

  // Load more experiences
  const handleLoadMoreExperiences = () => {
    setVisibleExperiences((prev) => prev + 6)
  }

  // Load more recent experiences
  const handleLoadMoreRecentExperiences = () => {
    setVisibleRecentExperiences((prev) => prev + 6)
  }

  // Load more user posts
  const handleLoadMoreUserPosts = () => {
    setVisibleUserPosts((prev) => prev + 6)
  }

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
          <motion.div variants={itemVariants} className="mb-6">
            <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Student Visa Resources
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Visa Information Hub</h1>
            <p className="text-gray-600 max-w-2xl">
              Your complete resource for student visa requirements, experiences, and expert guidance.
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-4 sm:grid-cols-4 gap-4 max-w-md mb-8" variants={containerVariants}>
            {countries.map((country) => (
              <motion.div key={country.code} className="text-center" variants={itemVariants} whileHover={{ y: -5 }}>
                <motion.div
                  className="flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-2xl">{country.flag}</span>
                </motion.div>
                <motion.p className="mt-1 text-xs font-medium" variants={itemVariants}>
                  {country.name}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {showDetailView && selectedExperience ? (
            <ExperienceDetail
              experience={selectedExperience}
              onBack={handleBackFromDetail}
              onLike={handleLikePost}
              onDelete={session && selectedExperience.authorId === session._id ? handleDeletePost : null}
            />
          ) : (
            <div className="max-w-7xl mx-auto">
              {/* Tabs Navigation */}
              <Tabs defaultValue="experiences" className="mb-12" onValueChange={setActiveTab}>
                <div className="border-b border-gray-200">
                  <TabsList className="bg-transparent h-auto p-0 mb-0">
                    <TabsTrigger
                      value="experiences"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                    >
                      Visa Experiences
                    </TabsTrigger>
                    <TabsTrigger
                      value="countries"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                    >
                      Country Information
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Visa Experiences Tab */}
                <TabsContent value="experiences" className="mt-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Student Visa Experiences</h2>
                    <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                      <DialogTrigger asChild>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button>Share Your Experience</Button>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle>Share Your Visa Experience</DialogTitle>
                          <DialogDescription>
                            Help other students by sharing your visa application and interview experience.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitExperience}>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label htmlFor="title" className="text-sm font-medium">
                                Title
                              </label>
                              <Input
                                id="title"
                                placeholder="E.g., My F-1 Visa Interview Experience"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <label htmlFor="country" className="text-sm font-medium">
                                Country
                              </label>
                              <Select value={selectedCountry} onValueChange={setSelectedCountry} required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                      {country.flag} {country.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <label htmlFor="experience" className="text-sm font-medium">
                                Your Experience
                              </label>
                              <Textarea
                                id="experience"
                                placeholder="Share details about your preparation, documents, interview questions, and tips for others..."
                                rows={6}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setShareDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                              {submitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                "Submit Experience"
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <InnerTabs defaultValue="all" value={innerTab} onValueChange={setInnerTab}>
                    <InnerTabsList className="mb-6">
                      <InnerTabsTrigger value="all">All Experiences</InnerTabsTrigger>
                      <InnerTabsTrigger value="recent">Recent</InnerTabsTrigger>
                      <InnerTabsTrigger value="yours" disabled={!session}>
                        Your Posts
                      </InnerTabsTrigger>
                    </InnerTabsList>

                    {/* All Experiences Tab */}
                    <InnerTabsContent value="all">
                      {error && (
                        <Alert variant="destructive" className="mb-6">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      {loading ? (
                        <div className="flex justify-center items-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="ml-2">Loading experiences...</span>
                        </div>
                      ) : experiences.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No visa experiences have been shared yet.</p>
                          <Button className="mt-4" onClick={() => setShareDialogOpen(true)}>
                            Be the first to share
                          </Button>
                        </div>
                      ) : (
                        <>
                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {experiences.slice(0, visibleExperiences).map((exp, index) => (
                              <ExperienceCard
                                key={index}
                                experience={exp}
                                onViewFull={handleViewFullPost}
                                onLike={handleLikePost}
                                session={session}
                              />
                            ))}
                          </motion.div>

                          {experiences.length > visibleExperiences && (
                            <motion.div
                              className="mt-8 text-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" onClick={handleLoadMoreExperiences}>
                                  Load More Experiences
                                </Button>
                              </motion.div>
                            </motion.div>
                          )}
                        </>
                      )}
                    </InnerTabsContent>

                    {/* Recent Experiences Tab */}
                    <InnerTabsContent value="recent">
                      {loadingRecent ? (
                        <div className="flex justify-center items-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="ml-2">Loading recent experiences...</span>
                        </div>
                      ) : recentExperiences.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No recent visa experiences have been shared yet.</p>
                          <Button className="mt-4" onClick={() => setShareDialogOpen(true)}>
                            Be the first to share
                          </Button>
                        </div>
                      ) : (
                        <>
                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {recentExperiences.slice(0, visibleRecentExperiences).map((exp, index) => (
                              <ExperienceCard
                                key={index}
                                experience={exp}
                                onViewFull={handleViewFullPost}
                                onLike={handleLikePost}
                                session={session}
                              />
                            ))}
                          </motion.div>

                          {recentExperiences.length > visibleRecentExperiences && (
                            <motion.div
                              className="mt-8 text-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" onClick={handleLoadMoreRecentExperiences}>
                                  Load More Experiences
                                </Button>
                              </motion.div>
                            </motion.div>
                          )}
                        </>
                      )}
                    </InnerTabsContent>

                    {/* Your Posts Tab */}
                    <InnerTabsContent value="yours">
                      {!session ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500">Please log in to view your posts.</p>
                        </div>
                      ) : userPosts.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500">You haven&apos;t shared any visa experiences yet.</p>
                          <Button className="mt-4" onClick={() => setShareDialogOpen(true)}>
                            Share your first experience
                          </Button>
                        </div>
                      ) : (
                        <>
                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {userPosts.slice(0, visibleUserPosts).map((post, index) => (
                              <motion.div key={index} variants={itemVariants} className="h-full">
                                <Card className="overflow-hidden group hover:shadow-md transition-all duration-300 border border-gray-200 h-full">
                                  <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-center gap-2">
                                        <Badge className="px-2 py-1 bg-primary/10 text-primary border-primary/20">
                                          {post.flag} {post.country}
                                        </Badge>
                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                          <Calendar className="h-3 w-3" /> {formatDate(post.date)}
                                        </span>
                                      </div>
                                      <div className="flex space-x-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-red-500 hover:text-red-700"
                                          onClick={() => handleDeletePost(post.country, post.postid)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    <CardTitle className="mt-2 text-xl group-hover:text-primary transition-colors">
                                      {post.title}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="relative">
                                      <div className="absolute left-0 top-0 w-1 h-full bg-primary/30 rounded-full"></div>
                                      <p className="text-gray-700 pl-4 line-clamp-3">{post.excerpt}</p>
                                    </div>
                                  </CardContent>
                                  <CardFooter className="flex justify-between border-t pt-4 pb-4">
                                    <div className="flex gap-4 text-sm text-gray-500">
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleLikePost(post.country, post.postid, session?._id)}
                                        className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                                      >
                                        <Heart className="h-4 w-4 text-red-500" fill="red" /> {post.likes || 0}
                                      </motion.button>
                                    </div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-primary border-primary hover:bg-primary/10"
                                        onClick={() => handleViewFullPost(post)}
                                      >
                                        View Full Post <ChevronRight className="h-4 w-4 ml-1" />
                                      </Button>
                                    </motion.div>
                                  </CardFooter>
                                </Card>
                              </motion.div>
                            ))}
                          </motion.div>

                          {userPosts.length > visibleUserPosts && (
                            <motion.div
                              className="mt-8 text-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" onClick={handleLoadMoreUserPosts}>
                                  Load More Posts
                                </Button>
                              </motion.div>
                            </motion.div>
                          )}
                        </>
                      )}
                    </InnerTabsContent>
                  </InnerTabs>
                </TabsContent>

                {/* Country Information Tab */}
                <TabsContent value="countries" className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Visa Information by Country</h2>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {countries.map((country) => (
                      <CountryCard key={country.code} country={country} />
                    ))}
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Prop validation for ExperienceDetail component
ExperienceDetail.propTypes = {
  experience: PropTypes.shape({
    _id: PropTypes.string,
    postid: PropTypes.string,
    title: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    flag: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    likes: PropTypes.number,
    authorId: PropTypes.string,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
}
