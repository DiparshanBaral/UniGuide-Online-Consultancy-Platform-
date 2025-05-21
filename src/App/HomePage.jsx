import { useEffect, useState, useRef } from 'react';
import { Globe2, Users, MessageCircle, Stamp, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle} from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import API from '../api';
import { motion } from 'framer-motion';
import { Separator } from "@/Components/ui/separator";

function HomePage() {
  const navigate = useNavigate();
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedFieldOfStudy, setSelectedFieldOfStudy] = useState('');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUniversities, setFilteredUniversities] = useState([]); // Store filtered results
  const dropdownRef = useRef(null);

  // Real-time search suggestions
  useEffect(() => {
    if (searchQuery.length > 0) {
      API.post('/universities/search', { query: searchQuery, country: selectedCountry })
        .then((response) => {
          setSuggestions(response.data.slice(0, 5)); // Limit to 5 suggestions
          setShowDropdown(true); // Show dropdown when suggestions are fetched
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error);
        });
    } else {
      setSuggestions([]);
      setShowDropdown(false); // Hide dropdown if query is empty
    }
  }, [searchQuery, selectedCountry]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false); // Hide dropdown if clicked outside
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add resetFilters function similar to Universities.jsx
  const resetFilters = () => {
    setSelectedCountry('');
    setSelectedFieldOfStudy('');
    setSelectedBudgetRange('');
    setSearchQuery('');
    setFilteredUniversities([]);
    setShowDropdown(false);
  };

  // Update handleSearch to match Universities.jsx implementation
  const handleSearch = () => {
    // Create a search payload with all filters
    const searchPayload = {
      query: searchQuery || "a", // Send "a" as a default query if searchQuery is empty
      country: selectedCountry,
      fieldOfStudy: selectedFieldOfStudy,
      budgetRange: selectedBudgetRange
    };
    
    API.post('/universities/find', searchPayload)
      .then((response) => {
        setFilteredUniversities(response.data);
        setShowDropdown(false); // Hide dropdown after search
      })
      .catch((error) => {
        console.error('Error finding universities:', error);
      });
  };

  return (
    <div className="pt-[90px] px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section
          className="relative mb-5 h-[450px] bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url('./src/assets/HomePageBanner.jpeg')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black opacity-60 rounded-lg"></div>
          <div className="relative z-10 flex justify-center items-center h-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center text-white"
            >
              <h2 className="text-4xl sm:text-5xl font-semibold mb-4 text-cyan-50">
                Find the Right University, Mentor &amp; Resources
              </h2>
              <p className="text-lg mb-6 text-cyan-50">
                Empowering students to achieve academic excellence with personalized guidance.
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center"
              >
                <Button
                  className="py-3 px-8 rounded-lg font-medium hover:bg-gray-700 transition duration-300"
                  onClick={() => navigate('/universities')}
                >
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* University Filter Section */}
        <section className="w-full py-9 md:py-7 lg:py-7">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Find Your Perfect University Match
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Use our advanced filtering system to discover universities that align with your
                  academic goals and preferences.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl mt-8 grid gap-4">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Country Dropdown */}
                <Select value={selectedCountry} onValueChange={(value) => setSelectedCountry(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                  </SelectContent>
                </Select>

                {/* Field of Study Dropdown */}
                <Select value={selectedFieldOfStudy} onValueChange={(value) => setSelectedFieldOfStudy(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Field of Study" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Arts">Arts & Design</SelectItem>
                  </SelectContent>
                </Select>

                {/* Budget Range Dropdown */}
                <Select value={selectedBudgetRange} onValueChange={(value) => setSelectedBudgetRange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Budget Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">$10k - $20k</SelectItem>
                    <SelectItem value="medium">$20k - $35k</SelectItem>
                    <SelectItem value="high">$35k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Input */}
              <div className="relative" ref={dropdownRef}>
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search universities by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)} 
                  className="pl-8"
                />
                {showDropdown && suggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                    {suggestions.map((uni, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate(`/universityprofile/${uni.country.toLowerCase()}/${uni._id}`);
                          setSuggestions([]);
                          setShowDropdown(false);
                        }}
                      >
                        {uni.name} ({uni.country})
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Button className="flex-1" size="lg" onClick={handleSearch}>
                  Find Universities
                </Button>
                {(searchQuery || selectedCountry || selectedFieldOfStudy || selectedBudgetRange) && (
                  <Button variant="outline" size="lg" onClick={resetFilters}>
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Display Filtered Universities */}
        {filteredUniversities.length > 0 && (
          <section className="mb-12 mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Matching Universities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredUniversities.map((university) => (
                <Card key={university._id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <img
                          src={university.image || 'https://via.placeholder.com/150'}
                          alt={`${university.name} logo`}
                          className="h-full w-full rounded-lg object-cover"
                        />
                        <Badge variant="secondary" className="absolute -top-2 -right-2">
                          #{university.ranking || 'N/A'}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg leading-tight">{university.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Globe2 className="h-4 w-4" />
                          {university.country}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          Acceptance Rate: {university.acceptanceRate}%
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {university.description}
                    </p>
                    <Button
                      className="w-full text-white"
                      onClick={() =>
                        navigate(`/universityprofile/${university.country.toLowerCase()}/${university._id}`)
                      }
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          )}

        {/* Explore More Section */}
        <section className="mb-16 py-12">
          <h2 className="text-3xl font-semibold text-foreground mb-8">Discover More Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Discussion Rooms Link */}
            <Card className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground mb-4">
                  Join Discussion Rooms
                </CardTitle>
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
                <CardTitle className="text-xl font-semibold text-foreground mb-4">
                  Visa Information
                </CardTitle>
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
                <CardTitle className="text-xl font-semibold text-foreground mb-4">
                  Learn More About Us
                </CardTitle>
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

        <Separator />

        {/* Stats Section */}
        <section className="w-full py-12 md:py-12 lg:py-12">
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
