import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Badge } from "@/Components/ui/badge"
import { Search, ClipboardList, ArrowRight, Globe2, MapPin, Users, GraduationCap, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { motion } from "framer-motion"
import API from "../api"
import { useNavigate } from "react-router-dom"
import Survey from "@/Components/Survey"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/Components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import NoUniversities from "@/Components/ui/no-university"

// University Card Component with prop validation
const UniversityCard = ({ university, index, navigate, country }) => {
  return (
    <motion.div
      key={university._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 group relative overflow-hidden border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 flex-shrink-0">
              <img
                src={university.image || "https://via.placeholder.com/150"}
                alt={`${university.name} logo`}
                className="h-full w-full rounded-lg object-cover border border-gray-100 shadow-sm"
              />
              {university.ranking && (
                <Badge
                  variant="secondary"
                  className={`absolute -top-2 -right-2 shadow-sm ${
                    university.ranking <= 100
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : university.ranking <= 500
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  #{university.ranking || "N/A"}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {university.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Globe2 className="h-3.5 w-3.5" />
                {university.country}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                {university.location || "Location not available"}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-3">{university.description || "No description available."}</p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-sm">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">Acceptance</span>
              </div>
              <Badge
                variant="secondary"
                className={`w-full justify-center ${
                  university.acceptanceRate <= 20
                    ? "bg-red-100 text-red-800 border-red-100"
                    : university.acceptanceRate <= 50
                      ? "bg-amber-100 text-amber-800 border-amber-100"
                      : "bg-green-100 text-green-800 border-green-100"
                }`}
              >
                {university.acceptanceRate}%
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-sm">
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">Graduation</span>
              </div>
              <Badge
                variant="secondary"
                className={`w-full justify-center ${
                  university.graduationRate <= 50
                    ? "bg-red-100 text-red-800 border-red-100"
                    : university.graduationRate <= 75
                      ? "bg-amber-100 text-amber-800 border-amber-100"
                      : "bg-green-100 text-green-800 border-green-100"
                }`}
              >
                {university.graduationRate}%
              </Badge>
            </div>
          </div>

          <div className="pt-4">
            <Button
              className="w-full group-hover:bg-primary/90 transition-colors"
              onClick={() => navigate(`/universityprofile/${country}/${university._id}`)}
            >
              View Details
              <ChevronRight className="ml-1 h-4 w-4 opacity-70" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Prop validation for UniversityCard
UniversityCard.propTypes = {
  university: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    country: PropTypes.string,
    location: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    ranking: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    acceptanceRate: PropTypes.number,
    graduationRate: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
  navigate: PropTypes.func.isRequired,
  country: PropTypes.string.isRequired,
}

function Universities() {
  const navigate = useNavigate()
  const [universities, setUniversities] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [filteredUniversities, setFilteredUniversities] = useState([])
  const [surveyResults, setSurveyResults] = useState([]) // State to store survey results
  const [isSurveyOpen, setIsSurveyOpen] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [surveySubmitted, setSurveySubmitted] = useState(false)

  // Add these state variables at the top of your component
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedFieldOfStudy, setSelectedFieldOfStudy] = useState("")
  const [selectedBudgetRange, setSelectedBudgetRange] = useState("")

  const resetFilters = () => {
    setSelectedCountry("")
    setSelectedFieldOfStudy("")
    setSelectedBudgetRange("")
    setSearchQuery("")
    setSearchPerformed(false)
    setFilteredUniversities([])
  }

  // Fetch top universities on initial render
  useEffect(() => {
    async function fetchUniversities() {
      try {
        const universityIds = [
          "679f24ec433497bd80eba141",
          "679f29fad87bd45d7aa40f3a",
          "679f2a47d87bd45d7aa40f3c",
          "679f2a92d87bd45d7aa40f3e",
        ]
        const requests = universityIds.map((id) => API.get(`/universities/us/${id}`))
        const responses = await Promise.all(requests)
        const data = responses.map((res) => res.data)
        setUniversities(data)
      } catch (error) {
        console.error("Error fetching universities:", error)
      }
    }
    fetchUniversities()
  }, [])

  // Real-time search suggestions
  useEffect(() => {
    if (searchQuery.length > 0) {
      API.post("/universities/search", { query: searchQuery }) // Send query in the body
        .then((response) => {
          setSuggestions(response.data.slice(0, 5)) // Limit to 5 suggestions
        })
        .catch((error) => {
          console.error("Error fetching suggestions:", error)
        })
    } else {
      setSuggestions([])
    }
  }, [searchQuery])

  // Full search when "Find Universities" button is clicked
  const handleSearch = () => {
    setSearchPerformed(true)

    // Create a search payload with all filters
    const searchPayload = {
      query: searchQuery || "a", // Send "a" as a default query if searchQuery is empty
      country: selectedCountry,
      fieldOfStudy: selectedFieldOfStudy,
      budgetRange: selectedBudgetRange,
    }

    API.post("/universities/find", searchPayload)
      .then((response) => {
        setFilteredUniversities(response.data)
      })
      .catch((error) => {
        console.error("Error finding universities:", error)
      })
  }

  // Handle survey submission
  const handleSurveySubmit = (results) => {
    setSurveySubmitted(true) // Mark that the survey has been submitted
    setSurveyResults(results) // Update survey results
    setIsSurveyOpen(false) // Close the survey dialog
  }

  return (
    <div className="pt-[90px] px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* University Filter Section - UNCHANGED */}
        <section className="w-full py-7 md:py-7 lg:py-7">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Find Your Ideal University</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Use our advanced filtering system to discover universities that align with your academic goals and
                  preferences.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl mt-8 grid gap-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Select onValueChange={(value) => setSelectedCountry(value)}>
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
                <Select onValueChange={(value) => setSelectedFieldOfStudy(value)}>
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
                <Select onValueChange={(value) => setSelectedBudgetRange(value)}>
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
                          navigate(`/universityprofile/${uni.country.toLowerCase()}/${uni._id}`)
                          setSuggestions([])
                        }}
                      >
                        {uni.name} ({uni.country})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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

        {/* Display filtered universities - UPDATED CARDS */}
        {searchPerformed && filteredUniversities.length === 0 && <NoUniversities />}
        {filteredUniversities.length > 0 && (
          <section className="mb-12 mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Matching Universities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredUniversities.map((university, index) => (
                <UniversityCard
                  key={university._id}
                  university={university}
                  index={index}
                  navigate={navigate}
                  country={university.country.toLowerCase()}
                />
              ))}
            </div>
          </section>
        )}

        {/* University Survey Section - UNCHANGED */}
        <Dialog open={isSurveyOpen} onOpenChange={setIsSurveyOpen}>
          <DialogTrigger asChild>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
                <CardHeader className="relative">
                  <CardTitle className="text-2xl md:text-3xl text-center">Find Your Perfect University Match</CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-4 text-center">
                  <p className="text-muted-foreground">
                    Take our quick survey to discover universities that align perfectly with your academic goals,
                    interests, and preferences.
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <ClipboardList className="h-12 w-12 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Survey</p>
                      <p className="text-sm text-muted-foreground">Get personalized university recommendations</p>
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
                Complete this survey to get personalized university recommendations based on your preferences.
              </DialogDescription>
            </VisuallyHidden>

            {/* Pass the onSubmit handler to the Survey component */}
            <Survey
              onSubmit={handleSurveySubmit}
              onClose={() => setIsSurveyOpen(false)} // Close the dialog
            />
          </DialogContent>
        </Dialog>

        {/* Display survey results - UPDATED CARDS */}
        {surveySubmitted && surveyResults.length === 0 && <NoUniversities />}
        {surveyResults.length > 0 && (
          <section className="mb-12 mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Filtered Universities Based on Survey:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {surveyResults.map((university, index) => (
                <UniversityCard
                  key={university._id}
                  university={university}
                  index={index}
                  navigate={navigate}
                  country={university.country.toLowerCase()}
                />
              ))}
            </div>
          </section>
        )}

        {/* Top Universities Section - UPDATED CARDS */}
        <section className="mb-12 mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Top Universities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {universities.map((university, index) => (
              <UniversityCard
                key={university._id}
                university={university}
                index={index}
                navigate={navigate}
                country="us"
              />
            ))}
          </div>
        </section>

        {/* Updated "See All Universities" button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="gap-1.5 px-8 border-gray-300 hover:bg-gray-50"
            onClick={() => navigate("/universitieslist")}
          >
            See All Universities
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Prop validation for Survey component
Survey.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default Universities
