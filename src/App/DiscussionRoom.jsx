import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api'; // Custom Axios instance
import { ArrowUp, ArrowDown, MessageSquare, Plus, Users, Tag } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Comment } from '@/Components/comment';
import { CreatePost } from '@/Components/create-post';
import { toast } from 'sonner';
import { Badge } from '@/Components/ui/badge';

// Utilityfunction to format relative time
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 60);
  if (interval < 1) return 'Just now';
  if (interval < 60) return `${interval} minute${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(seconds / 3600);
  if (interval < 24) return `${interval} hour${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(seconds / 86400);
  if (interval < 7) return `${interval} day${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(seconds / 604800);
  return `${interval} week${interval > 1 ? 's' : ''} ago`;
};

export default function DiscussionRoom() {
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [sortBy, setSortBy] = useState('popular');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [session, setSession] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { roomId } = useParams();

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  // Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/discussion/rooms/${roomId}`);
        if (response.data.success) {
          setRoomDetails(response.data.data);
        } else {
          console.error('Failed to fetch room details:', response);
          toast.error('Failed to load room details');
        }
      } catch (error) {
        console.error('Error fetching room details:', error);
        toast.error('Error loading room details');
      } finally {
        setLoading(false);
      }
    };
    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  // Fetch popular posts
  const fetchPopularPosts = async () => {
    try {
      const response = await API.get(`room/posts/popular/${roomId}`);
      if (response.data.success && Array.isArray(response.data.data)) {
        setPosts(response.data.data);
      } else {
        console.error('Unexpected response structure:', response);
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching popular posts:', error);
      setPosts([]);
    }
  };

  // Fetch recent posts
  const fetchRecentPosts = async () => {
    try {
      const response = await API.get(`room/posts/recent/${roomId}`);
      if (response.data.success && Array.isArray(response.data.data)) {
        setPosts(response.data.data);
      } else {
        console.error('Unexpected response structure:', response);
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      setPosts([]);
    }
  };

  // Fetch posts authored by the current user
  const fetchMyPosts = async () => {
    try {
      const authorId = session?._id;
      if (!authorId) return;
      const response = await API.get(`/room/yourposts/${roomId}`, {
        params: { authorId },
      });
      if (response.data.success && Array.isArray(response.data.data)) {
        setMyPosts(response.data.data);
      } else {
        console.error('Unexpected response structure:', response);
        setMyPosts([]);
      }
    } catch (error) {
      console.error('Error fetching my posts:', error);
    }
  };

  // Fetch posts based on sorting criteria
  useEffect(() => {
    if (sortBy === 'popular') {
      fetchPopularPosts();
    } else if (sortBy === 'recent') {
      fetchRecentPosts();
    } else if (sortBy === 'myposts') {
      fetchMyPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  // Sort posts based on selected criteria
  const sortedPosts = [...(sortBy === 'myposts' ? myPosts : posts)].sort((a, b) => {
    if (sortBy === 'popular') {
      const aScore = Number(a.upvotes || 0) - Number(a.downvotes || 0);
      const bScore = Number(b.upvotes || 0) - Number(b.downvotes || 0);
      return bScore - aScore;
    } else if (sortBy === 'recent') {
      return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
    }
    return 0;
  });

  // Create a new post
  const handleCreatePost = async (postData) => {
    try {
      const authorId = session?._id;
      const postDataToSend = {
        roomId,
        posttitle: postData.title,
        postdescription: postData.description,
        postauthor: {
          authorId,
          name: `${session?.firstname || ''} ${session?.lastname || ''}`.trim() || 'Anonymous',
          avatar: session?.profilePic || '/placeholder.svg',
        },
      };
      const response = await API.post('/room/create/post', postDataToSend);
      if (!response || !response.data || !response.data.post) {
        console.error('Invalid response from backend:', response);
        throw new Error('Failed to create post');
      }
      const newPost = response.data.post;
      setPosts([newPost, ...posts]);
      setShowCreatePost(false);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // Add a comment to a post
  const handleAddComment = async (postId, commentContent) => {
    try {
      const commentAuthor = {
        name: `${session?.firstname || ''} ${session?.lastname || ''}`.trim() || 'Anonymous',
        avatar: session?.profilePic || '/placeholder.svg',
      };

      const response = await API.post('/room/add/comment', {
        roomId,
        postId,
        commentcontent: commentContent,
        commentauthor: commentAuthor,
      });

      // Check if the response contains the expected data
      if (response.data && response.data.comment) {
        const newComment = response.data.comment;

        // Update the posts state with the new comment
        const updatedPosts = posts.map((post) =>
          post.postid === postId
            ? {
                ...post,
                comments: [...(Array.isArray(post.comments) ? post.comments : []), newComment],
              }
            : post,
        );

        setPosts(updatedPosts);
        toast.success('Comment added successfully!');
      } else {
        console.warn('Unexpected response structure:', response.data);
        toast.error('Failed to process the comment. Please try again.');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding comment');
    }
  };

  // Add this function to handle replies to comments
  const handleReplyToComment = async (postId, commentId, replyContent) => {
    try {
      const replyAuthor = {
        name: `${session?.firstname || ''} ${session?.lastname || ''}`.trim() || 'Anonymous',
        avatar: session?.profilePic || '/placeholder.svg',
      };

      const response = await API.post('/room/reply/comment', {
        roomId,
        postId,
        commentid: commentId,
        replycontent: replyContent,
        replyauthor: replyAuthor,
      });

      if (response.data && response.data.reply) {
        const newReply = response.data.reply;

        // Update the posts state while preserving all existing comments and their replies
        const updatedPosts = posts.map((post) => {
          if (post.postid === postId) {
            const updatedComments = post.comments.map((comment) => {
              if (comment.commentid === commentId) {
                return {
                  ...comment,
                  commentreplies: [
                    ...(Array.isArray(comment.commentreplies) ? comment.commentreplies : []),
                    newReply
                  ]
                };
              }
              return comment;
            });
            
            return {
              ...post,
              comments: updatedComments
            };
          }
          return post;
        });

        setPosts(updatedPosts);
        toast.success('Reply added successfully!');
      } else {
        console.warn('Unexpected response structure:', response.data);
        toast.error('Failed to process the reply. Please try again.');
      }
    } catch (error) {
      console.error('Error replying to comment:', error);
      toast.error('Error adding reply');
    }
  };

  // Function to handle upvote
  const handleUpvote = async (postId) => {
    try {
      const userId = session?._id; // Get the user ID from the session
      if (!userId) {
        toast.error('You need to be logged in to upvote.');
        return;
      }

      const response = await API.post('/room/post/upvote', {
        roomId,
        postId,
        userId,
      });

      if (response.status === 200) {
        // Update the post's upvote count in the UI
        const updatedPosts = posts.map((post) =>
          post.postid === postId
            ? {
                ...post,
                upvotes: Number(response.data.upvotes || 0),
              }
            : post,
        );
        setPosts(updatedPosts);

        toast.success(response.data.message);
      } else {
        toast.error('Failed to upvote the post.');
      }
    } catch (error) {
      console.error('Error upvoting the post:', error);
      toast.error('Error upvoting the post.');
    }
  };

  // Function to handle downvote
  const handleDownvote = async (postId) => {
    try {
      const userId = session?._id; // Get the user ID from the session
      if (!userId) {
        toast.error('You need to be logged in to downvote.');
        return;
      }

      const response = await API.post('/room/post/downvote', {
        roomId,
        postId,
        userId,
      });

      if (response.status === 200) {
        // Update the post's upvote count in the UI
        const updatedPosts = posts.map((post) =>
          post.postid === postId ? { ...post, upvotes: response.data.upvotes } : post,
        );
        setPosts(updatedPosts);

        toast.success(response.data.message);
      } else {
        toast.error('Failed to downvote the post.');
      }
    } catch (error) {
      console.error('Error downvoting the post:', error);
      toast.error('Error downvoting the post.');
    }
  };

  return (
    <div className="mt-[50px] min-h-screen bg-slate-50">
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
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-slate-600 hover:bg-slate-700 text-white"
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
              <div className="mt-4 text-xs text-slate-300">
                Created {formatRelativeTime(roomDetails.createdAt)}
              </div>
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
              <Card
                key={post.postid}
                className="overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex">
                  {/* Vote Column */}
                  <div className="flex flex-col items-center py-4 px-2 bg-slate-50">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-orange-500 hover:bg-transparent"
                      onClick={() => handleUpvote(post.postid)} // Call handleUpvote
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                    <span className="text-sm font-medium my-1">
                      {Number(post.upvotes || 0) - Number(post.downvotes || 0)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-blue-500 hover:bg-transparent"
                      onClick={() => handleDownvote(post.postid)} // Call handleDownvote
                    >
                      <ArrowDown className="h-5 w-5" />
                    </Button>
                  </div>
                  {/* Post Content */}
                  <div className="flex-1">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={post.postauthor.avatar || '/placeholder.svg'}
                          alt={post.postauthor.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="text-sm font-medium">{post.postauthor.name}</span>
                        <span className="text-xs text-muted-foreground">
                          • {formatRelativeTime(post.createdAt)}
                        </span>
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
                              src={image || '/placeholder.svg'}
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
                        onClick={() =>
                          setExpandedPost(expandedPost === post.postid ? null : post.postid)
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                      </Button>
                    </CardFooter>
                    {/* Comments Section */}
                    {expandedPost === post.postid && (
                      <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                        <div className="space-y-4 mb-4">
                          {/* Input for adding a new comment */}
                          <div className="mb-4">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              className="w-full p-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-slate-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                  handleAddComment(post.postid, e.target.value.trim());
                                  e.target.value = '';
                                }
                              }}
                            />
                          </div>
                          {/* Existing comments */}
                          {post.comments && Array.isArray(post.comments) ? (
                            post.comments.map((comment) => (
                              <Comment
                                key={comment.commentid}
                                comment={{
                                  ...comment,
                                  id: comment.commentid,
                                  content: comment.commentcontent,
                                  author: comment.commentauthor,
                                  timestamp: comment.commenttimestamp,
                                  replies: (comment.commentreplies || []).map((reply) => ({
                                    ...reply,
                                    id: reply.replyid || reply.id || `temp-id-${Math.random()}`,
                                    content: reply.replycontent,
                                    author: reply.replyauthor,
                                    timestamp: reply.replytimestamp,
                                    replies: reply.commentreplies || [],
                                  })),
                                }}
                                postId={post.postid}
                                roomId={roomId}
                                onAddReply={(commentId, replyContent) =>
                                  handleReplyToComment(post.postid, commentId, replyContent)
                                }
                                onUpdateComments={(updatedComments) => {
                                  // Update the comments for the specific post
                                  setPosts((prevPosts) =>
                                    prevPosts.map((p) =>
                                      p.postid === post.postid
                                        ? { ...p, comments: updatedComments }
                                        : p,
                                    ),
                                  );
                                }}
                              />
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No comments yet. Be the first to comment!
                            </p>
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
                Create your first to post
              </Button>
            </div>
          )}
        </div>
      </main>
      {/* Create Post Dialog */}
      {showCreatePost && (
        <CreatePost onClose={() => setShowCreatePost(false)} onSubmit={handleCreatePost} />
      )}
    </div>
  );
}
