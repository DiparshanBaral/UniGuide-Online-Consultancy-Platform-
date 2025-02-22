import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import API from '../api';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import RatingStars from '@/components/ui/rating-stars';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageSquare, Briefcase, Globe, BookOpen } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function MentorProfile() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [description, setDescription] = useState('');
  const session = JSON.parse(localStorage.getItem('session'));

  useEffect(() => {
    const fetchMentorData = async () => {
      setIsLoading(true);
      try {
        const response = await API.get(`/mentor/${id}`);
        setMentor(response.data);
      } catch (error) {
        console.error('Error fetching mentor data:', error);
        toast.error('Failed to fetch mentor data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentorData();
  }, [id]);

  // Handle connection request submission
  const handleApplyForConnection = async () => {
    if (!description.trim()) {
      toast.error('Please provide a description for your connection request.');
      return;
    }

    try {
      const session = JSON.parse(localStorage.getItem('session'));
      if (!session || !session.token) {
        toast.error('You must be logged in to apply for a connection.');
        return;
      }

      const response = await API.post(
        '/connections/apply',
        {
          studentId: session._id,
          mentorId: id,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`, // Ensure the token is included in the request
          },
        },
      );

      if (response.status === 201) {
        toast.success('Connection request submitted successfully!');
        setIsDialogOpen(false); // Close the dialog after successful submission
        setDescription(''); // Reset the description field
      }
    } catch (error) {
      console.error('Error submitting connection request:', error);
      toast.error(error.response?.data?.error || 'An error occurred while submitting the request.');
    }
  };

  if (isLoading) {
    return (
      <div className="pt-[90px] min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="pt-[90px] min-h-screen bg-gray-100 flex justify-center items-center">
        <p className="text-gray-800">Mentor profile not found.</p>
      </div>
    );
  }

  return (
    <div className="mt-[60px] min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <section className="relative py-6 md:py-12 bg-gradient-to-b from-primary/5 to-background">
          <motion.div
            className="container px-4 md:px-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex flex-col items-center text-center space-y-4"
              variants={itemVariants}
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <img
                  src={mentor.profilePic || '/placeholder.svg'}
                  alt={`${mentor.firstname} ${mentor.lastname}`}
                  className="w-full h-full rounded-full object-cover border-4 border-background shadow-xl"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  {mentor.firstname} {mentor.lastname}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Mentor for {mentor.university || 'Not specified'}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <RatingStars
                    rating={Array.isArray(mentor.rating) ? mentor.rating[0] : Number(mentor.rating)}
                  />
                  <span className="text-sm text-muted-foreground">
                    ({mentor.totalReviews || 0} reviews)
                  </span>
                </div>
                {/* Connect with Mentor Button */}
                {session && session.role === 'student' && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default" className="mt-4">
                        Connect with Mentor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Request Connection</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Textarea
                          placeholder="Describe why you want to connect with this mentor..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="resize-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleApplyForConnection}>Submit</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <motion.div
            className="container px-4 md:px-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Expertise */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="size-5" />
                    Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(mentor.expertise || []).map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Languages */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="size-5" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mentor.languages && mentor.languages.length > 0
                      ? mentor.languages.map((language) => (
                          <Badge key={language} variant="outline">
                            {language}
                          </Badge>
                        ))
                      : ['English', 'Nepali'].map((language) => (
                          <Badge key={language} variant="outline">
                            {language}
                          </Badge>
                        ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Experience */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="size-5" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {mentor.yearsOfExperience
                        ? `${mentor.yearsOfExperience} years`
                        : 'Not specified'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reviews */}
            <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="size-5" />
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {(mentor.reviews || []).map((review) => (
                      <div key={review.id} className="space-y-4 p-4 rounded-lg bg-muted">
                        <div className="flex items-start gap-4">
                          <img
                            src={review.authorAvatar || '/placeholder.svg'}
                            alt={review.authorName}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{review.authorName}</p>
                            <RatingStars rating={review.rating} size="sm" />
                          </div>
                          <time className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </time>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

export default MentorProfile;
