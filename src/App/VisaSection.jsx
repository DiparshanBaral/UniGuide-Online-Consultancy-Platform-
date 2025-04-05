'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Tabs as InnerTabs,
  TabsList as InnerTabsList,
  TabsTrigger as InnerTabsTrigger,
  TabsContent as InnerTabsContent,
} from '@/components/ui/tabs';
import {
  Globe,
  BookOpen,
  MessageSquare,
  FileText,
  ChevronRight,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  Trash2,
  Edit,
  Heart,
  Share2,
  ArrowLeft,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import API from '../api';
import ExperienceDetail from '@/components/experience-detail';

export default function VisaSection() {
  // State for tabs
  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState('experiences');
  const [innerTab, setInnerTab] = useState('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // State for form inputs
  const [title, setTitle] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [content, setContent] = useState('');

  // State for API data
  const [experiences, setExperiences] = useState([]);
  const [recentExperiences, setRecentExperiences] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  // State for pagination
  const [visibleExperiences, setVisibleExperiences] = useState(6);
  const [visibleRecentExperiences, setVisibleRecentExperiences] = useState(6);
  const [visibleUserPosts, setVisibleUserPosts] = useState(6);

  // State for selected experience
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);

  const countries = [
    {
      name: 'United States',
      code: 'us',
      flag: '🇺🇸',
      visaTypes: ['F-1 Student Visa', 'J-1 Exchange Visitor'],
      processingTime: '3-5 weeks',
    },
    {
      name: 'United Kingdom',
      code: 'uk',
      flag: '🇬🇧',
      visaTypes: ['Student Visa (Tier 4)', 'Short-term Study Visa'],
      processingTime: '3 weeks',
    },
    {
      name: 'Canada',
      code: 'canada',
      flag: '🇨🇦',
      visaTypes: ['Study Permit', 'Student Direct Stream'],
      processingTime: '4-8 weeks',
    },
    {
      name: 'Australia',
      code: 'australia',
      flag: '🇦🇺',
      visaTypes: ['Student Visa (Subclass 500)'],
      processingTime: '4-6 weeks',
    },
  ];

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      try {
        setSession(JSON.parse(savedSession)); // Set session from localStorage if it exists
      } catch (err) {
        console.error('Error parsing session from localStorage:', err);
      }
    }
  }, []);

  // Fetch all visa experiences
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await API.get('/visa/experiences', {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        });

        // Check if response exists and is successful
        if (response && response.status === 200) {
          setExperiences(response.data || []);
          setError(null);
        } else {
          throw new Error('Failed to fetch experiences');
        }
      } catch (err) {
        setError('Failed to load visa experiences. Please try again later.');
        console.error('Error fetching experiences:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchExperiences();
    }
  }, [session]);

  // Fetch recent experiences
  useEffect(() => {
    const fetchRecentExperiences = async () => {
      try {
        setLoadingRecent(true);
        const response = await API.get('/visa/experiences/recent', {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        });

        // Check if response exists and is successful
        if (response && response.status === 200) {
          setRecentExperiences(response.data || []);
        } else {
          console.error('Failed to fetch recent experiences');
        }
      } catch (err) {
        console.error('Error fetching recent experiences:', err);
      } finally {
        setLoadingRecent(false);
      }
    };

    if (session) {
      fetchRecentExperiences();
    }
  }, [session]);

  // Fetch user's posts when session is available
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!session || !session._id) return;

      try {
        const response = await API.get(`/visa/experience/author/${session._id}`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        // Check if response exists and is successful
        if (response && response.status === 200) {
          setUserPosts(response.data || []);
        } else {
          console.error('API Error: Failed to fetch your posts');
        }
      } catch (err) {
        console.error('Error fetching user posts:', err);
      }
    };

    if (session) {
      fetchUserPosts();
    }
  }, [session]);

  // Handle form submission for new experience
  const handleSubmitExperience = async (e) => {
    e.preventDefault();

    if (!session) {
      toast.error('Please log in to share your experience.');
      return;
    }

    if (!title || !selectedCountry || !content) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);

      // Find the selected country details
      const countryDetails = countries.find((c) => c.code === selectedCountry);
      if (!countryDetails) {
        throw new Error('Invalid country selected');
      }

      const response = await API.post(
        '/visa/experience',
        {
          country: countryDetails.name,
          flag: countryDetails.flag,
          title,
          excerpt: content,
          author: {
            authorId: session._id,
            name: `${session.firstname} ${session.lastname}`,
            avatar: session.profilePic || `https://ui-avatars.com/api/?name=${session.firstname}`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        },
      );

      // Check if response exists and is successful
      if (response && response.status === 201) {
        // Reset form and close dialog
        setTitle('');
        setSelectedCountry('');
        setContent('');
        setShareDialogOpen(false);

        // Fetch updated experiences
        const fetchUpdatedData = async () => {
          try {
            // Fetch updated experiences
            const experiencesResponse = await API.get('/visa/experiences', {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            });

            if (experiencesResponse && experiencesResponse.status === 200) {
              setExperiences(experiencesResponse.data || []);
            }

            // Fetch updated recent experiences
            const recentResponse = await API.get('/visa/recent-experiences', {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            });

            if (recentResponse && recentResponse.status === 200) {
              setRecentExperiences(recentResponse.data || []);
            }

            // Fetch updated user posts
            const userPostsResponse = await API.get(`/visa/experience/author/${session._id}`, {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            });

            if (userPostsResponse && userPostsResponse.status === 200) {
              setUserPosts(userPostsResponse.data || []);
            }
          } catch (error) {
            console.error('Error refreshing data:', error);
          }
        };

        await fetchUpdatedData();
        toast.success('Your visa experience has been posted successfully.');
      } else {
        throw new Error('Failed to post experience');
      }
    } catch (err) {
      console.error('Error posting experience:', err);
      toast.error('Failed to post your experience. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle deleting a post
  const handleDeletePost = async (country, postid) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await API.delete('/visa/experience', {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        data: {
          country,
          postid,
        },
      });

      // Check if response exists and is successful
      if (response && response.status === 200) {
        // Remove the post from userPosts state
        setUserPosts(userPosts.filter((post) => post.postid !== postid));

        // Also remove from experiences if it exists there
        setExperiences(experiences.filter((exp) => exp.postid !== postid));

        // Also remove from recent experiences if it exists there
        setRecentExperiences(recentExperiences.filter((exp) => exp.postid !== postid));

        toast.success('Your post has been deleted successfully.');
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error('Failed to delete your post. Please try again.');
    }
  };

  // Handle liking a post
  const handleLikePost = async (country, postid) => {
    if (!session) {
      toast.error('Please log in to like posts.');
      return;
    }

    // Check if postid exists - DEBUG the issue
    if (!postid) {
      console.error('Missing postid for post:', { country, postid });
      toast.error('Unable to like this post. Missing post ID.');
      return;
    }

    try {
      console.log('Liking post with:', { country, postid });

      const response = await API.post(
        '/visa/experience/like',
        {
          country,
          postid,
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        },
      );

      if (response && response.status === 200) {
        // Update likes count in experiences
        setExperiences(
          experiences.map((exp) => {
            if (exp.postid === postid) {
              return { ...exp, likes: response.data.likes };
            }
            return exp;
          }),
        );

        // Update likes count in recent experiences
        setRecentExperiences(
          recentExperiences.map((exp) => {
            if (exp.postid === postid) {
              return { ...exp, likes: response.data.likes };
            }
            return exp;
          }),
        );

        // Update likes count in user posts
        setUserPosts(
          userPosts.map((post) => {
            if (post.postid === postid) {
              return { ...post, likes: response.data.likes };
            }
            return post;
          }),
        );

        toast.success('Post liked!');
      } else {
        throw new Error(response?.data?.message || 'Failed to like post');
      }
    } catch (err) {
      console.error('Error liking post:', err);
      toast.error(err.message || 'Failed to like post. Please try again.');
    }
  };

  // Handle viewing full post
  const handleViewFullPost = (post) => {
    setSelectedExperience(post);
    setShowDetailView(true);
  };

  // Handle going back from detail view
  const handleBackFromDetail = () => {
    setShowDetailView(false);
    setSelectedExperience(null);
  };

  // Load more experiences
  const handleLoadMoreExperiences = () => {
    setVisibleExperiences((prev) => prev + 6);
  };

  // Load more recent experiences
  const handleLoadMoreRecentExperiences = () => {
    setVisibleRecentExperiences((prev) => prev + 6);
  };

  // Load more user posts
  const handleLoadMoreUserPosts = () => {
    setVisibleUserPosts((prev) => prev + 6);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const flagVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 200, damping: 10 },
    },
    hover: {
      scale: 1.1,
      transition: { type: 'spring', stiffness: 300, damping: 10 },
    },
  };

  // Format date helper function
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.log(error);
      return dateString;
    }
  };

  // If detail view is active, show the experience detail component

  return (
    <div className="mt-[30px] w-full bg-gradient-to-b from-slate-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="relative border-b">
        {/* Custom background with three parts */}
        <div className="absolute inset-0">
          {/* First third: Black */}
          <div className="absolute top-0 left-0 w-full h-1/3 bg-black"></div>
          {/* Second third: Black */}
          <div className="absolute top-1/3 left-0 w-full h-1/3 bg-black"></div>
          {/* Final third: Gradient from black to white */}
          <div className="absolute top-2/3 left-0 w-full h-1/3 bg-gradient-to-b from-black to-white"></div>
        </div>

        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6"
              variants={itemVariants}
            >
              Visa Information Hub
            </motion.h1>
            <motion.p
              className="mt-3 text-xl text-gray-200 sm:mt-5 sm:text-2xl max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Your complete resource for student visa requirements, experiences, and expert guidance
            </motion.p>

            <motion.div
              className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-2 max-w-sm mx-auto"
              variants={containerVariants}
            >
              {countries.map((country, index) => (
                <motion.div
                  key={country.code}
                  className="text-center"
                  variants={itemVariants}
                  custom={index}
                  whileHover="hover"
                >
                  <motion.div
                    className="flex items-center justify-center w-12 h-12 bg-black/30 rounded-full backdrop-blur-sm border border-white/20"
                    variants={flagVariants}
                  >
                    <span className="text-2xl">{country.flag}</span>
                  </motion.div>
                  <motion.p className="mt-1 text-xs font-medium" variants={itemVariants}>
                    {country.name}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {showDetailView && selectedExperience ? (
          <ExperienceDetail
            experience={selectedExperience}
            onBack={handleBackFromDetail}
            onLike={handleLikePost}
            onDelete={
              session && selectedExperience.authorId === session._id ? handleDeletePost : null
            }
          />
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Tabs Navigation */}
            <Tabs defaultValue="experiences" className="mb-12" onValueChange={setActiveTab}>
              <div className="border-b">
                <TabsList className="mx-auto flex justify-center h-12 bg-transparent space-x-8">
                  <TabsTrigger
                    value="experiences"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none px-1 py-3"
                  >
                    Visa Experiences
                  </TabsTrigger>
                  <TabsTrigger
                    value="countries"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none px-1 py-3"
                  >
                    Country Information
                  </TabsTrigger>
                  <TabsTrigger
                    value="resources"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none px-1 py-3"
                  >
                    Resources
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Visa Experiences Tab */}
              <TabsContent value="experiences" className="mt-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Student Visa Experiences</h2>
                  <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Share Your Experience</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Share Your Visa Experience</DialogTitle>
                        <DialogDescription>
                          Help other students by sharing your visa application and interview
                          experience.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitExperience}>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <label htmlFor="title" className="text-sm font-medium">
                              Title
                            </label>
                            <Input
                              id="title"
                              placeholder="E.g., My F-1 Visa Interview Experience"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <label htmlFor="country" className="text-sm font-medium">
                              Country
                            </label>
                            <Select
                              value={selectedCountry}
                              onValueChange={setSelectedCountry}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country.code} value={country.code}>
                                    {country.flag} {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <label htmlFor="experience" className="text-sm font-medium">
                              Your Experience
                            </label>
                            <Textarea
                              id="experience"
                              placeholder="Share details about your preparation, documents, interview questions, and tips for others..."
                              rows={6}
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => setShareDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={submitting}>
                            {submitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              'Submit Experience'
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <InnerTabs defaultValue="all" value={innerTab} onValueChange={setInnerTab}>
                  <InnerTabsList className="mb-6">
                    <InnerTabsTrigger value="all">All Experiences</InnerTabsTrigger>
                    <InnerTabsTrigger value="recent">Recent</InnerTabsTrigger>
                    <InnerTabsTrigger value="yours" disabled={!session}>
                      Your Posts
                    </InnerTabsTrigger>
                  </InnerTabsList>

                  {/* All Experiences Tab */}
                  <InnerTabsContent value="all">
                    {error && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-black" />
                        <span className="ml-2">Loading experiences...</span>
                      </div>
                    ) : experiences.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No visa experiences have been shared yet.</p>
                        <Button className="mt-4" onClick={() => setShareDialogOpen(true)}>
                          Be the first to share
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {experiences.slice(0, visibleExperiences).map((exp, index) => (
                            <Card
                              key={index}
                              className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-2"
                            >
                              <CardHeader className="pb-4 relative">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                    <Badge className="px-2 py-1 bg-black text-white">
                                      {exp.flag} {exp.country}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" /> {formatDate(exp.date)}
                                    </span>
                                  </div>
                                </div>
                                <CardTitle className="mt-2 text-xl group-hover:text-black transition-colors">
                                  {exp.title}
                                </CardTitle>
                                <div className="flex items-center mt-2">
                                  <div className="bg-gray-200 rounded-full p-1 mr-2">
                                    <User className="h-4 w-4 text-gray-700" />
                                  </div>
                                  <CardDescription>By {exp.authorName}</CardDescription>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="relative">
                                  <div className="absolute left-0 top-0 w-1 h-full bg-black rounded-full"></div>
                                  <p className="text-gray-700 pl-4">{exp.excerpt}</p>
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-between border-t pt-4 pb-4">
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                  <button
                                    onClick={() => {
                                      // Log the complete experience object to see what's available
                                      console.log('Experience object:', exp);
                                      // Use _id as fallback if postid is missing
                                      const id =
                                        exp.postid || (exp._id ? exp._id.toString() : null);
                                      handleLikePost(exp.country, id);
                                    }}
                                    className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                                  >
                                    <Heart className="h-4 w-4 text-red-500" fill="red" />{' '}
                                    {exp.likes || 0}
                                  </button>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-black border-black group-hover:bg-black group-hover:text-white transition-colors"
                                  onClick={() => handleViewFullPost(exp)}
                                >
                                  Read More <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>

                        {experiences.length > visibleExperiences && (
                          <div className="mt-8 text-center">
                            <Button variant="outline" onClick={handleLoadMoreExperiences}>
                              Load More Experiences
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </InnerTabsContent>

                  {/* Recent Experiences Tab */}
                  <InnerTabsContent value="recent">
                    {loadingRecent ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-black" />
                        <span className="ml-2">Loading recent experiences...</span>
                      </div>
                    ) : recentExperiences.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">
                          No recent visa experiences have been shared yet.
                        </p>
                        <Button className="mt-4" onClick={() => setShareDialogOpen(true)}>
                          Be the first to share
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {recentExperiences
                            .slice(0, visibleRecentExperiences)
                            .map((exp, index) => (
                              <Card
                                key={index}
                                className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-2"
                              >
                                <CardHeader className="pb-4 relative">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                      <Badge className="px-2 py-1 bg-black text-white">
                                        {exp.flag} {exp.country}
                                      </Badge>
                                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> {formatDate(exp.date)}
                                      </span>
                                    </div>
                                  </div>
                                  <CardTitle className="mt-2 text-xl group-hover:text-black transition-colors">
                                    {exp.title}
                                  </CardTitle>
                                  <div className="flex items-center mt-2">
                                    <div className="bg-gray-200 rounded-full p-1 mr-2">
                                      <User className="h-4 w-4 text-gray-700" />
                                    </div>
                                    <CardDescription>By {exp.authorName}</CardDescription>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="relative">
                                    <div className="absolute left-0 top-0 w-1 h-full bg-black rounded-full"></div>
                                    <p className="text-gray-700 pl-4">{exp.excerpt}</p>
                                  </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t pt-4 pb-4">
                                  <div className="flex gap-4 text-sm text-muted-foreground">
                                    <button
                                      onClick={() => handleLikePost(exp.country, exp.postid)}
                                      className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                                    >
                                      <Heart className="h-4 w-4 text-red-500" fill="red" />{' '}
                                      {exp.likes || 0}
                                    </button>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-black border-black group-hover:bg-black group-hover:text-white transition-colors"
                                    onClick={() => handleViewFullPost(exp)}
                                  >
                                    Read More <ChevronRight className="h-4 w-4 ml-1" />
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                        </div>

                        {recentExperiences.length > visibleRecentExperiences && (
                          <div className="mt-8 text-center">
                            <Button variant="outline" onClick={handleLoadMoreRecentExperiences}>
                              Load More Experiences
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </InnerTabsContent>

                  {/* Your Posts Tab */}
                  <InnerTabsContent value="yours">
                    {!session ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">Please log in to view your posts.</p>
                      </div>
                    ) : userPosts.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">
                          You haven&apos;t shared any visa experiences yet.
                        </p>
                        <Button className="mt-4" onClick={() => setShareDialogOpen(true)}>
                          Share your first experience
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {userPosts.slice(0, visibleUserPosts).map((post, index) => (
                            <Card
                              key={index}
                              className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-2"
                            >
                              <CardHeader className="pb-4 relative">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                    <Badge className="px-2 py-1 bg-black text-white">
                                      {post.flag} {post.country}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" /> {formatDate(post.date)}
                                    </span>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-red-500 hover:text-red-700"
                                      onClick={() => handleDeletePost(post.country, post.postid)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <CardTitle className="mt-2 text-xl group-hover:text-black transition-colors">
                                  {post.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="relative">
                                  <div className="absolute left-0 top-0 w-1 h-full bg-black rounded-full"></div>
                                  <p className="text-gray-700 pl-4">{post.excerpt}</p>
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-between border-t pt-4 pb-4">
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                  <button
                                    onClick={() => handleLikePost(post.country, post.postid)}
                                    className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                                  >
                                    <Heart className="h-4 w-4 text-red-500" fill="red" />{' '}
                                    {post.likes || 0}
                                  </button>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-black border-black group-hover:bg-black group-hover:text-white transition-colors"
                                  onClick={() => handleViewFullPost(post)}
                                >
                                  View Full Post <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>

                        {userPosts.length > visibleUserPosts && (
                          <div className="mt-8 text-center">
                            <Button variant="outline" onClick={handleLoadMoreUserPosts}>
                              Load More Posts
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </InnerTabsContent>
                </InnerTabs>
              </TabsContent>

              {/* Country Information Tab */}
              <TabsContent value="countries" className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Visa Information by Country
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {countries.map((country) => (
                    <Card
                      key={country.code}
                      className="overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-4 border-b">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{country.flag}</span>
                          <div>
                            <CardTitle>{country.name}</CardTitle>
                            <CardDescription>Student Visa Information</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">
                              Available Visa Types
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {country.visaTypes.map((type) => (
                                <Badge key={type} variant="secondary">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">
                              Average Processing Time
                            </h4>
                            <p>{country.processingTime}</p>
                          </div>
                          <div className="pt-2">
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">
                              Key Requirements
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              <li>Acceptance letter from institution</li>
                              <li>Proof of financial support</li>
                              <li>Valid passport</li>
                              <li>Health insurance</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Visa Resources & Guides</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-black" /> Document Checklists
                      </CardTitle>
                      <CardDescription>
                        Country-specific document requirements and preparation guides
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {countries.map((country) => (
                          <li key={country.code} className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <a href="#" className="text-black hover:underline">
                              {country.name} Visa Document Checklist
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Checklists
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-black" /> Interview Preparation
                      </CardTitle>
                      <CardDescription>
                        Common interview questions and preparation strategies
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li>
                          <a href="#" className="text-black hover:underline">
                            50+ Common Visa Interview Questions
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-black hover:underline">
                            How to Answer &quot;Ties to Home Country&quot; Questions
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-black hover:underline">
                            Explaining Your Financial Support Documents
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-black hover:underline">
                            Dress Code and Etiquette for Visa Interviews
                          </a>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Guides
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-black" /> Embassy Information
                      </CardTitle>
                      <CardDescription>
                        Contact details and appointment booking information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {countries.map((country) => (
                          <li key={country.code} className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <a href="#" className="text-black hover:underline">
                              {country.name} Embassy & Consulate Locations
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Embassy Info
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-black" /> Visa FAQs
                      </CardTitle>
                      <CardDescription>
                        Answers to frequently asked questions about student visas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li>
                          <a href="#" className="text-black hover:underline">
                            Working While Studying: What&apos;s Allowed?
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-black hover:underline">
                            Visa Renewal and Extension Procedures
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-black hover:underline">
                            Bringing Dependents on Student Visas
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-black hover:underline">
                            Post-Graduation Work Options
                          </a>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All FAQs
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Experience Detail View */}
            {showDetailView && selectedExperience && (
              <div className="mt-8">
                <Button
                  variant="ghost"
                  className="mb-4 hover:bg-gray-100"
                  onClick={handleBackFromDetail}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Experiences
                </Button>

                <Card className="overflow-hidden border-2 shadow-lg">
                  {/* Header */}
                  <div className="bg-black text-white p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="px-2 py-1 bg-white text-black">
                        {selectedExperience.flag} {selectedExperience.country}
                      </Badge>
                      <span className="text-sm text-gray-300 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {formatDate(selectedExperience.date)}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                      {selectedExperience.title}
                    </h1>

                    <div className="flex items-center">
                      <div className="bg-white rounded-full p-1 mr-2">
                        <User className="h-4 w-4 text-black" />
                      </div>
                      <span className="text-gray-300">By {selectedExperience.authorName}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedExperience.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t p-6 sm:p-8 flex justify-between items-center">
                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          handleLikePost(selectedExperience.country, selectedExperience.postid)
                        }
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors"
                      >
                        <Heart className="h-5 w-5 text-red-500" fill="red" />
                        <span>{selectedExperience.likes || 0} Likes</span>
                      </button>

                      <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors">
                        <Share2 className="h-5 w-5" /> Share
                      </button>
                    </div>

                    {session && selectedExperience.authorId === session._id && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Edit className="h-4 w-4" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() =>
                            handleDeletePost(selectedExperience.country, selectedExperience.postid)
                          }
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
