"use client"

import { useEffect, useState } from "react"
import API from "../api"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/Components/ui/card"
import { Globe2, MapPin, Users, GraduationCap, Search, X, Dna, SlidersHorizontal, ChevronUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { useNavigate } from "react-router-dom"
import { Input } from "@/Components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Slider } from "@/Components/ui/slider"

const UniversitiesList = () => {
  const navigate = useNavigate()
  const [showFilters, setShowFilters] = useState(false)

  // Initial state with country keys
  const [universities, setUniversities] = useState({
    US: [],
    UK: [],
    Canada: [],
    Australia: [],
  })

  const [filteredUniversities, setFilteredUniversities] = useState({
    US: [],
    UK: [],
    Canada: [],
    Australia: [],
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [activeCountry, setActiveCountry] = useState("US")
  const [filters, setFilters] = useState({
    acceptanceRate: [0, 100],
    graduationRate: [0, 100],
    ranking: "all",
  })

  useEffect(() => {
  // Define countries inside the effect
  const countriesToFetch = ["us", "uk", "canada", "australia"]
  
  const fetchUniversities = async () => {
    const data = {}
    for (const country of countriesToFetch) {
      try {
        const response = await API.get(`/universities/${country}`)
        data[country.toUpperCase()] = response.data
      } catch (error) {
        console.error(`Error fetching ${country} universities:`, error)
        data[country.toUpperCase()] = []
      }
    }
    setUniversities(data)
    setFilteredUniversities(data)
  }
  fetchUniversities()
}, [])

  // Apply filters and search
  useEffect(() => {
    const applyFiltersAndSearch = () => {
      const result = {}

      Object.entries(universities).forEach(([country, list]) => {
        result[country] = list.filter((uni) => {
          // Search filter
          const matchesSearch =
            searchQuery === "" ||
            uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (uni.location && uni.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (uni.description && uni.description.toLowerCase().includes(searchQuery.toLowerCase()))

          // Acceptance rate filter
          const matchesAcceptanceRate =
            uni.acceptanceRate >= filters.acceptanceRate[0] && uni.acceptanceRate <= filters.acceptanceRate[1]

          // Graduation rate filter
          const matchesGraduationRate =
            uni.graduationRate >= filters.graduationRate[0] && uni.graduationRate <= filters.graduationRate[1]

          // Ranking filter
          const matchesRanking =
            filters.ranking === "all" ||
            (filters.ranking === "top50" && uni.ranking && uni.ranking <= 50) ||
            (filters.ranking === "top100" && uni.ranking && uni.ranking > 50 && uni.ranking <= 100) ||
            (filters.ranking === "top150" && uni.ranking && uni.ranking > 100 && uni.ranking <= 150) ||
            (filters.ranking === "top200" && uni.ranking && uni.ranking > 150 && uni.ranking <= 200) ||
            (filters.ranking === "top250" && uni.ranking && uni.ranking > 200 && uni.ranking <= 250) ||
            (filters.ranking === "top300" && uni.ranking && uni.ranking > 250 && uni.ranking <= 300)

          return matchesSearch && matchesAcceptanceRate && matchesGraduationRate && matchesRanking
        })
      })

      setFilteredUniversities(result)
    }

    applyFiltersAndSearch()
  }, [searchQuery, filters, universities])

  const handleTabChange = (value) => {
    setActiveCountry(value)
  }

  const resetFilters = () => {
    setFilters({
      acceptanceRate: [0, 100],
      graduationRate: [0, 100],
      ranking: "all",
    })
    setSearchQuery("")
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  // Count active filters
  const activeFiltersCount =
    (filters.ranking !== "all" ? 1 : 0) +
    (filters.acceptanceRate[0] > 0 || filters.acceptanceRate[1] < 100 ? 1 : 0) +
    (filters.graduationRate[0] > 0 || filters.graduationRate[1] < 100 ? 1 : 0)

  return (
    <div className="container mx-auto pt-[90px] px-4 md:px-6 lg:px-8 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Universities Explorer</h1>
          <p className="text-muted-foreground mt-1">Discover top universities around the world</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search universities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleFilters}
            className="relative"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-card rounded-lg border p-4 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filters</h3>
            <Button variant="ghost" size="sm" onClick={toggleFilters} className="h-8 w-8 p-0">
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ranking Filter */}
            <div>
              <label className="text-sm font-medium block mb-1.5">Ranking</label>
              <Select value={filters.ranking} onValueChange={(value) => setFilters({ ...filters, ranking: value })}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select ranking" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rankings</SelectItem>
                  <SelectItem value="top50">Top 50</SelectItem>
                  <SelectItem value="top100">51-100</SelectItem>
                  <SelectItem value="top150">101-150</SelectItem>
                  <SelectItem value="top200">151-200</SelectItem>
                  <SelectItem value="top250">201-250</SelectItem>
                  <SelectItem value="top300">251-300</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Acceptance Rate Filter */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium">Acceptance Rate</label>
                <span className="text-xs text-muted-foreground">
                  {filters.acceptanceRate[0]}% - {filters.acceptanceRate[1]}%
                </span>
              </div>
              <Slider
                value={filters.acceptanceRate}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setFilters({ ...filters, acceptanceRate: value })}
                className="py-0.5"
              />
            </div>

            {/* Graduation Rate Filter */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium">Graduation Rate</label>
                <span className="text-xs text-muted-foreground">
                  {filters.graduationRate[0]}% - {filters.graduationRate[1]}%
                </span>
              </div>
              <Slider
                value={filters.graduationRate}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setFilters({ ...filters, graduationRate: value })}
                className="py-0.5"
              />
            </div>
          </div>

          {/* Active filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-xs text-muted-foreground">Active:</span>

              {filters.ranking !== "all" && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {filters.ranking === "top50"
                    ? "Top 50"
                    : filters.ranking === "top100"
                      ? "51-100"
                      : filters.ranking === "top150"
                        ? "101-150"
                        : filters.ranking === "top200"
                          ? "151-200"
                          : filters.ranking === "top250"
                            ? "201-250"
                            : "251-300"}
                  <button onClick={() => setFilters({ ...filters, ranking: "all" })} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {(filters.acceptanceRate[0] > 0 || filters.acceptanceRate[1] < 100) && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  Acceptance: {filters.acceptanceRate[0]}%-{filters.acceptanceRate[1]}%
                  <button onClick={() => setFilters({ ...filters, acceptanceRate: [0, 100] })} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {(filters.graduationRate[0] > 0 || filters.graduationRate[1] < 100) && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  Graduation: {filters.graduationRate[0]}%-{filters.graduationRate[1]}%
                  <button onClick={() => setFilters({ ...filters, graduationRate: [0, 100] })} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="ml-auto text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                Reset all
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Tabs for each country */}
      <Tabs defaultValue="US" value={activeCountry} onValueChange={handleTabChange} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            {Object.keys(universities).map((country) => (
              <TabsTrigger key={country} value={country} className="relative">
                {country}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {Object.entries(filteredUniversities).map(([country, list]) => (
          <TabsContent key={country} value={country}>
            {list.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {list.map((university) => (
                  <motion.div key={university._id} variants={itemVariants} className="h-full">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      <CardHeader className="space-y-4 pb-4">
                        <div className="flex items-start gap-4">
                          <div className="relative h-16 w-16 flex-shrink-0">
                            <img
                              src={university.image || "https://via.placeholder.com/150"}
                              alt={`${university.name} logo`}
                              className="h-full w-full rounded-lg object-cover"
                            />
                            {university.ranking && (
                              <Badge
                                variant="secondary"
                                className={`absolute -top-2 -right-2 ${
                                  university.ranking <= 100
                                    ? "bg-amber-100 text-amber-800"
                                    : university.ranking <= 500
                                      ? "bg-blue-100 text-blue-800"
                                      : ""
                                }`}
                              >
                                #{university.ranking}
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold text-lg leading-tight line-clamp-2">{university.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Globe2 className="h-4 w-4" />
                              {country}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {university.location || "Location not available"}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {university.description || "No description available."}
                          </p>

                          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-primary" />
                                <span className="font-medium">Acceptance</span>
                              </div>
                              <Badge
                                variant="secondary"
                                className={`w-full justify-center ${
                                  university.acceptanceRate <= 20
                                    ? "bg-red-100 text-red-800"
                                    : university.acceptanceRate <= 50
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {university.acceptanceRate}%
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                <span className="font-medium">Graduation</span>
                              </div>
                              <Badge
                                variant="secondary"
                                className={`w-full justify-center ${
                                  university.graduationRate <= 50
                                    ? "bg-red-100 text-red-800"
                                    : university.graduationRate <= 75
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {university.graduationRate}%
                              </Badge>
                            </div>
                          </div>

                          <div className="pt-4">
                            <Button
                              className="w-full"
                              onClick={() => navigate(`/universityprofile/${country.toLowerCase()}/${university._id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <Dna className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No universities found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default UniversitiesList
