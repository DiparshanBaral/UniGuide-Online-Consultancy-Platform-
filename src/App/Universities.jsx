import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ClipboardList,
  ArrowRight,
  Globe2,
  MapPin,
  Users,
  GraduationCap,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import API from "../api";
import { useNavigate } from "react-router-dom";
import Survey from "@/Components/Survey"; // Import the Survey component
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function Universities() {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [surveyResults, setSurveyResults] = useState([]); // State to store survey results
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  // Fetch top universities on initial render
  useEffect(() => {
    async function fetchUniversities() {
      try {
        const universityIds = [
          "679f24ec433497bd80eba141",
          "679f29fad87bd45d7aa40f3a",
          "679f2a47d87bd45d7aa40f3c",
          "679f2a92d87bd45d7aa40f3e",
        ];
        const requests = universityIds.map((id) =>
          API.get(`/universities/us/${id}`)
        );
        const responses = await Promise.all(requests);
        const data = responses.map((res) => res.data);
        setUniversities(data);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    }
    fetchUniversities();
  }, []);

  // Real-time search suggestions
  useEffect(() => {
    if (searchQuery.length > 0) {
      API.get("/universities/search", { params: { query: searchQuery } })
        .then((response) => {
          setSuggestions(response.data.slice(0, 5)); // Limit to 5 suggestions
        })
        .catch((error) => {
          console.error("Error fetching suggestions:", error);
        });
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Full search when "Find Universities" button is clicked
  const handleSearch = () => {
    if (searchQuery.length > 0) {
      API.get("/universities/find", { params: { query: searchQuery } })
        .then((response) => {
          setFilteredUniversities(response.data);
        })
        .catch((error) => {
          console.error("Error finding universities:", error);
        });
    }
  };

  // Handle survey submission
  const handleSurveySubmit = async (values) => {
    try {
      console.log("Survey values submitted:", values);

      // Format the acceptance rate range and graduation rate range for the backend
      const formattedValues = {
        ...values,
        acceptanceRateRange: values.acceptanceRate.join("-"),
        graduationRateRange: values.graduationRate.join("-"),
      };

      // Send the survey data to the backend
      const response = await API.post("/universities/survey", formattedValues);

      // Log the results from the backend
      console.log("Survey results:", response.data);

      // Update the state with the survey results
      setSurveyResults(response.data);
      setIsSurveyOpen(false); // Close the survey modal
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("An error occurred while submitting the survey. Please try again.");
    }
  };

  return (
    <div className="pt-[90px] px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* University Filter Section */}
        <section className="w-full py-7 md:py-7 lg:py-7">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Find Your Ideal University
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Use our advanced filtering system to discover universities that align with your
                  academic goals and preferences.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl mt-8 grid gap-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Field of Study" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="arts">Arts & Design</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
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
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search universities by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                    {suggestions.map((uni, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate(
                            `/universityprofile/${uni.country.toLowerCase()}/${uni._id}`
                          );
                          setSuggestions([]);
                        }}
                      >
                        {uni.name} ({uni.country})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Button className="w-full" size="lg" onClick={handleSearch}>
                Find Universities
              </Button>
            </div>
          </div>
        </section>

        {/* Display filtered universities */}
        {filteredUniversities.length > 0 && (
          <section className="mb-12 mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Matching Universities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredUniversities.map((university, index) => (
                <motion.div
                  key={university._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <CardHeader className="space-y-4 pb-4">
                      <div className="flex items-start gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0">
                          <img
                            src={university.image || "https://via.placeholder.com/150"}
                            alt={`${university.name} logo`}
                            className="h-full w-full rounded-lg object-cover"
                          />
                          <Badge variant="secondary" className="absolute -top-2 -right-2">
                            #{university.ranking || "N/A"}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg leading-tight">{university.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe2 className="h-4 w-4" />
                            {university.country}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {university.location}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {university.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="font-medium">Acceptance Rate</span>
                          </div>
                          <Badge variant="secondary" className="w-full justify-center">
                            {university.acceptanceRate}%
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            <span className="font-medium">Graduation Rate</span>
                          </div>
                          <Badge variant="secondary" className="w-full justify-center">
                            {university.graduationRate}%
                          </Badge>
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button
                          className="w-full text-white"
                          onClick={() =>
                            navigate(
                              `/universityprofile/${university.country.toLowerCase()}/${
                                university._id
                              }`
                            )
                          }
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Display survey results */}
        {surveyResults.length > 0 && (
          <section className="mb-12 mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Filtered Universities Based on Survey:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {surveyResults.map((university, index) => (
                <motion.div
                  key={university._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                    <CardHeader className="space-y-4 pb-4">
                      <div className="flex items-start gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0">
                          <img
                            src={university.image || "https://via.placeholder.com/150"}
                            alt={`${university.name} logo`}
                            className="h-full w-full rounded-lg object-cover"
                          />
                          <Badge variant="secondary" className="absolute -top-2 -right-2">
                            #{university.ranking || "N/A"}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg leading-tight">{university.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe2 className="h-4 w-4" />
                            {university.country}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {university.location}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {university.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="font-medium">Acceptance Rate</span>
                          </div>
                          <Badge variant="secondary" className="w-full justify-center">
                            {university.acceptanceRate}%
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            <span className="font-medium">Graduation Rate</span>
                          </div>
                          <Badge variant="secondary" className="w-full justify-center">
                            {university.graduationRate}%
                          </Badge>
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button
                          className="w-full text-white"
                          onClick={() =>
                            navigate(
                              `/universityprofile/${university.country.toLowerCase()}/${
                                university._id
                              }`
                            )
                          }
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}


        {/* University Survey Section */}
      <Dialog open={isSurveyOpen} onOpenChange={setIsSurveyOpen}>
        <DialogTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
              <CardHeader className="relative">
                <CardTitle className="text-2xl md:text-3xl text-center">
                  Find Your Perfect University Match
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4 text-center">
                <p className="text-muted-foreground">
                  Take our quick survey to discover universities that align perfectly with your
                  academic goals, interests, and preferences.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <ClipboardList className="h-12 w-12 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">5-Minute Survey</p>
                    <p className="text-sm text-muted-foreground">
                      Get personalized university recommendations
                    </p>
                  </div>
                </div>
                <Button size="lg" className="mt-4">
                  Take the Survey <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          {/* Add a hidden DialogTitle for accessibility */}
          <VisuallyHidden>
            <DialogTitle>University Survey</DialogTitle>
          </VisuallyHidden>

          <VisuallyHidden>
          {/* Add a DialogDescription for accessibility */}
          <DialogDescription>
            Complete this survey to get personalized university recommendations based on your
            preferences.
          </DialogDescription>
          </VisuallyHidden>

          {/* Pass the onSubmit handler to the Survey component */}
          <Survey onSubmit={handleSurveySubmit} />
        </DialogContent>
      </Dialog>


        {/* Top Universities Section */}
        <section className="mb-12 mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Top Universities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {universities.map((university, index) => (
              <motion.div
                key={university._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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
                          <MapPin className="h-4 w-4" />
                          {university.location}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {university.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="font-medium">Acceptance Rate</span>
                        </div>
                        <Badge variant="secondary" className="w-full justify-center">
                          {university.acceptanceRate}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span className="font-medium">Graduation Rate</span>
                        </div>
                        <Badge variant="secondary" className="w-full justify-center">
                          {university.graduationRate}%
                        </Badge>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button
                        className="w-full text-white"
                        onClick={() => navigate(`/universityprofile/us/${university._id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
        {/* Scroll or Button to See More */}
        <div className="text-center">
          <a href="/universitieslist">
            <button className="bg-gray-800 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-700 transition duration-300">
              See More Universities
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Universities;
