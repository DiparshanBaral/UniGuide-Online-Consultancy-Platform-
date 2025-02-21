import PropTypes from 'prop-types';

const RatingStars = ({ rating }) => {
  const validRating = Number(rating) || 0; // Ensure it's always a number

  return (
    <div>
      <p>{validRating.toFixed(1)} Stars</p>
    </div>
  );
};

RatingStars.propTypes = {
  rating: PropTypes.number, // Ensure it expects a number
};

export default RatingStars;
