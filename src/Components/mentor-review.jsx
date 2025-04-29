import { useState } from "react"
import { toast } from "sonner"
import PropTypes from "prop-types" // Import PropTypes
import { Button } from "@/Components/ui/button"
import { Textarea } from "@/Components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Star } from "lucide-react"
import API from "../api"

const MentorReview = ({ mentorId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const session = JSON.parse(localStorage.getItem("session"))

  const handleSubmitReview = async () => {
    if (!session || !session.token) {
      toast.error("You must be logged in to submit a review.")
      return
    }

    if (rating === 0) {
      toast.error("Please select a rating.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await API.post(
        "/review",
        {
          mentorId,
          studentId: session._id,
          rating,
          review,
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        },
      )

      if (response.status === 201) {
        toast.success("Review submitted successfully!")
        setRating(0)
        setReview("")
        if (onReviewSubmitted) {
          onReviewSubmitted()
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error(error.response?.data?.message || "An error occurred while submitting the review.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Your Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-yellow-400"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="review" className="text-sm font-medium">
            Your Review
          </label>
          <Textarea
            id="review"
            placeholder="Share your experience with this mentor..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="resize-none min-h-[120px] border-primary/20 focus-visible:ring-primary/30"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmitReview} disabled={isSubmitting || rating === 0} className="ml-auto">
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Prop validation
MentorReview.propTypes = {
  mentorId: PropTypes.string.isRequired, // mentorId must be a string and is required
  onReviewSubmitted: PropTypes.func, // onReviewSubmitted is optional and must be a function
}

export default MentorReview