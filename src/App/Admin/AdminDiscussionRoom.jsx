"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import API from "@/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  MessageSquare,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Trash2,
  Check,
  X,
  Users,
  Tag,
  Calendar,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminDiscussionRoom() {
  const [pendingRooms, setPendingRooms] = useState([])
  const [approvedRooms, setApprovedRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "descending" })
  const [filteredPending, setFilteredPending] = useState([])
  const [filteredApproved, setFilteredApproved] = useState([])
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

  // Fetch pending discussion room requests
  const fetchPendingRooms = async () => {
    try {
      setIsLoading(true)
      const sessionData = JSON.parse(localStorage.getItem("session"))
      const token = sessionData ? sessionData.token : null
      if (!token) {
        throw new Error("No token found")
      }

      const response = await API.get("/discussion/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Ensure pendingRooms is set to the array of rooms
      setPendingRooms(response.data.data || [])
      setFilteredPending(response.data.data || [])
    } catch (error) {
      toast.error("Failed to fetch pending room requests.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch approved discussion rooms
  const fetchApprovedRooms = async () => {
    try {
      setIsLoading(true)
      const sessionData = JSON.parse(localStorage.getItem("session"))
      const token = sessionData ? sessionData.token : null
      if (!token) {
        throw new Error("No token found")
      }

      const response = await API.get("/discussion/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setApprovedRooms(response.data.data || [])
      setFilteredApproved(response.data.data || [])
    } catch (error) {
      toast.error("Failed to fetch approved room requests.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingRooms()
    fetchApprovedRooms()
  }, [])

  // Filter rooms based on search query and selected category
  useEffect(() => {
    let filteredPendingResults = [...pendingRooms]
    let filteredApprovedResults = [...approvedRooms]

    // Filter by category
    if (selectedCategory !== "all") {
      filteredPendingResults = filteredPendingResults.filter((room) => room.category === selectedCategory)
      filteredApprovedResults = filteredApprovedResults.filter((room) => room.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()

      filteredPendingResults = filteredPendingResults.filter(
        (room) =>
          room.title?.toLowerCase().includes(query) ||
          room.description?.toLowerCase().includes(query) ||
          room.tags?.some((tag) => tag.toLowerCase().includes(query)),
      )

      filteredApprovedResults = filteredApprovedResults.filter(
        (room) =>
          room.title?.toLowerCase().includes(query) ||
          room.description?.toLowerCase().includes(query) ||
          room.tags?.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Apply sorting
    if (sortConfig.key) {
      const sortByKey = (a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        if (sortConfig.key === "participants") {
          aValue = Number(aValue) || 0
          bValue = Number(bValue) || 0
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      }

      filteredPendingResults.sort(sortByKey)
      filteredApprovedResults.sort(sortByKey)
    }

    setFilteredPending(filteredPendingResults)
    setFilteredApproved(filteredApprovedResults)
  }, [pendingRooms, approvedRooms, searchQuery, selectedCategory, sortConfig])

  const handleSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const openViewModal = (room) => {
    setSelectedRoom(room)
    setViewModalOpen(true)
  }

  const openDeleteModal = (room) => {
    setSelectedRoom(room)
    setDeleteModalOpen(true)
  }

  const updateRoomStatus = async (id, status) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"))
      const token = sessionData ? sessionData.token : null

      if (!token) {
        throw new Error("No token found")
      }

      // Validate the status value
      if (!["approved"].includes(status)) {
        throw new Error('Invalid status value. Must be "approved".')
      }

      // Make the PUT request
      await API.put(
        `/discussion/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Show success toast
      if (status === "approved") {
        toast.success("Room request approved successfully!")
      }

      // Refetch rooms to reflect the updated status
      fetchPendingRooms()
      fetchApprovedRooms()
    } catch (error) {
      console.error("Error Message:", error.message)
      toast.error(`Error ${status.toLowerCase()}ing room request.`)
    }
  }

  const deletePendingRoomRequest = async (id, status) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"))
      const token = sessionData ? sessionData.token : null

      if (!token) {
        throw new Error("No token found")
      }

      // Validate the status value
      if (!["rejected"].includes(status)) {
        throw new Error('Invalid status value. Must be "rejected".')
      }

      // Make the DELETE request
      const response = await API.delete(`/discussion/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Check the response
      if (response.data.success) {
        toast.success("Room request deleted successfully!")
      } else {
        throw new Error(response.data.message || "Failed to delete room request.")
      }

      // Refetch rooms to reflect the updated list
      fetchPendingRooms()
      setDeleteModalOpen(false)
    } catch (error) {
      toast.error(`Error deleting room request: ${error.message}`)
      console.error("Error Details:", error)
    }
  }

  // Get unique categories for filter dropdown
  const getUniqueCategories = () => {
    const allRooms = [...pendingRooms, ...approvedRooms]
    const uniqueCategories = new Set()

    allRooms.forEach((room) => {
      if (room.category) {
        uniqueCategories.add(room.category)
      }
    })

    return Array.from(uniqueCategories)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discussion Rooms</h1>
        <p className="text-muted-foreground">Manage discussion room requests and active rooms</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-primary" />
            Discussion Room Management
          </CardTitle>
          <CardDescription>Review and manage requests for creating discussion rooms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, description or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getUniqueCategories().map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[120px]">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSort("createdAt")}>Date (Newest First)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("title")}>Title (A-Z)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("participants")}>
                  Participants (High to Low)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Badge variant="destructive" className="mr-2">
                  {filteredPending.length}
                </Badge>
                Pending Room Requests
              </h2>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredPending.length === 0 ? (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No pending room requests</h3>
                  <p className="text-muted-foreground mt-2">All discussion room requests have been processed.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort("title")}>
                            Title
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort("createdAt")}>
                            Created
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPending.map((room) => (
                        <TableRow key={room._id}>
                          <TableCell className="font-medium">{room.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{room.category || "General"}</Badge>
                          </TableCell>
                          <TableCell>{new Date(room.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {room.tags &&
                                room.tags.slice(0, 2).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              {room.tags && room.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{room.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openViewModal(room)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-500 hover:text-green-600 hover:bg-green-50"
                                onClick={() => updateRoomStatus(room._id, "approved")}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => openDeleteModal(room)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Badge variant="secondary" className="mr-2">
                  {filteredApproved.length}
                </Badge>
                Active Discussion Rooms
              </h2>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredApproved.length === 0 ? (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No active discussion rooms</h3>
                  <p className="text-muted-foreground mt-2">Approved discussion rooms will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredApproved.map((room) => (
                    <Card key={room._id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{room.title}</CardTitle>
                          <Badge variant="outline">{room.category || "General"}</Badge>
                        </div>
                        <CardDescription className="line-clamp-2">{room.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{room.participants || 0} participants</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {room.tags &&
                            room.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <Button variant="ghost" size="sm" onClick={() => openViewModal(room)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => openDeleteModal(room)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Room Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-3xl mx-auto p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <MessageSquare className="h-5 w-5 mr-2 text-primary" />
              Discussion Room Details
            </DialogTitle>
          </DialogHeader>

          {selectedRoom && (
            <div className="mt-4 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedRoom.title}</h2>
                  <Badge variant="outline" className="mt-2">
                    {selectedRoom.category || "General"}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Created on {new Date(selectedRoom.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{selectedRoom.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{selectedRoom.participants || 0} participants</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom.tags &&
                      selectedRoom.tags.map((tag, index) => (
                        <div key={index} className="flex items-center gap-1 p-2 rounded-lg bg-muted">
                          <Tag className="h-4 w-4 text-primary" />
                          <span>{tag}</span>
                        </div>
                      ))}
                    {(!selectedRoom.tags || selectedRoom.tags.length === 0) && (
                      <p className="text-muted-foreground">No tags available</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                  Close
                </Button>
                {selectedRoom.status === "pending" ? (
                  <>
                    <Button
                      onClick={() => {
                        updateRoomStatus(selectedRoom._id, "approved")
                        setViewModalOpen(false)
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setViewModalOpen(false)
                        openDeleteModal(selectedRoom)
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setViewModalOpen(false)
                      openDeleteModal(selectedRoom)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Room
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Room Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Trash2 className="h-5 w-5 mr-2 text-red-500" />
              {selectedRoom?.status === "pending" ? "Reject Room Request" : "Delete Discussion Room"}
            </DialogTitle>
            <DialogDescription>
              {selectedRoom?.status === "pending"
                ? "Are you sure you want to reject this room request? This action cannot be undone."
                : "Are you sure you want to delete this discussion room? This action cannot be undone and will remove all messages and participants."}
            </DialogDescription>
          </DialogHeader>

          {selectedRoom && (
            <div className="mt-4 p-4 border rounded-md">
              <h3 className="font-semibold">{selectedRoom.title}</h3>
              <p className="text-sm text-muted-foreground">{selectedRoom.category || "General"}</p>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedRoom?.status === "pending") {
                  deletePendingRoomRequest(selectedRoom._id, "rejected")
                } else {
                  deletePendingRoomRequest(selectedRoom._id, "rejected")
                }
              }}
            >
              {selectedRoom?.status === "pending" ? "Reject Request" : "Delete Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
