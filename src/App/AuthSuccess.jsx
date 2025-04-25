import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { sessionAtom } from '@/atoms/session';
import { toast } from 'sonner';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSession] = useAtom(sessionAtom);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionData = queryParams.get('data');
    
    if (sessionData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(sessionData));
        
        // Save session data
        localStorage.setItem('session', JSON.stringify(parsedData));
        
        // Update session state
        setSession(parsedData);
        
        // Show success message
        toast.success(`Welcome, ${parsedData.firstname} ${parsedData.lastname}!`);
        
        // Redirect based on role
        if (parsedData.role === 'admin') {
          navigate('/admin/');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error parsing session data:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [location.search, navigate, setSession]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}