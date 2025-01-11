import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

function Navbar() {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session) {
      fetchUserData(session._id);
    }
  }, []);

  const fetchUserData = async () => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session) {
      try {
        const response = await fetch(`http://localhost:5000/users/${session._id}`, {
          headers: {
            Authorization: `Bearer ${session.token}`, // Ensure token is sent
          },
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const userData = await response.json();
        setIsLoggedIn(true);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to fetch user data.');
      }
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
              <Link to="/aboutus" className="hover:underline">
                About Us
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
              <Link to="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Profile Portal */}
        <div className="relative mr-16">
          {isLoggedIn ? (
            <>
              <button
                className="flex items-center"
                onClick={() => setProfileDropdown(!profileDropdown)}
              >
                <img
                  src={user?.profilePicture || '../Img/default_profile.png'} // Replace with actual user profile picture path
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
