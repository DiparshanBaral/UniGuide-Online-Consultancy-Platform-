"use client"

import { useState } from "react"
import PropTypes from "prop-types"
import { ArrowUp, ArrowDown, Reply, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Comment({ comment, postId, onUpdateComments, depth = 0, parentComments = [] }) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [userVote, setUserVote] = useState(null)
  const [upvotes, setUpvotes] = useState(comment.upvotes)
  const [downvotes, setDownvotes] = useState(comment.downvotes)
  const [showReplies, setShowReplies] = useState(true)

  // Handle voting on comments
  const handleVote = (direction) => {
    if (userVote === direction) {
      // Remove vote
      setUserVote(null)
      if (direction === "up") {
        setUpvotes(upvotes - 1)
      } else {
        setDownvotes(downvotes - 1)
      }
    } else if (userVote === null) {
      // Add new vote
      setUserVote(direction)
      if (direction === "up") {
        setUpvotes(upvotes + 1)
      } else {
        setDownvotes(downvotes + 1)
      }
    } else {
      // Change vote direction
      setUserVote(direction)
      if (direction === "up") {
        setUpvotes(upvotes + 1)
        setDownvotes(downvotes - 1)
      } else {
        setUpvotes(upvotes - 1)
        setDownvotes(downvotes + 1)
      }
    }
  }

  // Add a reply to this comment
  const handleAddReply = () => {
    if (!replyContent.trim()) return

    const newReply = {
      id: `r${Date.now()}`,
      content: replyContent,
      author: {
        name: "Current User",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      upvotes: 0,
      downvotes: 0,
      timestamp: "Just now",
      replies: [],
    }

    // Function to recursively find and update the comment
    const updateCommentReplies = (comments, targetId, newReply) => {
      return comments.map((c) => {
        if (c.id === targetId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply],
          }
        } else if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: updateCommentReplies(c.replies, targetId, newReply),
          }
        }
        return c
      })
    }

    // If we're in a nested reply structure, we need to update the parent comments
    if (parentComments.length > 0) {
      let updatedComments = [...parentComments]
      updatedComments = updateCommentReplies(updatedComments, comment.id, newReply)
      onUpdateComments(updatedComments)
    } else {
      // Direct reply to a top-level comment
      const updatedComment = {
        ...comment,
        replies: [...(comment.replies || []), newReply],
      }

      onUpdateComments((prevComments) => prevComments.map((c) => (c.id === comment.id ? updatedComment : c)))
    }

    setReplyContent("")
    setIsReplying(false)
  }

  // Maximum nesting level to prevent too deep threads
  const maxDepth = 4

  return (
    <div className={`pl-${depth > 0 ? 4 : 0}`}>
      <div className="flex gap-3">
        {/* Indentation for nested comments */}
        {depth > 0 && <div className="w-0.5 bg-slate-200 rounded-full self-stretch ml-2 mr-1" />}

        <div className="flex-1">
          <div className="flex items-start gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">• {comment.timestamp}</span>
              </div>

              <p className="text-sm mt-1">{comment.content}</p>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 ${userVote === "up" ? "text-primary" : ""}`}
                    onClick={() => handleVote("up")}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <span className="text-xs font-medium mx-1">{upvotes - downvotes}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 ${userVote === "down" ? "text-destructive" : ""}`}
                    onClick={() => handleVote("down")}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>

                {depth < maxDepth && (
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setIsReplying(!isReplying)}>
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    <DropdownMenuItem>Copy Text</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Reply form */}
              {isReplying && (
                <div className="mt-3 flex gap-2">
                  <Input
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={handleAddReply} disabled={!replyContent.trim()}>
                    Reply
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.length > 3 && (
                <Button variant="ghost" size="sm" className="text-xs mb-2" onClick={() => setShowReplies(!showReplies)}>
                  {showReplies ? `Hide ${comment.replies.length} replies` : `Show ${comment.replies.length} replies`}
                </Button>
              )}

              {showReplies && (
                <div className="space-y-3 mt-1">
                  {comment.replies.map((reply) => (
                    <Comment
                      key={reply.id}
                      comment={reply}
                      postId={postId}
                      depth={depth + 1}
                      parentComments={parentComments.length > 0 ? parentComments : [comment]}
                      onUpdateComments={(updatedReplies) => {
                        const updatedComment = {
                          ...comment,
                          replies: updatedReplies,
                        }

                        if (parentComments.length > 0) {
                          // Update in nested structure
                          const updateNestedComment = (comments, targetId, updatedComment) => {
                            return comments.map((c) => {
                              if (c.id === targetId) {
                                return updatedComment
                              } else if (c.replies && c.replies.length > 0) {
                                return {
                                  ...c,
                                  replies: updateNestedComment(c.replies, targetId, updatedComment),
                                }
                              }
                              return c
                            })
                          }

                          const updatedComments = updateNestedComment(parentComments, comment.id, updatedComment)
                          onUpdateComments(updatedComments)
                        } else {
                          // Direct update to top-level comment
                          onUpdateComments((prevComments) =>
                            prevComments.map((c) => (c.id === comment.id ? updatedComment : c)),
                          )
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Add PropTypes validation
Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
    upvotes: PropTypes.number,
    downvotes: PropTypes.number,
    timestamp: PropTypes.string,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        author: PropTypes.shape({
          name: PropTypes.string.isRequired,
          avatar: PropTypes.string.isRequired,
        }).isRequired,
        upvotes: PropTypes.number,
        downvotes: PropTypes.number,
        timestamp: PropTypes.string,
        replies: PropTypes.array,
      }),
    ),
  }).isRequired,
  postId: PropTypes.string.isRequired,
  onUpdateComments: PropTypes.func.isRequired,
  depth: PropTypes.number,
  parentComments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
      }).isRequired,
      upvotes: PropTypes.number,
      downvotes: PropTypes.number,
      timestamp: PropTypes.string,
      replies: PropTypes.array,
    }),
  ),
}

// Set default props
Comment.defaultProps = {
  depth: 0,
  parentComments: [],
}