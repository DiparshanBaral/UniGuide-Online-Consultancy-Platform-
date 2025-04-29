import { useState } from "react"
import PropTypes from "prop-types"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ArrowLeft, Calendar, User, Heart, Share2, Trash2, Edit } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { Card } from "@/Components/ui/card"

// Define prop types for the component
const ExperienceDetail = ({ experience, onBack, onLike, onDelete }) => {
  const [isLiking, setIsLiking] = useState(false)

  // Format date helper function
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      console.log(error)
      return dateString
    }
  }

  // Handle like button click
  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)
    try {
      await onLike(experience.country, experience.postid)
    } finally {
      setIsLiking(false)
    }
  }

  // Handle delete button click
  const handleDelete = () => {
    if (onDelete) {
      onDelete(experience.country, experience.postid)
      onBack() // Go back after deletion
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {/* Back button */}
        <Button variant="ghost" className="mb-6 hover:bg-gray-100" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Experiences
        </Button>

        <Card className="overflow-hidden border-2 shadow-lg">
          {/* Header */}
          <div className="bg-black text-white p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="px-2 py-1 bg-white text-black">
                {experience.flag} {experience.country}
              </Badge>
              <span className="text-sm text-gray-300 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {formatDate(experience.date)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-4">{experience.title}</h1>

            <div className="flex items-center">
              <div className="bg-white rounded-full p-1 mr-2">
                <User className="h-4 w-4 text-black" />
              </div>
              <span className="text-gray-300">By {experience.author.name}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{experience.excerpt}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-6 sm:p-8 flex justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors"
              >
                <Heart className="h-5 w-5 text-red-500" fill="red" />
                <span>{experience.likes || 0} Likes</span>
              </button>

              <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors">
                <Share2 className="h-5 w-5" /> Share
              </button>
            </div>

            {onDelete && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Edit className="h-4 w-4" /> Edit
                </Button>
                <Button variant="destructive" size="sm" className="flex items-center gap-1" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Related experiences section could be added here */}
      </motion.div>
    </div>
  )
}

// Prop validation
ExperienceDetail.propTypes = {
  experience: PropTypes.shape({
    flag: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    likes: PropTypes.number,
    postid: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
}

export default ExperienceDetail