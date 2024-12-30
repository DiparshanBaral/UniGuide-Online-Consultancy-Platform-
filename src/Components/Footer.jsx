function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            {/* About Section */}
            <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
              <h3 className="text-lg font-bold mb-2">About Uniguide</h3>
              <p className="text-sm text-gray-400">
                Uniguide is your go-to platform for online consultancy, helping students and mentors connect for a brighter future.
              </p>
            </div>
  
            {/* Quick Links Section */}
            <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
              <h3 className="text-lg font-bold mb-2">Quick Links</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li><a href="#" className="hover:underline">Home</a></li>
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">IELTS Section</a></li>
                <li><a href="#" className="hover:underline">Discussion Rooms</a></li>
                <li><a href="#" className="hover:underline">Contact Us</a></li>
              </ul>
            </div>
  
            {/* Contact Section */}
            <div className="w-full sm:w-1/3">
              <h3 className="text-lg font-bold mb-2">Contact Us</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>Email: support@uniguide.com</li>
                <li>Phone: +1 234 567 890</li>
                <li>Address: 123 Edu Lane, Learning City, ED 56789</li>
              </ul>
            </div>
          </div>
  
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Uniguide. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;