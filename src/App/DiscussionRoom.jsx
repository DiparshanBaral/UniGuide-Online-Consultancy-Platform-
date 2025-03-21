"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom" // Replaces useRouter from next/navigation
import { ArrowUp, ArrowDown, MessageSquare, Plus, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Comment } from "@/components/comment"
import { CreatePost } from "@/components/create-post"

// Mock data for initial posts
const initialPosts = [
  {
    id: "1",
    title: "Tips for IELTS Speaking Test",
    description:
      "I recently scored an 8.5 on the IELTS speaking test. Here are some strategies that helped me succeed...",
    author: {
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    upvotes: 24,
    downvotes: 2,
    comments: [
      {
        id: "c1",
        content:
          "This is incredibly helpful! Could you share more about how you prepared for the impromptu speaking section?",
        author: {
          name: "Michael",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        upvotes: 5,
        downvotes: 0,
        timestamp: "2 hours ago",
        replies: [
          {
            id: "r1",
            content:
              "I practiced by selecting random topics and giving myself 1 minute to prepare, then speaking for 2 minutes straight. I recorded myself and reviewed later.",
            author: {
              name: "Emily Chen",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            upvotes: 3,
            downvotes: 0,
            timestamp: "1 hour ago",
          },
        ],
      },
      {
        id: "c2",
        content: "Did you use any specific resources or books for preparation?",
        author: {
          name: "Sarah",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        upvotes: 2,
        downvotes: 0,
        timestamp: "3 hours ago",
        replies: [],
      },
    ],
    timestamp: "5 hours ago",
    userVote: null,
    images: ["/placeholder.svg?height=300&width=500"],
  },
  {
    id: "2",
    title: "Scholarship Application Deadline Extended",
    description:
      "The Global Excellence Scholarship deadline has been extended to June 15th. This is a fully funded opportunity for international students.",
    author: {
      name: "Admin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    upvotes: 45,
    downvotes: 0,
    comments: [],
    timestamp: "1 day ago",
    userVote: null,
    images: [],
  },
  {
    id: "3",
    title: "Study Group for Computer Science",
    description:
      "Looking for students interested in joining a virtual study group for computer science fundamentals. We'll cover algorithms, data structures, and programming concepts.",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    upvotes: 12,
    downvotes: 1,
    comments: [
      {
        id: "c3",
        content: "I'm interested! What platform will you be using for the sessions?",
        author: {
          name: "Priya",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        upvotes: 1,
        downvotes: 0,
        timestamp: "10 hours ago",
        replies: [],
      },
    ],
    timestamp: "2 days ago",
    userVote: null,
    images: [],
  },
]

export default function DiscussionRoom() {
  const navigate = useNavigate() // Replaces useRouter from next/navigation
  const [posts, setPosts] = useState(initialPosts)
  const [expandedPost, setExpandedPost] = useState(null)
  const [newComment, setNewComment] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [showCreatePost, setShowCreatePost] = useState(false)

  // Handle post voting
  const handleVote = (postId, direction) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          // If user already voted in this direction, remove the vote
          if (post.userVote === direction) {
            return {
              ...post,
              upvotes: direction === "up" ? post.upvotes - 1 : post.upvotes,
              downvotes: direction === "down" ? post.downvotes - 1 : post.downvotes,
              userVote: null,
            }
          }
          // If user voted in opposite direction, remove that vote and add new one
          else if (post.userVote !== null) {
            return {
              ...post,
              upvotes: direction === "up" ? post.upvotes + 1 : post.userVote === "up" ? post.upvotes - 1 : post.upvotes,
              downvotes:
                direction === "down"
                  ? post.downvotes + 1
                  : post.userVote === "down"
                    ? post.downvotes - 1
                    : post.downvotes,
              userVote: direction,
            }
          }
          // If user hasn't voted yet
          else {
            return {
              ...post,
              upvotes: direction === "up" ? post.upvotes + 1 : post.upvotes,
              downvotes: direction === "down" ? post.downvotes + 1 : post.downvotes,
              userVote: direction,
            }
          }
        }
        return post
      }),
    )
  }

  // Create a new post
  const handleCreatePost = (postData) => {
    const post = {
      id: Date.now().toString(),
      title: postData.title,
      description: postData.description,
      author: {
        name: "Current User",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      upvotes: 0,
      downvotes: 0,
      comments: [],
      timestamp: "Just now",
      userVote: null,
      images: postData.images || [],
    }
    setPosts([post, ...posts])
    setShowCreatePost(false)
  }

  // Add a comment to a post
  const handleAddComment = (postId) => {
    if (!newComment.trim()) return
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const comment = {
            id: `c${Date.now()}`,
            content: newComment,
            author: {
              name: "Current User",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            upvotes: 0,
            downvotes: 0,
            timestamp: "Just now",
            replies: [],
          }
          return {
            ...post,
            comments: [...post.comments, comment],
          }
        }
        return post
      }),
    )
    setNewComment("")
  }

  // Sort posts based on selected criteria
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "popular") {
      return b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
    } else if (sortBy === "recent") {
      // This is a simplified sort - in a real app, you'd parse actual dates
      return b.id - a.id
    } else if (sortBy === "comments") {
      return b.comments.length - a.comments.length
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}> {/* Replaces router.back() */}
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">IELTS Preparation</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Create Post Button and Sorting Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Button onClick={() => setShowCreatePost(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
          <Tabs defaultValue="popular" onValueChange={setSortBy} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="comments">Most Comments</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="flex">
                {/* Vote Column */}
                <div className="flex flex-col items-center py-4 px-2 bg-slate-50">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={post.userVote === "up" ? "text-primary" : ""}
                    onClick={() => handleVote(post.id, "up")}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                  <span className="text-sm font-medium my-1">{post.upvotes - post.downvotes}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={post.userVote === "down" ? "text-destructive" : ""}
                    onClick={() => handleVote(post.id, "down")}
                  >
                    <ArrowDown className="h-5 w-5" />
                  </Button>
                </div>

                {/* Post Content */}
                <div className="flex-1">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={post.author.avatar || "/placeholder.svg"}
                        alt={post.author.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="text-sm font-medium">{post.author.name}</span>
                      <span className="text-xs text-muted-foreground">• {post.timestamp}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-slate-700">{post.description}</p>
                    {post.images.length > 0 && (
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
                      className="text-muted-foreground"
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}
                    </Button>
                  </CardFooter>

                  {/* Comments Section */}
                  {expandedPost === post.id && (
                    <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                      <div className="space-y-4 mb-4">
                        {post.comments.length > 0 ? (
                          post.comments.map((comment) => (
                            <Comment
                              key={comment.id}
                              comment={comment}
                              postId={post.id}
                              onUpdateComments={(updatedComments) => {
                                setPosts(posts.map((p) => (p.id === post.id ? { ...p, comments: updatedComments } : p)))
                              }}
                            />
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button size="icon" onClick={() => handleAddComment(post.id)} disabled={!newComment.trim()}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Create Post Dialog */}
      {showCreatePost && <CreatePost onClose={() => setShowCreatePost(false)} onSubmit={handleCreatePost} />}
    </div>
  )
}