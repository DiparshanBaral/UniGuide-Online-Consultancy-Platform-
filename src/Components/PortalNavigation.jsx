import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, MessageCircle, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import API from '../api'; // Import your API utility
import logo from '@/assets/logo.png';

const PortalNavigation = ({ activeTab, setActiveTab }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const { portalid } = useParams(); // Get portalId from URL params

  // Fetch session data (portal details and associated user details)
  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        // Step 1: Fetch session from localStorage
        const savedSession = localStorage.getItem('session');
        if (!savedSession) {
          throw new Error('No session found');
        }
        const parsedSession = JSON.parse(savedSession);
        const token = parsedSession.token; // Extract token from session

        // Step 2: Fetch portal data using portalId
        const portalResponse = await API.get(`/portal/${portalid}`, {
          headers: { Authorization: `Bearer ${token}` }, // Include token for authentication
        });
        const portalData = portalResponse.data;

        // Step 3: Determine the role and extract user details
        let userDetails, otherUserDetails;
        if (parsedSession.role === 'mentor') {
          userDetails = portalData.mentorId; // Mentor details are already populated
          otherUserDetails = portalData.studentId; // Student details are the "other user"
        } else if (parsedSession.role === 'student') {
          userDetails = portalData.studentId; // Student details are already populated
          otherUserDetails = portalData.mentorId; // Mentor details are the "other user"
        }

        // Combine portal data, user details, and other user details into session
        setSession({
          ...parsedSession,
          ...portalData,
          name: `${userDetails.firstname} ${userDetails.lastname}`, // Current user's name
          profilePicture: userDetails.profilePic, // Current user's profile picture
          university: userDetails.university || userDetails.major, // Current user's university/major
          otherUser: {
            name: `${otherUserDetails.firstname} ${otherUserDetails.lastname}`, // Other user's name
            profilePicture: otherUserDetails.profilePic, // Other user's profile picture
            university: otherUserDetails.university, // Other user's university (for mentors)
            major: otherUserDetails.major, // Other user's major (for students)
          },
        });

      } catch (error) {
        console.error('Error fetching portal or user details:', error.response?.data || error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPortalData();
  }, [portalid]);

  // If still loading, show a placeholder
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // If session is null, show an error message
  if (!session) {
    return <div className="text-center text-red-500">Failed to load session details.</div>;
  }

  // Determine the portal title and profile link based on the session role
  const portalTitle = session?.role === 'mentor' ? 'Mentor Portal' : 'Student Portal';
  const profileLink = session?.role === 'mentor'
    ? `/publicstudentprofile/${session?.studentId?._id}` // Mentor sees student's public profile
    : `/mentorprofile/${session?.mentorId?._id}`; // Student sees mentor's profile

  return (
    <aside className="sticky top-0 left-0 w-64 bg-white shadow-lg rounded-lg p-4 h-screen overflow-y-auto">
      {/* Logo and Portal Title */}
      <div className="flex items-center justify-center mb-6 space-x-4">
        {/* UniGuide Logo */}
        <img
          src={logo}
          alt="UniGuide Logo"
          className="h-24 w-auto" // Make the logo twice its current size
        />
        {/* Portal Title */}
        <h2 className="text-xl font-bold text-primary">{portalTitle}</h2>
      </div>

      {/* Profile Card */}
      {session && (
        <Link
          to={profileLink} // Dynamically set the profile link based on the role
          className="block bg-gray-100 rounded-lg p-4 mb-6 hover:bg-gray-200 transition-colors"
        >
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <img
              src={session?.otherUser?.profilePicture || '/default-avatar.png'} // Use the other user's profile picture or a default avatar
              alt={`${session?.otherUser?.name}'s profile`}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              {/* Name */}
              <p className="font-semibold text-gray-800">{session?.otherUser?.name}</p>
              {/* University or Major */}
              <p className="text-sm text-gray-600">
                {session?.role === 'mentor'
                  ? session?.otherUser?.major // Display major for students
                  : session?.otherUser?.university}
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* Navigation Buttons */}
      <nav className="space-y-4">
        <Button
          variant={activeTab === 'tasks' ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={() => setActiveTab('tasks')}
        >
          <CheckCircle className="mr-2 h-5 w-5" /> Tasks
        </Button>
        <Button
          variant={activeTab === 'chat' ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={() => setActiveTab('chat')}
        >
          <MessageCircle className="mr-2 h-5 w-5" /> Chat
        </Button>
        <Button
          variant={activeTab === 'documents' ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={() => setActiveTab('documents')}
        >
          <FileText className="mr-2 h-5 w-5" /> Documents
        </Button>
      </nav>

      {/* Back Button */}
      <div className="mt-8">
        <Button
          variant="secondary"
          className="w-full justify-center flex items-center gap-2"
          onClick={() => window.history.back()} // Go back to the previous page
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>
    </aside>
  );
};

// Props Validation
PortalNavigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default PortalNavigation;