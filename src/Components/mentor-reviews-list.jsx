import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import RatingStars from "@/Components/ui/rating-stars"
import API from "../api"
import { toast } from "sonner"

const MentorReviewsList = ({ mentorId }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const session = JSON.parse(localStorage.getItem("session"))

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await API.get(`/review/${mentorId}`, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      })
      setReviews(response.data.reviews || [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast.error("Failed to load reviews.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mentorId && session?.token) {
      fetchReviews()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorId])

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>
  }

  return (
    <div className="space-y-6">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={review.studentId?.profilePic || "/placeholder.svg"}
                  alt={`${review.studentId?.firstname || ""} ${review.studentId?.lastname || ""}`}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {review.studentId?.firstname?.[0] || ""}
                  {review.studentId?.lastname?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    {review.studentId?.firstname} {review.studentId?.lastname}
                  </p>
                  <time className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <RatingStars rating={review.rating} size="sm" />
                <p className="text-muted-foreground mt-2">{review.review}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground">No reviews yet.</p>
      )}
    </div>
  )
}

// Prop validation
MentorReviewsList.propTypes = {
  mentorId: PropTypes.string.isRequired, // mentorId must be a string and is required
}

export default MentorReviewsList