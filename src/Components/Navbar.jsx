import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useAtom } from 'jotai';
import { sessionAtom } from '@/atoms/session';

function Navbar() {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [session, setSession] = useAtom(sessionAtom);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Memoize fetchUserData with useCallback
  const fetchUserData = useCallback(async (userId, token) => {
    try {
      setIsFetchingUser(true);
  
      // Debugging: Log the token and userId
      console.log('Fetching user data with userId:', userId);
      console.log('Using token:', token);
  
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Debugging: Log the response status
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        // Handle specific error statuses
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again.');
        } else if (response.status === 404) {
          throw new Error('User not found.');
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }
  
      const userData = await response.json();
      console.log('Fetched user data:', userData);
  
      // Update session only if data has changed
      setSession((prevSession) => {
        if (JSON.stringify(prevSession) !== JSON.stringify(userData)) {
          return userData;
        }
        return prevSession; // No change, return previous session
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error(error.message || 'Failed to fetch user data. Please try again.');
    } finally {
      setIsFetchingUser(false);
    }
  }, [setSession]);

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
    <header className="bg-[rgba(209,213,219,0.6)] backdrop-blur-2xl fixed w-full border-b shadow-sm z-50">
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
                    to="/profile"
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