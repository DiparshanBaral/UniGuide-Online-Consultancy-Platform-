"use client"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import API from "../api" // Custom Axios instance
import { ArrowUp, ArrowDown, MessageSquare, Plus, ChevronLeft, Users, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Comment } from "@/components/comment"
import { CreatePost } from "@/components/create-post"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function DiscussionRoom() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [myPosts, setMyPosts] = useState([])
  const [expandedPost, setExpandedPost] = useState(null)
  const [sortBy, setSortBy] = useState("popular")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [session, setSession] = useState(null)
  const [roomDetails, setRoomDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const { roomId } = useParams()

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem("session")
    if (savedSession) {
      setSession(JSON.parse(savedSession))
    }
  }, [])

  // Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true)
        const response = await API.get(`/discussion/rooms/${roomId}`)
        if (response.data.success) {
          setRoomDetails(response.data.data)
        } else {
          console.error("Failed to fetch room details:", response)
          toast.error("Failed to load room details")
        }
      } catch (error) {
        console.error("Error fetching room details:", error)
        toast.error("Error loading room details")
      } finally {
        setLoading(false)
      }
    }

    if (roomId) {
      fetchRoomDetails()
    }
  }, [roomId])

  // Fetch popular posts
  const fetchPopularPosts = async () => {
    try {
      const response = await API.get(`room/posts/popular/${roomId}`)

      if (response.data.success && Array.isArray(response.data.data)) {
        setPosts(response.data.data)
      } else {
        console.error("Unexpected response structure:", response)
        setPosts([])
      }
    } catch (error) {
      console.error("Error fetching popular posts:", error)
      setPosts([])
    }
  }

  // Fetch recent posts
  const fetchRecentPosts = async () => {
    try {
      const response = await API.get(`room/posts/recent/${roomId}`)

      if (response.data.success && Array.isArray(response.data.data)) {
        setPosts(response.data.data)
      } else {
        console.error("Unexpected response structure:", response)
        setPosts([])
      }
    } catch (error) {
      console.error("Error fetching recent posts:", error)
      setPosts([])
    }
  }

  // Fetch posts authored by the current user
  const fetchMyPosts = async () => {
    try {
      const authorId = session?._id

      if (!authorId) return

      const response = await API.get(`/room/yourposts/${roomId}`, {
        params: { authorId },
      })

      if (response.data.success && Array.isArray(response.data.data)) {
        setMyPosts(response.data.data)
      } else {
        console.error("Unexpected response structure:", response)
        setMyPosts([])
      }
    } catch (error) {
      console.error("Error fetching my posts:", error)
    }
  }

  // Fetch posts based on sorting criteria
  useEffect(() => {
    if (sortBy === "popular") {
      fetchPopularPosts()
    } else if (sortBy === "recent") {
      fetchRecentPosts()
    } else if (sortBy === "myposts") {
      fetchMyPosts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy])

  // Sort posts based on selected criteria
  const sortedPosts = [...(sortBy === "myposts" ? myPosts : posts)].sort((a, b) => {
    if (sortBy === "popular") {
      return b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
    } else if (sortBy === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    return 0
  })

  // Create a new post
  const handleCreatePost = async (postData) => {
    try {
      const authorId = session?._id
      const postDataToSend = {
        roomId,
        posttitle: postData.title,
        postdescription: postData.description,
        postauthor: {
          authorId,
          name: `${session?.firstname || ""} ${session?.lastname || ""}`.trim() || "Anonymous",
          avatar: session?.profilePic || "/placeholder.svg",
        },
      }

      const response = await API.post("/room/create/post", postDataToSend)

      // Validate backend response
      if (!response || !response.data || !response.data.post) {
        console.error("Invalid response from backend:", response)
        throw new Error("Failed to create post")
      }

      const newPost = response.data.post // Extract the new post from the response

      // Update posts state
      setPosts([newPost, ...posts])
      setShowCreatePost(false) // Close the dialog after creating the post

      // Show success toast
      toast.success("Post created successfully!")
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">{roomDetails?.title || "Discussion Room"}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Room Details Card */}
        {roomDetails && (
          <Card className="mb-6 overflow-hidden border-0 shadow-md">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">{roomDetails.title}</h2>
              <p className="text-slate-200 mb-4">{roomDetails.description}</p>

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-300" />
                  <span className="text-sm">{roomDetails.participants} Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-slate-300" />
                  <span className="text-sm">Category: {roomDetails.category}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {roomDetails.tags &&
                  roomDetails.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-600 hover:bg-slate-700 text-white">
                      {tag}
                    </Badge>
                  ))}
              </div>

              <div className="mt-4 text-xs text-slate-300">Created on {formatDate(roomDetails.createdAt)}</div>
            </div>
          </Card>
        )}

        {/* Create Post Button and Sorting Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Button
            onClick={() => setShowCreatePost(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
          <Tabs defaultValue="popular" onValueChange={setSortBy} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="myposts">My Posts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 bg-slate-300 rounded-full mb-2"></div>
              <div className="h-4 w-32 bg-slate-300 rounded"></div>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {sortedPosts.length > 0 ? (
            sortedPosts.map((post) => (
              <Card key={post.postid} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex">
                  {/* Vote Column */}
                  <div className="flex flex-col items-center py-4 px-2 bg-slate-50">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-orange-500 hover:bg-transparent"
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                    <span className="text-sm font-medium my-1">{post.upvotes - post.downvotes}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-blue-500 hover:bg-transparent"
                    >
                      <ArrowDown className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={post.postauthor.avatar || "/placeholder.svg"}
                          alt={post.postauthor.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="text-sm font-medium">{post.postauthor.name}</span>
                        <span className="text-xs text-muted-foreground">• {post.timestamp}</span>
                      </div>
                      <h3 className="text-lg font-semibold">{post.posttitle}</h3>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-slate-700">{post.postdescription}</p>
                      {post.images && post.images.length > 0 && (
                        <div className="mt-3">
                          {post.images.map((image, index) => (
                            <img
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt={`Post image ${index + 1}`}
                              className="rounded-md max-h-96 object-cover mt-2"
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0 pb-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:bg-slate-100"
                        onClick={() => setExpandedPost(expandedPost === post.postid ? null : post.postid)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}
                      </Button>
                    </CardFooter>

                    {/* Comments Section */}
                    {expandedPost === post.postid && (
                      <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                        <div className="space-y-4 mb-4">
                          {post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                              <Comment
                                key={comment.id}
                                comment={comment}
                                postId={post.postid}
                                onUpdateComments={(updatedComments) => {
                                  setPosts(
                                    posts.map((p) =>
                                      p.postid === post.postid ? { ...p, comments: updatedComments } : p,
                                    ),
                                  )
                                }}
                              />
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-md shadow-sm p-6">
              <p className="text-muted-foreground">No posts found in this discussion room.</p>
              <Button
                onClick={() => setShowCreatePost(true)}
                variant="outline"
                className="mt-4 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white"
              >
                Be the first to post
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Create Post Dialog */}
      {showCreatePost && <CreatePost onClose={() => setShowCreatePost(false)} onSubmit={handleCreatePost} />}
    </div>
  )
}

