function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-start gap-y-4">
          {/* About Section with Logo */}
          <div className="w-1/4 mb-6 ml-12 sm:mb-0 flex flex-col items-start">
            <div className="flex items-center mb-4">
              <img src="./src/Img/logo.png" alt="UniGuide Logo" className="h-[75px] mr-2" />
              <h1 className="text-lg font-bold">UniGuide</h1>
            </div>
            <p className="text-sm text-gray-400 ml-5">
              UniGuide is your trusted platform for online consultancy, bridging the gap between
              students and mentors to empower educational journeys. Explore opportunities and plan
              your academic future with ease.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="w-1/4 mb-6 sm:mb-0">
            <h3 className="text-lg font-bold mb-2">Quick Links</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/aboutus" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="/ielts" className="hover:underline">
                  IELTS Section
                </a>
              </li>
              <li>
                <a href="/discussion" className="hover:underline">
                  Discussion Rooms
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="w-1/4">
            <h3 className="text-lg font-bold mb-2">Contact Us</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>Email: support@uniguide.com</li>
              <li>Phone: +977 9818601909</li>
              <li>Address: P86J+W8X, Kathmandu 44600</li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} UniGuide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
