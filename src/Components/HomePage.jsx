import HomeBanner from '../img/HomePageBanner.jpeg';

function HomePage() {
  return (
    <div className="pt-[90px] px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with Background Image */}
        <section
          className="relative mb-16 h-[450px] bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${HomeBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black opacity-60 rounded-lg"></div>
          <div className="relative z-10 flex justify-center items-center h-full">
            <div className="text-center text-white">
              <h2 className="text-4xl sm:text-5xl font-semibold mb-4 text-cyan-50">
                Find the Right University, Mentor & Resources
              </h2>
              <p className="text-lg mb-6 text-cyan-50">
                Empowering students to achieve academic excellence with personalized guidance.
              </p>
              <div className="flex justify-center">
                <button className="bg-gray-900 text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-700 transition duration-300">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4">
              Find Your Ideal University, Mentor, or Course
            </h2>
            <p className="text-lg text-gray-600">
              Use our search tool to easily find universities, mentors, and courses tailored to your
              academic goals.
            </p>
          </div>

          <div className="flex justify-center items-center">
            <div className="relative w-full sm:w-2/3 md:w-1/2 flex">
              <input
                type="text"
                placeholder="Search for Universities, Mentors, or Courses"
                className="w-full p-4 pl-12 pr-4 border border-gray-300 rounded-l-lg shadow-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition duration-300"
              />
              <button className="bg-gray-800 text-white py-4 px-6 rounded-r-lg font-medium hover:bg-gray-700 transition duration-300">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Top Universities Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Top Universities</h2>
          <div className="flex overflow-x-auto space-x-6">
            {/* Example of University Cards */}
            <div className="flex-shrink-0 w-60 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <img
                src="https://via.placeholder.com/250x150"
                alt="University 1"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">University of Example 1</h3>
              <p className="text-gray-600 mb-4">
                A world-class institution offering diverse programs.
              </p>
              <a
                href="/universities/example1"
                className="text-blue-600 font-medium hover:underline"
              >
                View University
              </a>
            </div>

            {/* Example 2 */}
            <div className="flex-shrink-0 w-60 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <img
                src="https://via.placeholder.com/250x150"
                alt="University 2"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">University of Example 2</h3>
              <p className="text-gray-600 mb-4">
                Leading research institution known for innovation.
              </p>
              <a
                href="/universities/example2"
                className="text-blue-600 font-medium hover:underline"
              >
                View University
              </a>
            </div>
          </div>
        </section>

        {/* Explore More Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Discover More Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Discussion Rooms Link */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-800 mr-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path d="M2 12l9 9 9-9M12 3v18" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Join Discussion Rooms</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Engage with peers, mentors, and experts in various academic discussion rooms.
              </p>
              <a href="/discussion-rooms" className="text-blue-600 font-medium hover:underline">
                Explore Now
              </a>
            </div>

            {/* Visa Information Link */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-800 mr-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path d="M2 12l9 9 9-9M12 3v18" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Visa Information</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Access visa-related resources, experiences, and country-specific details to plan
                your journey.
              </p>
              <a href="/visa-section" className="text-blue-600 font-medium hover:underline">
                Explore Now
              </a>
            </div>

            {/* About Us Link */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-800 mr-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path d="M12 4v16m8-8H4" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Learn More About Us</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Discover who we are, our mission, and how we can help you achieve your academic
                goals.
              </p>
              <a href="/about" className="text-blue-600 font-medium hover:underline">
                Read More
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
