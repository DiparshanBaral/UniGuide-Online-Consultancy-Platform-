import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useAtom } from 'jotai';
import { sessionAtom } from '@/atoms/session';
import API from "../api";

function Navbar() {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [session, setSession] = useAtom(sessionAtom);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Memoize fetchUserData with useCallback
  const fetchUserData = useCallback(
    async (userId, token, role) => {
      try {
        setIsFetchingUser(true);
  
        // Determine the API endpoint based on user role
        const endpoint = role === 'mentor' ? `/mentor/${userId}` : `/student/${userId}`;
  
        // Use API.get instead of fetch
        const response = await API.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Update session only if data has changed
        setSession((prevSession) => {
          if (JSON.stringify(prevSession) !== JSON.stringify(response.data)) {
            return response.data;
          }
          return prevSession;
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch user data. Please try again.');
      } finally {
        setIsFetchingUser(false);
      }
    },
    [setSession]
  );
  

  // Fetch user data when session changes
  useEffect(() => {
    if (session && session._id && session.token) {
      fetchUserData(session._id, session.token); // Fetch user data based on session info
    } else {
      setIsFetchingUser(false); // No session, just stop fetching user data
    }
  }, [session, fetchUserData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdown(false); // Close the dropdown
      }
    };

    // Add event listener when the dropdown is open
    if (profileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdown]);

  const handleLogout = () => {
    setSession(null); // Clear session atom
    localStorage.removeItem('session'); // Clear localStorage
    setProfileDropdown(false); // Close the dropdown
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (isFetchingUser) {
    return <div>Loading...</div>;
  }

  return (
    <header className="bg-[rgba(230,233,238,0.6)] backdrop-blur-2xl fixed w-full border-b shadow-sm z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <div className="flex items-center ml-10">
          <img src="./src/Img/logo.png" alt="UniGuide Logo" className="h-[75px] mr-2" />
          <h1 className="text-xl font-bold">UniGuide</h1>
        </div>

        {/* Navigation Links */}
        <nav className="absolute left-1/2 transform -translate-x-1/2">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/universities" className="hover:underline">
                Universities
              </Link>
            </li>
            <li>
              <Link to="/discussionrooms" className="hover:underline">
                Discussion Rooms
              </Link>
            </li>
            <li>
              <Link to="/visasection" className="hover:underline">
                Visa Section
              </Link>
            </li>
            <li>
              <Link to="/aboutus" className="hover:underline">
                About Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Profile Portal */}
        <div className="relative mr-16" ref={dropdownRef}>
          {session ? (
            <>
              <button
                className="flex items-center"
                onClick={() => setProfileDropdown(!profileDropdown)}
              >
                <img
                  src={'./src/Img/profile.png'}
                  alt="Profile"
                  className="h-10 w-10 rounded-full border border-gray-300 object-cover"
                />
              </button>
              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md py-2">
                  {/* User Info Section (Clickable Link) */}
                  <Link
                    to={session?.role === 'mentor' ? '/mentorprofile' : '/profile'}
                    className="block px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setProfileDropdown(false)} // Close dropdown on click
                  >
                    <p className="font-bold text-gray-800 text-base">
                      {session?.firstname} {session?.lastname}
                    </p>
                    <p className="text-xs text-blue-500 hover:text-blue-600 transition-colors duration-200">
                      View your profile<span className="ml-1">→</span>
                    </p>
                  </Link>

                  {/* Dashboard Link */}
                  <Link
                    to={session?.role === 'mentor' ? '/mentordashboard' : '/studentdashboard'}
                    className="block px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setProfileDropdown(false)}
                  >
                    <p className="text-gray-800 font-medium">Dashboard</p>
                  </Link>

                  {/* Logout Button */}
                  <button
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" className="text-sm font-medium text-gray-700 hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
