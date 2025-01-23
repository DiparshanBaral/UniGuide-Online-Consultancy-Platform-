import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

function Navbar() {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session) {
      setIsLoggedIn(true);
      fetchUserData(session._id, session.token); // Fetch user data based on session info
    } else {
      setIsLoggedIn(false);
      setIsFetchingUser(false); // No session, just stop fetching user data
    }
  }, []); // Empty dependency array means this effect runs only once (on mount)

  const fetchUserData = async (userId, token) => {
    try {
      setIsFetchingUser(true);
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use session token to authenticate the request
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const userData = await response.json();
      console.log('Fetched user data:', userData); // Debugging log
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data.');
    } finally {
      setIsFetchingUser(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('session');
    setIsLoggedIn(false);
    setUser(null);
    setProfileDropdown(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (isFetchingUser) {
    return <div>Loading...</div>; // Optionally, add a loading spinner or message
  }

  console.log('isLoggedIn:', isLoggedIn); // Debugging log
  console.log('user:', user); // Debugging log

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
        <div className="relative mr-16">
          {isLoggedIn && user ? (
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
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
                  <Link
                    to="/profile"
                    className="block px-4 font-bold py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {user?.firstname} {user?.lastname}
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
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
