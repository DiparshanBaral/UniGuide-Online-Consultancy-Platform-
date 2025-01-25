import HomeBanner from '../img/HomePageBanner.jpeg';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

function HomePage() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  // Scroll function for horizontal scrolling
  const scrollHorizontally = (distance) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: distance,
        behavior: 'smooth',
      });
    }
  };

  // Placeholder data for universities (replace this with fetched data later)
  const universities = [
    {
      id: 1,
      name: 'University of Example 1',
      description: 'A world-class institution offering diverse programs.',
      image: 'https://via.placeholder.com/250x150',
      link: '/universities/example1',
    },
    {
      id: 2,
      name: 'University of Example 2',
      description: 'Leading research institution known for innovation.',
      image: 'https://via.placeholder.com/250x150',
      link: '/universities/example2',
    },
    {
      id: 3,
      name: 'University of Example 3',
      description: 'Renowned for academic excellence and student support.',
      image: 'https://via.placeholder.com/250x150',
      link: '/universities/example3',
    },
    {
      id: 4,
      name: 'University of Example 4',
      description: 'Global leader in technology and research.',
      image: 'https://via.placeholder.com/250x150',
      link: '/universities/example4',
    },
    {
      id: 5,
      name: 'University of Example 5',
      description: 'Top-ranked for business and entrepreneurship.',
      image: 'https://via.placeholder.com/250x150',
      link: '/universities/example5',
    },
    {
      id: 6,
      name: 'University of Example 6',
      description: 'Innovative programs tailored to student success.',
      image: 'https://via.placeholder.com/250x150',
      link: '/universities/example6',
    },
  ];

  return (
    <div className="pt-[90px] px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section
          className="relative mb-16 h-[450px] bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${HomeBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black opacity-60 rounded-lg"></div>
          <div className="relative z-10 flex justify-center items-center h-full">
            <div className="text-center text-white">
              <h2 className="text-4xl sm:text-5xl font-semibold mb-4 text-cyan-50">
                Find the Right University, Mentor &amp; Resources
              </h2>
              <p className="text-lg mb-6 text-cyan-50">
                Empowering students to achieve academic excellence with personalized guidance.
              </p>
              <div className="flex justify-center">
                <button
                  className="bg-gray-900 text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-700 transition duration-300"
                  onClick={() => navigate('/universities')}
                >
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
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex space-x-6 overflow-x-auto no-scrollbar scroll-smooth py-4"
            >
              {universities.map((university) => (
                <div
                  key={university.id}
                  className="flex-shrink-0 w-60 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 scroll-snap-center"
                >
                  <img
                    src={university.image}
                    alt={university.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {university.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{university.description}</p>
                  <a
                    href={university.link}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    View University
                  </a>
                </div>
              ))}
            </div>
            {/* Navigation Buttons */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-700 transition duration-300"
              onClick={() => scrollHorizontally(-300)}
            >
              &#8249;
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-700 transition duration-300"
              onClick={() => scrollHorizontally(300)}
            >
              &#8250;
            </button>
          </div>
        </section>

        {/* Explore More Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Discover More Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Discussion Rooms Link */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Join Discussion Rooms</h3>
              <p className="text-gray-600 mb-4">
                Engage with peers, mentors, and experts in various academic discussion rooms.
              </p>
              <a className="text-blue-600 font-medium hover:underline"
              onClick={() => navigate('/discussionrooms')}
              >
                Explore Now
              </a>
            </div>

            {/* Visa Information Link */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Visa Information</h3>
              <p className="text-gray-600 mb-4">
                Access visa-related resources, experiences, and country-specific details to plan
                your journey.
              </p>
              <a className="text-blue-600 font-medium hover:underline"
              onClick={() => navigate('/visasection')}
              >
                Explore Now
              </a>
            </div>

            {/* About Us Link */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Learn More About Us</h3>
              <p className="text-gray-600 mb-4">
                Discover who we are, our mission, and how we can help you achieve your academic
                goals.
              </p>
              <a className="text-blue-600 font-medium hover:underline"
              onClick={() => navigate('/aboutus')}
              >
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
