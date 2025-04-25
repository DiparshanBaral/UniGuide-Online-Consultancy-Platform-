import PropTypes from 'prop-types';
import { AlertCircle, DollarSign, Clock } from 'lucide-react';

const EmptyState = ({ type, message }) => (
  <div className="text-center py-8">
    {type === 'payments' ? (
      <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
    ) : type === 'negotiations' ? (
      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
    ) : (
      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
    )}
    <h3 className="text-lg font-medium mb-2">No {type} found</h3>
    <p className="text-gray-500">{message}</p>
  </div>
);

EmptyState.propTypes = {
  type: PropTypes.oneOf(['payments', 'negotiations', 'all']).isRequired,
  message: PropTypes.string.isRequired
};

export default EmptyState;