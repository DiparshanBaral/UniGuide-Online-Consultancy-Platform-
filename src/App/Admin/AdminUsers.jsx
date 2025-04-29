import { useState, useEffect } from "react"
import { toast } from "sonner"
import API from "@/api"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog"
import { Users, GraduationCap, UserCircle, Search, Filter, ArrowUpDown, Mail, Phone, Calendar, MapPin, Trash2, AlertCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"

export default function AdminUsers() {
  const [students, setStudents] = useState([])
  const [mentors, setMentors] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [filteredMentors, setFilteredMentors] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("students")
  const [isLoading, setIsLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({ key: "firstname", direction: "ascending" })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userType, setUserType] = useState(null) // "student" or "mentor"

  // Fetch students data
  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      const sessionData = JSON.parse(localStorage.getItem("session"))
      const token = sessionData ? sessionData.token : null

      if (!token) {
        throw new Error("No token found")
      }

      const response = await API.get("/student", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data && response.data.success) {
        setStudents(response.data.data)
        setFilteredStudents(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
      toast.error("Failed to load students")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch mentors data
  const fetchMentors = async () => {
    try {
      setIsLoading(true)
      const sessionData = JSON.parse(localStorage.getItem("session"))
      const token = sessionData ? sessionData.token : null

      if (!token) {
        throw new Error("No token found")
      }

      const response = await API.get("/mentor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data && response.data.success) {
        setMentors(response.data.data)
        setFilteredMentors(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching mentors:", error)
      toast.error("Failed to load mentors")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
    fetchMentors()
  }, [])

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      
      // Filter students
      const filteredStudentResults = students.filter(
        (student) =>
          student.firstname?.toLowerCase().includes(query) ||
          student.lastname?.toLowerCase().includes(query) ||
          student.email?.toLowerCase().includes(query)
      )
      setFilteredStudents(filteredStudentResults)
      
      // Filter mentors
      const filteredMentorResults = mentors.filter(
        (mentor) =>
          mentor.firstname?.toLowerCase().includes(query) ||
          mentor.lastname?.toLowerCase().includes(query) ||
          mentor.email?.toLowerCase().includes(query)
      )
      setFilteredMentors(filteredMentorResults)
    } else {
      setFilteredStudents(students)
      setFilteredMentors(mentors)
    }
  }, [searchQuery, students, mentors])

  // Apply sorting
  useEffect(() => {
    if (sortConfig.key) {
      const sortData = (data) => {
        return [...data].sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1
          }
          return 0
        })
      }

      setFilteredStudents(sortData(filteredStudents))
      setFilteredMentors(sortData(filteredMentors))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortConfig])

  const handleSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const openDeleteModal = (user, type) => {
    setSelectedUser(user)
    setUserType(type)
    setDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"))
      const token = sessionData ? sessionData.token : null

      if (!token) {
        throw new Error("No token found")
      }

      if (userType === "student") {
        await API.delete(`/student/${selectedUser._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        toast.success("Student deleted successfully!")
        setStudents((prev) => prev.filter((student) => student._id !== selectedUser._id))
      } else if (userType === "mentor") {
        await API.delete(`/mentor/${selectedUser._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        toast.success("Mentor deleted successfully!")
        setMentors((prev) => prev.filter((mentor) => mentor._id !== selectedUser._id))
      }

      setDeleteModalOpen(false)
    } catch (error) {
      console.error(`Error deleting ${userType}:`, error)
      toast.error(`An error occurred while deleting the ${userType}. Please try again.`)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">Manage students and mentors in the system</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Users Directory
          </CardTitle>
          <CardDescription>View and manage all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[120px]">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSort("firstname")}>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("email")}>Email (A-Z)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("createdAt")}>Date Joined (Newest First)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs defaultValue="students" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="students" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" /> Students
                <Badge variant="secondary" className="ml-2">
                  {filteredStudents.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="mentors" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> Mentors
                <Badge variant="secondary" className="ml-2">
                  {filteredMentors.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <UserCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No students found</h3>
                  <p className="text-muted-foreground mt-2">Try adjusting your search criteria.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort("firstname")}>
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort("email")}>
                            Email
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort("createdAt")}>
                            Joined
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={student.profilePic || "/placeholder.svg?height=32&width=32"} alt={`${student.firstname} ${student.lastname}`} />
                                <AvatarFallback>{student.firstname?.[0]}{student.lastname?.[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div>{student.firstname} {student.lastname}</div>
                                <div className="text-xs text-muted-foreground">Student</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{student.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {student.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  <span>{student.phone}</span>
                                </div>
                              )}
                              {student.location && (
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span>{student.location}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(student.createdAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => openDeleteModal(student, "student")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mentors">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredMentors.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No mentors found</h3>
                  <p className="text-muted-foreground mt-2">Try adjusting your search criteria.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort("firstname")}>
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort("email")}>
                            Email
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort("createdAt")}>
                            Joined
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMentors.map((mentor) => (
                        <TableRow key={mentor._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={mentor.profilePic || "/placeholder.svg?height=32&width=32"} alt={`${mentor.firstname} ${mentor.lastname}`} />
                                <AvatarFallback>{mentor.firstname?.[0]}{mentor.lastname?.[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div>{mentor.firstname} {mentor.lastname}</div>
                                <div className="text-xs text-muted-foreground">Mentor</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{mentor.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {mentor.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  <span>{mentor.phone}</span>
                                </div>
                              )}
                              {mentor.location && (
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span>{mentor.location}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(mentor.createdAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => openDeleteModal(mentor, "mentor")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete User Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              Delete {userType === "student" ? "Student" : "Mentor"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {userType}? This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="mt-4 p-4 border rounded-md">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser.profilePic || "/placeholder.svg?height=40&width=40"} alt={`${selectedUser.firstname} ${selectedUser.lastname}`} />
                  <AvatarFallback>{selectedUser.firstname?.[0]}{selectedUser.lastname?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedUser.firstname} {selectedUser.lastname}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete {userType === "student" ? "Student" : "Mentor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
