import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { sessionAtom } from '@/atoms/session';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSession] = useAtom(sessionAtom);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionData = queryParams.get('data');
    const errorParam = queryParams.get('error');

    if (errorParam) {
      setError(errorParam);
      toast.error('Authentication failed. Please try again.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (!sessionData) {
      setError('No session data received');
      toast.error('Authentication failed. No session data received.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    try {
      const parsedData = JSON.parse(decodeURIComponent(sessionData));

      if (!parsedData || !parsedData.token) {
        throw new Error('Invalid session data');
      }

      // Save session data
      localStorage.setItem('session', JSON.stringify(parsedData));

      // Update session state
      setSession(parsedData);

      // Show success message
      toast.success(`Welcome, ${parsedData.firstname || 'User'}!`);

      // Redirect based on role
      navigate('/');
    } catch (error) {
      console.error('Error parsing session data:', error);
      setError(error.message);
      toast.error('Authentication failed. Please try again.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [location.search, navigate, setSession]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Authentication Failed</h1>
          <p className="text-muted-foreground">
            {error === 'No session data received' 
              ? 'No authentication data was received. Please try again.' 
              : 'There was a problem with your authentication. Please try again.'}
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <h1 className="text-2xl font-bold">Authenticating</h1>
          <p className="text-muted-foreground">Please wait while we complete your authentication...</p>
        </div>
      )}
    </div>
  );
}