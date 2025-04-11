import PropTypes from "prop-types"; // Import PropTypes
import { Star } from "lucide-react";

const RatingStars = ({ rating = 0, size = "md" }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} fill-yellow-400 text-yellow-400`}
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <div className="relative">
          <Star className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} text-yellow-400`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} fill-yellow-400 text-yellow-400`} />
          </div>
        </div>
      )}

      {/* Empty stars */}
      {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={`empty-${i}`} className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} text-yellow-400`} />
      ))}
    </div>
  );
};

// Add prop validation
RatingStars.propTypes = {
  rating: PropTypes.number, // rating must be a number (optional, defaults to 0)
  size: PropTypes.oneOf(["sm", "md"]), // size must be either "sm" or "md" (optional, defaults to "md")
};

// Default props for optional props
RatingStars.defaultProps = {
  rating: 0, // Default rating is 0
  size: "md", // Default size is "md"
};

export default RatingStars;