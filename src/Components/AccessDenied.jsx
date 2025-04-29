import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CircleDollarSign, ShieldAlert } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import PropTypes from 'prop-types';

const AccessDenied = ({ connectionId, mentorName, redirectPath = '/payments' }) => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [countdown, setCountdown] = useState(10);
  
  // If connectionId wasn't passed as prop, try to get it from URL params
  const resolvedConnectionId = connectionId || params.connectionId;
  // Try to get mentorName from location state if not provided as prop
  const resolvedMentorName = mentorName || (location.state?.mentorName || 'your mentor');

  useEffect(() => {
    // Auto-redirect after countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate(redirectPath);
    }
  }, [countdown, navigate, redirectPath]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-red-50 p-6 flex justify-center">
          <ShieldAlert className="h-24 w-24 text-red-500" />
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Access Denied
          </h2>
          
          <div className="space-y-4 text-center mb-6">
            <p className="text-gray-600">
              You cannot access the portal with <span className="font-semibold">{resolvedMentorName}</span> until payment is completed.
            </p>
            <p className="text-gray-600">
              Please complete your payment to unlock full access to your mentor portal and consultation services.
            </p>
            <div className="text-sm text-gray-500 italic">
              You will be redirected to the payments page in {countdown} seconds.
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={() => navigate(resolvedConnectionId ? `/payments/${resolvedConnectionId}` : '/payments')}
            >
              <CircleDollarSign className="mr-2 h-4 w-4" />
              Pay Now
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/studentdashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add PropTypes validation
AccessDenied.propTypes = {
  connectionId: PropTypes.string,
  mentorName: PropTypes.string,
  redirectPath: PropTypes.string
};

// Add default props
AccessDenied.defaultProps = {
  redirectPath: '/payments'
};

export default AccessDenied;