import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header
      className="bg-white/30 backdrop-blur-md border-b shadow-sm z-50"
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <div className="flex items-center">
          <img src="./src/Img/logo.png" alt="UniGuide Logo" className="h-[75px] mr-3" />
          <h1 className="text-xl font-bold">UniGuide</h1>
        </div>

        {/* Navigation Links */}
        <nav>
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
      </div>
    </header>
  );
}

export default Navbar;
