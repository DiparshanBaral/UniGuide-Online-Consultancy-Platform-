import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const [profileDropdown, setProfileDropdown] = useState(false);

  return (
    <header className="bg-[rgba(209,213,219,0.6)] backdrop-blur-2xl fixed w-full border-b shadow-sm z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <div className="flex items-center ml-10">
          <img src="./src/Img/logo.png" alt="UniGuide Logo" className="h-[75px] mr-3" />
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
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/ielts" className="hover:underline">
                IELTS Section
              </Link>
            </li>
            <li>
              <Link to="/discussion" className="hover:underline">
                Discussion Rooms
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
          <button
            className="flex items-center"
            onClick={() => setProfileDropdown(!profileDropdown)}
          >
            <img
              src="./src/Img/default-profile.png" // Temporary placeholder for profile image
              alt="Profile"
              className="h-10 w-10 rounded-full border border-gray-300 object-cover"
            />
          </button>
          {profileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                View Your Profile
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  // Add logout functionality here
                  console.log("User logged out");
                  setProfileDropdown(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
