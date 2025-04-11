'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BookOpen, School, MapPin, GraduationCap, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PublicStudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistUniversities, setWishlistUniversities] = useState([]);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      console.log('Fetching student profile with ID:', id);
      try {
        const response = await API.get(`/student/public/${id}`, {
          withCredentials: true,
        });
        setStudent(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [id]);

  // Fetch wishlist universities for the student
  useEffect(() => {
    const fetchWishlistUniversities = async () => {
      try {
        const response = await API.get('/student/wishlist', {
          params: { studentId: id }, // Pass the student ID as a query parameter
        });

        if (response.status === 200) {
          setWishlistUniversities(response.data.wishlistUniversities);
        } else {
          console.error('Failed to fetch wishlist universities:', response.statusText);
          toast.error('Failed to fetch wishlist universities.');
        }
      } catch (error) {
        console.error('Error fetching wishlist universities:', error);
        toast.error('An error occurred while fetching wishlist universities.');
      }
    };

    fetchWishlistUniversities();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-[90px] min-h-screen bg-gradient-to-b from-background to-primary/5 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-[90px] min-h-screen bg-gradient-to-b from-background to-primary/5 flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-[60px] min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          className="grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Profile Info */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <Card className="border-primary/10 shadow-lg overflow-hidden sticky top-24">
              <div className="h-24 bg-gradient-to-r from-primary to-primary/60"></div>
              <div className="flex flex-col items-center -mt-12 p-6">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage
                    src={student.profilePic || '/placeholder.svg'}
                    alt={`${student.firstname} ${student.lastname}`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {student.firstname?.[0]}
                    {student.lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mt-4">{`${student.firstname} ${student.lastname}`}</h2>
                <p className="text-muted-foreground flex items-center gap-1 mt-1">
                  <School className="h-4 w-4" />
                  {student.major || 'Major not specified'}
                </p>

                <Separator className="my-4" />

                <div className="w-full space-y-4">
                  {student.targetedUniversities && student.targetedUniversities.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        Target Universities
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {wishlistUniversities.map((uni, index) => (
                          <Badge key={index} variant="outline" className="bg-primary/5">
                            {uni.name} ({uni.country})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {student.bio || "This student hasn't added a bio yet."}
                </p>
              </CardContent>
            </Card>

            {/* Academic Interests */}
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Academic Interests
                </CardTitle>
                <CardDescription>Fields of study and academic pursuits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-primary/5 flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <School className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Major</h3>
                      <p className="text-muted-foreground">{student.major || 'Not specified'}</p>
                    </div>
                  </div>

                  {student.targetedUniversities && student.targetedUniversities.length > 0 && (
                    <div className="p-4 rounded-lg bg-primary/5 flex items-start gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Targeted Universities</h3>
                        <div className="flex flex-wrap gap-2">
                          {wishlistUniversities.map((uni, index) => (
                            <Badge key={index} variant="outline" className="bg-primary/5">
                              {uni.name} ({uni.country})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicStudentProfile;