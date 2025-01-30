import PropTypes from 'prop-types';
import HomeBanner from '../img/HomePageBanner.jpeg';
import { Globe2, Users, MessageCircle, Stamp } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  // Button Component
  const Button = ({ className, children, onClick }) => (
    <button
      onClick={onClick}
      className={`bg-gray-900 text-white hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );

  // Prop Types for Button
  Button.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
  };

  // Input Component
  const Input = ({ className, ...props }) => (
    <input
      className={`border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-gray-800 p-4 rounded-lg shadow-sm transition-all duration-300 ${className}`}
      {...props}
    />
  );

  // Prop Types for Input
  Input.propTypes = {
    className: PropTypes.string,
  };

  // Card Component
  const Card = ({ className, children }) => (
    <div className={`bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}>
      {children}
    </div>
  );

  // Prop Types for Card
  Card.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired
  };

  // CardHeader, CardTitle, CardContent Components
  const CardHeader = ({ children }) => (
    <div className="bg-gray-100 p-4">
      {children}
    </div>
  );

  // Prop Types for CardHeader
  CardHeader.propTypes = {
    children: PropTypes.node.isRequired
  };

  const CardTitle = ({ children }) => (
    <h3 className="text-xl font-semibold text-foreground mb-4">{children}</h3>
  );

  // Prop Types for CardTitle
  CardTitle.propTypes = {
    children: PropTypes.node.isRequired
  };

  const CardContent = ({ children }) => (
    <div className="p-4">
      {children}
    </div>
  );

  // Prop Types for CardContent
  CardContent.propTypes = {
    children: PropTypes.node.isRequired
  };

  return (
    <div className="pt-[90px] px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-background text-foreground">
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
                <Button
                  className="py-3 px-8 rounded-lg font-medium hover:bg-gray-700 transition duration-300"
                  onClick={() => navigate('/universities')}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Find Your Ideal University, Mentor, or Course
            </h2>
            <p className="text-lg text-muted-foreground">
              Use our search tool to easily find universities, mentors, and courses tailored to your
              academic goals.
            </p>
          </div>

          <div className="flex justify-center items-center">
            <div className="relative w-full sm:w-2/3 md:w-1/2 flex">
              <Input
                type="text"
                placeholder="Search for Universities, Mentors, or Courses"
                className="w-full p-4 pl-12 pr-4 border border-gray-300 rounded-l-lg shadow-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition duration-300"
              />
              <Button className="py-4 px-6 rounded-r-lg font-medium hover:bg-gray-700 transition duration-300">
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Explore More Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-foreground mb-8">Discover More Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Discussion Rooms Link */}
            <Card className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground mb-4">Join Discussion Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Engage with peers, mentors, and experts in various academic discussion rooms.
                </p>
                <Button variant="link" onClick={() => navigate('/discussionrooms')}>
                  Explore Now
                </Button>
              </CardContent>
            </Card>

            {/* Visa Information Link */}
            <Card className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground mb-4">Visa Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access visa-related resources, experiences, and country-specific details to plan
                  your journey.
                </p>
                <Button variant="link" onClick={() => navigate('/visasection')}>
                  Explore Now
                </Button>
              </CardContent>
            </Card>

            {/* About Us Link */}
            <Card className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground mb-4">Learn More About Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Discover who we are, our mission, and how we can help you achieve your academic
                  goals.
                </p>
                <Button variant="link" onClick={() => navigate('/aboutus')}>
                  Read More
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
              <div className="flex flex-col items-center">
                <Globe2 className="text-4xl mb-2 text-blue-600" />
                <h4 className="text-xl font-semibold">Countries Supported</h4>
                <p className="text-2xl font-semibold text-gray-900">50+</p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="text-4xl mb-2 text-green-600" />
                <h4 className="text-xl font-semibold">Mentors</h4>
                <p className="text-2xl font-semibold text-gray-900">100+</p>
              </div>
              <div className="flex flex-col items-center">
                <MessageCircle className="text-4xl mb-2 text-yellow-600" />
                <h4 className="text-xl font-semibold">Discussion Rooms</h4>
                <p className="text-2xl font-semibold text-gray-900">20+</p>
              </div>
              <div className="flex flex-col items-center">
                <Stamp className="text-4xl mb-2 text-purple-600" />
                <h4 className="text-xl font-semibold">Success Stories</h4>
                <p className="text-2xl font-semibold text-gray-900">300+</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
