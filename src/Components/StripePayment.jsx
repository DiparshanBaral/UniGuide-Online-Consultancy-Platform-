// components/Payment.jsx
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import { toast } from 'sonner';
import PropTypes from 'prop-types';

// Load Stripe from environment variable
const stripePromise = loadStripe(
  'pk_test_51RHio74ZEqRzgnT8Rx8vNGIUhGqBUvlWZCHqHmm3Dlifvu8EchzqTRqJcf5EU50SURXqoRscyB74n7n4LgI2BmlM00uO4xi8Zu',
);

// Add this helper function at the top of your component file
const normalizeCurrency = (currency) => {
  const currencyMap = {
    'nrs': 'npr',
    'rs': 'inr',
    'rupee': 'inr',
    'rupees': 'inr'
  };
  
  const normalized = (currency || '').toLowerCase();
  return currencyMap[normalized] || normalized;
};

// Inner Payment Form Component
const CheckoutForm = ({ connectionId, mentor, feeDetails }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not loaded. Please try again.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Step 1: Create Payment Intent on Backend
      const { data } = await API.post('/payment/create-payment-intent', {
        connectionId,
        // Pass the fee details to the backend
        fee: feeDetails.fee,
        currency: feeDetails.currency,
      });

      const { clientSecret, payment_uuid } = data;

      // Step 2: Confirm Payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      } 
      
      if (paymentIntent.status === 'succeeded') {
        // Step 3: Confirm Payment on Backend
        await API.post('/payment/change-payment-status', { payment_uuid });
        setSuccess(true);
        toast.success('Payment successful!');
        
        // Redirect to payments page after 2 seconds
        setTimeout(() => {
          navigate('/payments');
        }, 2000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.error || 'An error occurred while processing the payment.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-[100px] max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-center">Pay for Consultation</h3>
      <p className="text-gray-700 mb-6 text-center">
        Mentor:{' '}
        <span className="font-bold">
          {mentor.firstname} {mentor.lastname}
        </span>
      </p>
      <p className="text-gray-700 mb-6 text-center">
        Amount: <span className="font-bold">${feeDetails.fee} {feeDetails.currency}</span>
      </p>

      {/* Card Input */}
      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700">Card Details:</span>
        <CardElement className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </label>

      {/* Error Message */}
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      {/* Success Message or Pay Button */}
      {success ? (
        <div className="text-green-500 text-center font-medium">Payment Successful! Redirecting...</div>
      ) : (
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      )}
      
      {/* Test card info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs text-gray-500">
        <p className="font-medium mb-1">Test Card Information:</p>
        <p>Card Number: 4242 4242 4242 4242</p>
        <p>Expiry: Any future date (MM/YY)</p>
        <p>CVC: Any 3 digits</p>
      </div>
    </form>
  );
};

CheckoutForm.propTypes = {
  connectionId: PropTypes.string.isRequired,
  mentor: PropTypes.shape({
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
  }).isRequired,
  feeDetails: PropTypes.shape({
    fee: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
  }).isRequired,
};

// Main Payment Component
const Payment = () => {
  const { connectionId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [feeDetails, setFeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const session = JSON.parse(localStorage.getItem('session')) || null;

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Connection ID:', connectionId);

        // Fetch connection data
        const { data: connectionData } = await API.get(`/connections/specificConnection`, {
          params: { connectionId },
          headers: { Authorization: `Bearer ${session.token}` },
        });

        console.log('Connection data:', connectionData);

        if (!connectionData?.mentorId) {
          setError('Mentor details not found.');
          setLoading(false);
          return;
        }

        setMentor(connectionData.mentorId);

        // Fetch negotiated fee details
        try {
          const { data: negotiationData } = await API.get(`/paymentnegotiation/mentor/${connectionData.mentorId._id}`, {
            headers: { Authorization: `Bearer ${session.token}` },
          });

          // Find the approved negotiation
          const approvedNegotiation = negotiationData.negotiations.find(
            neg => neg.status === 'mentor_approved' && neg.finalConsultationFee
          );

          if (approvedNegotiation) {
            setFeeDetails({
              fee: approvedNegotiation.finalConsultationFee,
              // Ensure currency is a valid Stripe currency code
              currency: normalizeCurrency(approvedNegotiation.currency)
            });
            console.log('Using negotiated fee:', approvedNegotiation.finalConsultationFee);
          } else {
            // Fall back to mentor's default fee
            setFeeDetails({
              fee: connectionData.mentorId.consultationFee,
              // Ensure currency is a valid Stripe currency code
              currency: normalizeCurrency(connectionData.mentorId.currency)
            });
            console.log('Using default fee:', connectionData.mentorId.consultationFee);
          }
        } catch (err) {
          console.error('Error fetching negotiation data:', err);
          console.log('No negotiation found, using default fee');
          setFeeDetails({
            fee: connectionData.mentorId.consultationFee,
            currency: connectionData.mentorId.currency
          });
        }
      } catch (err) {
        console.error('Error fetching connection data:', err);
        setError(err.response?.data?.error || 'Failed to fetch connection details.');
      } finally {
        setLoading(false);
      }
    };

    if (connectionId && session?.token) {
      fetchDetails();
    }
  }, [connectionId, session?.token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center font-medium min-h-[50vh] flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="text-red-500 text-center font-medium min-h-[50vh] flex items-center justify-center">
        Mentor information not found.
      </div>
    );
  }

  // Ensure only students can access this component
  if (session?.role !== 'student') {
    return (
      <div className="text-red-500 text-center font-medium min-h-[50vh] flex items-center justify-center">
        Only students can make payments.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        connectionId={connectionId} 
        mentor={mentor} 
        feeDetails={feeDetails} 
      />
    </Elements>
  );
};

export default Payment;
