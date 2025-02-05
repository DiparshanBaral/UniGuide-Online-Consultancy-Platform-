import PropTypes from 'prop-types';

const CustomButton = ({ children, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-primary text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:bg-primary-dark ${className}`}
    >
      {children}
    </button>
  );
};

// Prop types validation
CustomButton.propTypes = {
  children: PropTypes.node.isRequired,  // Children should be any renderable React node (string, element, etc.)
  className: PropTypes.string,         // className should be a string (for custom styles)
  onClick: PropTypes.func.isRequired,  // onClick should be a function
};

export default CustomButton;