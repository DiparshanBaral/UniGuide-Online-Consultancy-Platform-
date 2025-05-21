"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import PropTypes from "prop-types"
import { Button } from "@/Components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Card, CardContent } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { toast } from "sonner"
import {
  GraduationCap,
  MapPin,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Trophy,
  Users,
  BookOpen,
  DollarSign,
  ArrowLeft,
} from "lucide-react"
import API from "../api"

// Stat Card Component with Props Validation
const StatCard = ({ title, value, icon, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="p-3 rounded-full bg-primary/10 text-primary">{icon}</div>
      </div>
    </motion.div>
  )
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  delay: PropTypes.number,
}

// Info Section Component with Props Validation
const InfoSection = ({ title, children, delay, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay || 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${className || ""}`}
    >
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
    </motion.div>
  )
}

InfoSection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
  className: PropTypes.string,
}

// Mentor Card Component with Props Validation
const MentorCard = ({ mentor, index }) => {
  return (
    <motion.div
      key={mentor._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 group relative overflow-hidden border-0 bg-white dark:bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <img
              src={mentor.profilePic || "https://via.placeholder.com/150"}
              alt={`${mentor.firstname} ${mentor.lastname} Profile`}
              className="h-16 w-16 rounded-full border-2 border-primary/20 shadow-md object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {mentor.firstname} {mentor.lastname}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2">{mentor.bio}</p>
              <p className="text-muted-foreground text-sm mt-1">
                <span className="text-primary font-medium">{mentor.yearsOfExperience}</span> years of experience
              </p>
            </div>
            <Link to={`/mentorprofile/${mentor._id}`}>
              <Button variant="outline" className="rounded-full">
                Visit Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

MentorCard.propTypes = {
  mentor: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    profilePic: PropTypes.string,
    bio: PropTypes.string,
    yearsOfExperience: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
}

const UniversityProfile = () => {
  const { country, universityId } = useParams()
  const [university, setUniversity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMentor, setIsMentor] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [document, setDocument] = useState(null)
  const [description, setDescription] = useState("")
  const [expectedFee, setExpectedFee] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [session, setSession] = useState(null)
  const [mentors, setMentors] = useState([])

  // Fetch session data from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem("session")
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession)
      setSession(parsedSession)
      setIsMentor(parsedSession.role === "mentor")
    }
  }, [])

  // Fetch mentors through mentorid
  useEffect(() => {
    const fetchMentors = async () => {
      if (university && university.affiliatedMentors && university.affiliatedMentors.length > 0) {
        try {
          const mentorPromises = university.affiliatedMentors.map((mentorId) => API.get(`/mentor/${mentorId}`))

          const mentorResponses = await Promise.all(mentorPromises)
          const fetchedMentors = mentorResponses.map((response) => response.data)
          setMentors(fetchedMentors)
        } catch (error) {
          console.error("Error fetching mentor information:", error)
        }
      }
    }

    fetchMentors()
  }, [university])

  // Format currency helper
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)

  // Fetch university data from the backend
  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await API.get(`/universities/${country}/${universityId}`)
        setUniversity(response.data)
      } catch (error) {
        console.error("Error fetching university data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUniversity()
  }, [country, universityId])

  const handleFileChange = (e) => {
    setDocument(e.target.files[0])
  }

  const handleApply = async () => {
    if (!document || !description || !expectedFee || !currency) {
      toast.error("Please fill all required fields")
      return
    }

    if (!session || !session._id || !session.token) {
      toast.error("You must be logged in as a mentor to apply.")
      return
    }

    const formData = new FormData()
    formData.append("document", document)
    formData.append("mentorId", session._id)
    formData.append("universityId", university._id)
    formData.append("universityLocation", university.country)
    formData.append("description", description)
    formData.append("expectedConsultationFee", expectedFee)
    formData.append("currency", currency)

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session.token}`,
        },
      }
      const response = await API.post("/affiliations/apply", formData, config)
      toast.success(response.data.message)
      setShowModal(false)
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred")
    }
  }

  const handleAddToWishlist = async () => {
    if (!session || !session.token) {
      toast.error("You must be logged in to add to wishlist.")
      return
    }

    try {
      const response = await API.post(
        "/student/wishlist",
        { universityId, country: country.toUpperCase() },
        { headers: { Authorization: `Bearer ${session.token}` } },
      )

      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to wishlist")
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )

  if (!university)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-4">University not found</h2>
        <Link to="/universitieslist">
          <Button>Back to Universities</Button>
        </Link>
      </div>
    )

  return (
    <div className="mt-[30px] min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with Image */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl">
          <div className="absolute inset-0">
            <img
              src={university.image || "/placeholder.svg"}
              alt={`${university.name} Campus`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
          </div>

          <div className="relative z-10 p-8 sm:p-12 md:p-16 text-white">
            <div className="max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4"
              >
                {university.name}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 text-white/80 mb-6"
              >
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{university.location}</span>
              </motion.div>

              <div className="flex flex-wrap gap-3">
                {isMentor ? (
                  <Button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary/90">
                    Apply for Affiliation
                  </Button>
                ) : (
                  <Button onClick={handleAddToWishlist} className="bg-primary hover:bg-primary/90">
                    Add to Wishlist
                  </Button>
                )}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <a href={university.website} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Affiliated Mentors Section - Moved to top as requested */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Affiliated Mentors</h2>
          {mentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mentors.map((mentor, index) => (
                <MentorCard key={mentor._id} mentor={mentor} index={index} />
              ))}
            </div>
          ) : (
            <Card className="bg-white dark:bg-gray-800 p-6">
              <p className="text-muted-foreground text-center py-8">
                No affiliated mentors available for this university yet.
              </p>
            </Card>
          )}
        </div>

        {/* Key Stats */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="World Ranking"
            value={`#${university.ranking}`}
            icon={<Trophy className="h-6 w-6" />}
            delay={0.3}
          />
          <StatCard
            title="Acceptance Rate"
            value={`${university.acceptanceRate}%`}
            icon={<Users className="h-6 w-6" />}
            delay={0.4}
          />
          <StatCard
            title="Graduation Rate"
            value={`${university.graduationRate}%`}
            icon={<GraduationCap className="h-6 w-6" />}
            delay={0.5}
          />
          <StatCard
            title="Programs Offered"
            value={university.coursesOffered.length}
            icon={<BookOpen className="h-6 w-6" />}
            delay={0.6}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* About / Description */}
          <InfoSection title="About" delay={0.7}>
            <p className="text-muted-foreground leading-relaxed">{university.description}</p>
          </InfoSection>

          {/* Contact Information */}
          <InfoSection title="Contact Information" delay={0.8}>
            <div className="space-y-4">
              {university.contact.phone && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span>{university.contact.phone}</span>
                </div>
              )}
              {university.contact.email && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <a href={`mailto:${university.contact.email}`} className="hover:text-primary transition-colors">
                    {university.contact.email}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Globe className="h-5 w-5" />
                </div>
                <a
                  href={university.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {university.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            </div>
          </InfoSection>

          {/* Programs Offered */}
          <InfoSection title="Programs Offered" delay={0.9}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {university.coursesOffered.map((course) => (
                <div
                  key={course}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span>{course}</span>
                </div>
              ))}
            </div>
          </InfoSection>

          {/* Tuition Fees */}
          <InfoSection title="Tuition Fees" delay={1}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <span>Undergraduate</span>
                </div>
                <span className="font-bold text-lg">{formatCurrency(university.tuitionFee.undergraduate)}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <span>Graduate</span>
                </div>
                <span className="font-bold text-lg">{formatCurrency(university.tuitionFee.graduate)}</span>
              </div>
              <p className="text-sm text-muted-foreground italic mt-2">* Tuition fees are per academic year</p>
            </div>
          </InfoSection>
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-8"
        >
          <Link to="/universitieslist">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Universities
            </Button>
          </Link>
        </motion.div>

        {/* Dialog for Apply for Affiliation */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Apply for Affiliation with {university.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <p className="text-muted-foreground">
                Please upload your graduate certificate or relevant credentials that demonstrate your qualifications.
                This may include transcripts, certifications, or other professional documents.
              </p>

              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>

              <Textarea
                placeholder="Briefly describe your qualifications and reasons for applying."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Expected Consultation Fee *</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={expectedFee}
                    onChange={(e) => setExpectedFee(e.target.value)}
                    placeholder="Enter your expected fee"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This fee will be split with the platform (80/20 split)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency *</label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                      <SelectItem value="NRS">NRS (रू)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleApply}>Submit Application</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default UniversityProfile
