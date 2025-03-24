'use client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Custom Axios instance
import { ArrowUp, ArrowDown, MessageSquare, Plus, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
// import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Comment } from '@/components/comment';
import { CreatePost } from '@/components/create-post';
import { toast } from "sonner";

export default function DiscussionRoom() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [sortBy, setSortBy] = useState('popular');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [session, setSession] = useState(null);

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  // Fetch popular posts
  const fetchPopularPosts = async () => {
    try {
      const roomId = '67dfb2b99a39446d9a238050'; // Replace with actual room ID logic
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
      const roomId = '67dfb2b99a39446d9a238050'; // Replace with actual room ID logic
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
      const roomId = '67dfb2b99a39446d9a238050'; // Replace with actual room ID logic
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
      return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
    } else if (sortBy === 'recent') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  // Create a new post
  const handleCreatePost = async (postData) => {
    try {
      const roomId = "67dfb2b99a39446d9a238050"; // Replace with actual room ID logic
      const authorId = session?._id; // Extract author ID from session
      const postDataToSend = {
        roomId,
        posttitle: postData.title,
        postdescription: postData.description,
        postauthor: {
          authorId,
          name: `${session?.firstname || ""} ${session?.lastname || ""}`.trim() || "Anonymous",
          avatar: session?.profilePic || "/placeholder.svg",
        },
      };
  
      const response = await API.post("/room/create/post", postDataToSend);
  
      // Validate backend response
      if (!response || !response.data || !response.data.post) {
        console.error("Invalid response from backend:", response);
        throw new Error("Failed to create post");
      }
  
      const newPost = response.data.post; // Extract the new post from the response
  
      // Update posts state
      setPosts([newPost, ...posts]);
      setShowCreatePost(false); // Close the dialog after creating the post

      // Show success toast
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
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
              <TabsTrigger value="myposts">My Posts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <Card key={post.postid} className="overflow-hidden">
              <div className="flex">
                {/* Vote Column */}
                <div className="flex flex-col items-center py-4 px-2 bg-slate-50">
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                  <span className="text-sm font-medium my-1">{post.upvotes - post.downvotes}</span>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
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
                      className="text-muted-foreground"
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
                        {post.comments.length > 0 ? (
                          post.comments.map((comment) => (
                            <Comment
                              key={comment.id}
                              comment={comment}
                              postId={post.postid}
                              onUpdateComments={(updatedComments) => {
                                setPosts(
                                  posts.map((p) =>
                                    p.postid === post.postid
                                      ? { ...p, comments: updatedComments }
                                      : p,
                                  ),
                                );
                              }}
                            />
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No comments yet.</p>
                        )}
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
      {showCreatePost && (
        <CreatePost onClose={() => setShowCreatePost(false)} onSubmit={handleCreatePost} />
      )}
    </div>
  );
}
