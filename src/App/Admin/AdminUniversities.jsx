"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import API from "@/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Building2,
  Search,
  Plus,
  FileText,
  Globe,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Percent,
  DollarSign,
  Trash2,
  Edit,
  Eye,
  Filter,
  ArrowUpDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminUniversities() {
  const [universities, setUniversities] = useState([])
  const [filteredUniversities, setFilteredUniversities] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUniversity, setSelectedUniversity] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" })

  const [form, setForm] = useState({
    country: "",
    name: "",
    location: "",
    ranking: "",
    coursesOffered: [],
    contact: {
      phone: "",
      email: "",
    },
    website: "",
    description: "",
    tuitionFee: { undergraduate: "", graduate: "" },
    acceptanceRate: "",
    graduationRate: "",
  })

  // Fetch universities data
  useEffect(() => {
    const fetchUniversities = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch from your API
        // For now, we'll simulate with mock data
        const countries = ["us", "uk", "canada", "australia"]
        let allUniversities = []

        for (const country of countries) {
          try {
            const response = await API.get(`/universities/${country}`)
            if (response.data && Array.isArray(response.data)) {
              allUniversities = [...allUniversities, ...response.data]
            }
          } catch (error) {
            console.error(`Error fetching ${country} universities:`, error)
          }
        }

        setUniversities(allUniversities)
        setFilteredUniversities(allUniversities)
      } catch (error) {
        console.error("Error fetching universities:", error)
        toast.error("Failed to load universities")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUniversities()
  }, [])

  // Filter universities based on search query and selected country
  useEffect(() => {
    let filtered = [...universities]

    if (selectedCountry !== "all") {
      filtered = filtered.filter((uni) => uni.country.toLowerCase() === selectedCountry.toLowerCase())
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (uni) => uni.name.toLowerCase().includes(query) || uni.location.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredUniversities(filtered)
  }, [universities, searchQuery, selectedCountry, sortConfig])

  const handleSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const openAddModal = () => {
    setForm({
      country: "",
      name: "",
      location: "",
      ranking: "",
      coursesOffered: [],
      contact: { phone: "", email: "" },
      website: "",
      description: "",
      tuitionFee: { undergraduate: "", graduate: "" },
      acceptanceRate: "",
      graduationRate: "",
    })
    setModalOpen(true)
  }

  const openViewModal = (university) => {
    setSelectedUniversity(university)
    setViewModalOpen(true)
  }

  const openEditModal = (university) => {
    setSelectedUniversity(university)
    setForm({
      country: university.country || "",
      name: university.name || "",
      location: university.location || "",
      ranking: university.ranking || "",
      coursesOffered: university.coursesOffered || [],
      contact: {
        phone: university.contact?.phone || "",
        email: university.contact?.email || "",
      },
      website: university.website || "",
      description: university.description || "",
      tuitionFee: {
        undergraduate: university.tuitionFee?.undergraduate || "",
        graduate: university.tuitionFee?.graduate || "",
      },
      acceptanceRate: university.acceptanceRate || "",
      graduationRate: university.graduationRate || "",
    })
    setEditModalOpen(true)
  }

  const openDeleteModal = (university) => {
    setSelectedUniversity(university)
    setDeleteModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post("/universities/add", form)
      toast.success("University added successfully!")
      setModalOpen(false)

      // Refresh the universities list
      const response = await API.get(`/universities/${form.country.toLowerCase()}`)
      if (response.data && Array.isArray(response.data)) {
        setUniversities((prev) => [
          ...prev,
          ...response.data.filter((uni) => !prev.some((existingUni) => existingUni._id === uni._id)),
        ])
      }
    } catch (error) {
      console.error("Error adding university:", error)
      toast.error("An error occurred. Please try again.")
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await API.put(`/universities/${selectedUniversity.country.toLowerCase()}/${selectedUniversity._id}`, form)
      toast.success("University updated successfully!")
      setEditModalOpen(false)

      // Update the university in the local state
      setUniversities((prev) => prev.map((uni) => (uni._id === selectedUniversity._id ? { ...uni, ...form } : uni)))
    } catch (error) {
      console.error("Error updating university:", error)
      toast.error("An error occurred. Please try again.")
    }
  }

  const handleDelete = async () => {
    try {
      await API.delete(`/universities/${selectedUniversity.country.toLowerCase()}/${selectedUniversity._id}`)
      toast.success("University deleted successfully!")
      setDeleteModalOpen(false)

      // Remove the university from the local state
      setUniversities((prev) => prev.filter((uni) => uni._id !== selectedUniversity._id))
    } catch (error) {
      console.error("Error deleting university:", error)
      toast.error("An error occurred. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Universities</h1>
          <p className="text-muted-foreground">Manage university information and listings</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add University
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle>Universities List</CardTitle>
          <CardDescription>View and manage all universities in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[120px]">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Top Ranked</DropdownMenuItem>
                <DropdownMenuItem>Highest Acceptance Rate</DropdownMenuItem>
                <DropdownMenuItem>Lowest Tuition</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredUniversities.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No universities found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="rounded-md border w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("country")}>
                        Country
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("ranking")}>
                        Ranking
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("acceptanceRate")}>
                        Acceptance Rate
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUniversities.map((university) => (
                    <TableRow key={university._id}>
                      <TableCell className="font-medium">{university.name}</TableCell>
                      <TableCell>{university.country}</TableCell>
                      <TableCell>
                        {university.ranking ? (
                          <Badge variant="outline">#{university.ranking}</Badge>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {university.acceptanceRate ? (
                          `${university.acceptanceRate}%`
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openViewModal(university)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(university)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => openDeleteModal(university)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add University Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl mx-auto p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Building2 className="h-5 w-5 mr-2 text-primary" />
              Add New University
            </DialogTitle>
            <DialogDescription>Fill in the details below to add a new university to the system.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Basic Information
                </h3>
                <Separator />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">Country</label>
                <Select value={form.country} onValueChange={(value) => setForm({ ...form, country: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">University Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Harvard University"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Cambridge, Massachusetts"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  Global Ranking
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 1"
                  value={form.ranking}
                  onChange={(e) => setForm({ ...form, ranking: e.target.value })}
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 flex items-center">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Courses Offered
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Computer Science, Business, Medicine (comma separated)"
                  value={form.coursesOffered.join(", ")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      coursesOffered: e.target.value.split(",").map((course) => course.trim()),
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-4 col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Information
                </h3>
                <Separator />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  Phone Number
                </label>
                <Input
                  type="text"
                  placeholder="e.g. +1 (123) 456-7890"
                  value={form.contact.phone}
                  onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="e.g. admissions@university.edu"
                  value={form.contact.email}
                  onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })}
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  Website
                </label>
                <Input
                  type="url"
                  placeholder="e.g. https://www.university.edu"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>

              <div className="space-y-4 col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Additional Information
                </h3>
                <Separator />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 flex items-center">Description</label>
                <Textarea
                  placeholder="Brief description of the university..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Undergraduate Tuition Fee ($)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  value={form.tuitionFee.undergraduate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tuitionFee: { ...form.tuitionFee, undergraduate: e.target.value },
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Graduate Tuition Fee ($)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 60000"
                  value={form.tuitionFee.graduate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tuitionFee: { ...form.tuitionFee, graduate: e.target.value },
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Percent className="h-3 w-3 mr-1" />
                  Acceptance Rate (%)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  value={form.acceptanceRate}
                  onChange={(e) => setForm({ ...form, acceptanceRate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Percent className="h-3 w-3 mr-1" />
                  Graduation Rate (%)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 95"
                  value={form.graduationRate}
                  onChange={(e) => setForm({ ...form, graduationRate: e.target.value })}
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-8">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add University</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View University Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-3xl mx-auto p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Building2 className="h-5 w-5 mr-2 text-primary" />
              University Details
            </DialogTitle>
          </DialogHeader>

          {selectedUniversity && (
            <div className="mt-4 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={selectedUniversity.image || "/placeholder.svg?height=200&width=300"}
                    alt={selectedUniversity.name}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
                <div className="md:w-2/3 space-y-4">
                  <h2 className="text-2xl font-bold">{selectedUniversity.name}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {selectedUniversity.location}, {selectedUniversity.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="h-4 w-4" />
                    <span>Global Ranking: #{selectedUniversity.ranking || "N/A"}</span>
                  </div>
                  <p className="text-muted-foreground">{selectedUniversity.description}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{selectedUniversity.contact?.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{selectedUniversity.contact?.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <a
                        href={selectedUniversity.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {selectedUniversity.website || "N/A"}
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Acceptance Rate:</span>
                      <Badge variant="outline">{selectedUniversity.acceptanceRate}%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Graduation Rate:</span>
                      <Badge variant="outline">{selectedUniversity.graduationRate}%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Undergraduate Tuition:</span>
                      <Badge variant="outline">
                        ${Number(selectedUniversity.tuitionFee?.undergraduate).toLocaleString()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Graduate Tuition:</span>
                      <Badge variant="outline">
                        ${Number(selectedUniversity.tuitionFee?.graduate).toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Programs Offered</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedUniversity.coursesOffered?.map((course, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{course}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setViewModalOpen(false)
                    openEditModal(selectedUniversity)
                  }}
                >
                  Edit University
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit University Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl mx-auto p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Edit className="h-5 w-5 mr-2 text-primary" />
              Edit University
            </DialogTitle>
            <DialogDescription>Update the university information below.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="mt-4">
            {/* Same form fields as Add University Modal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Basic Information
                </h3>
                <Separator />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">Country</label>
                <Select value={form.country} onValueChange={(value) => setForm({ ...form, country: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">University Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Harvard University"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              {/* Other form fields same as Add University Modal */}
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Cambridge, Massachusetts"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  Global Ranking
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 1"
                  value={form.ranking}
                  onChange={(e) => setForm({ ...form, ranking: e.target.value })}
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 flex items-center">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Courses Offered
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Computer Science, Business, Medicine (comma separated)"
                  value={form.coursesOffered.join(", ")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      coursesOffered: e.target.value.split(",").map((course) => course.trim()),
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-4 col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Information
                </h3>
                <Separator />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  Phone Number
                </label>
                <Input
                  type="text"
                  placeholder="e.g. +1 (123) 456-7890"
                  value={form.contact.phone}
                  onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="e.g. admissions@university.edu"
                  value={form.contact.email}
                  onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })}
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  Website
                </label>
                <Input
                  type="url"
                  placeholder="e.g. https://www.university.edu"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>

              <div className="space-y-4 col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Additional Information
                </h3>
                <Separator />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 flex items-center">Description</label>
                <Textarea
                  placeholder="Brief description of the university..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Undergraduate Tuition Fee ($)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  value={form.tuitionFee.undergraduate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tuitionFee: { ...form.tuitionFee, undergraduate: e.target.value },
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Graduate Tuition Fee ($)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 60000"
                  value={form.tuitionFee.graduate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tuitionFee: { ...form.tuitionFee, graduate: e.target.value },
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Percent className="h-3 w-3 mr-1" />
                  Acceptance Rate (%)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  value={form.acceptanceRate}
                  onChange={(e) => setForm({ ...form, acceptanceRate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Percent className="h-3 w-3 mr-1" />
                  Graduation Rate (%)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 95"
                  value={form.graduationRate}
                  onChange={(e) => setForm({ ...form, graduationRate: e.target.value })}
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-8">
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update University</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete University Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Trash2 className="h-5 w-5 mr-2 text-red-500" />
              Delete University
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this university? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedUniversity && (
            <div className="mt-4 p-4 border rounded-md">
              <h3 className="font-semibold">{selectedUniversity.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedUniversity.location}, {selectedUniversity.country}
              </p>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete University
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
