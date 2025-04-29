import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import API from '../api';
import { Button } from '@/Components/ui/button';
import { AvatarUpload } from '@/Components/ui/avatarupload';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Badge } from '@/Components/ui/badge';
import {
  AlertCircle,
  BookOpen,
  School,
  UserRound,
  Edit,
  CheckCircle2,
  Briefcase,
  Globe,
  MessageSquare,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import MentorProfileForm from '@/Components/Mentor-form';
import MentorReviewsList from '@/Components/mentor-reviews-list';
import RatingStars from '@/Components/ui/rating-stars';
import PasswordUpdateForm from "@/Components/PasswordUpdateForm";

function MentorProfilePersonal() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const session = JSON.parse(localStorage.getItem('session'));
        if (session && session._id && session.token) {
          const response = await API.get(`/mentor/profile/${session._id}`, {
            headers: { Authorization: `Bearer ${session.token}` },
          });
          if (response.status === 200) {
            const userData = response.data;
            setUser(userData);
            setUpdatedUser(userData);
            fetchAverageRating(session._id, session.token);
          } else {
            console.error('Failed to fetch user data:', response.statusText);
            toast.error('Failed to fetch user data. Please log in again.');
          }
        } else {
          console.error('No valid session found in localStorage');
          toast.error('No valid session found. Please log in again.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('An error occurred while fetching user data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch average rating for the mentor
  const fetchAverageRating = async (mentorId, token) => {
    try {
      const response = await API.get(`/review/${mentorId}/average`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAverageRating(Number.parseFloat(response.data.averageRating) || 0);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };

  // Function to refetch user data after profile completion
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const session = JSON.parse(localStorage.getItem('session'));
      if (session && session._id && session.token) {
        const response = await API.get(`/mentor/profile/${session._id}`, {
          headers: { Authorization: `Bearer ${session.token}` },
        });
        if (response.status === 200) {
          setUser(response.data);
          setUpdatedUser(response.data);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
          toast.error('Failed to fetch user data. Please log in again.');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('An error occurred while fetching user data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUpdatedUser((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else if (name === 'expertise') {
      setUpdatedUser((prev) => ({
        ...prev,
        expertise: value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item !== ''),
      }));
    } else if (name === 'languages') {
      setUpdatedUser((prev) => ({
        ...prev,
        languages: value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item !== ''),
      }));
    } else {
      setUpdatedUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdateProfile = async () => {
    if (!updatedUser.firstname || !updatedUser.lastname || !updatedUser.email) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setIsLoading(true);
    try {
      const session = JSON.parse(localStorage.getItem('session'));
      const formData = new FormData();
      // Append updated fields to FormData
      formData.append('firstname', updatedUser.firstname);
      formData.append('lastname', updatedUser.lastname);
      formData.append('email', updatedUser.email);
      formData.append('bio', updatedUser.bio || '');
      formData.append('expertise', JSON.stringify(updatedUser.expertise || []));
      // University field removed as it's determined through affiliation
      formData.append('degree', updatedUser.degree || '');
      formData.append('yearsOfExperience', updatedUser.yearsOfExperience || 0);
      // Consultation fee fields removed as they're determined through negotiation
      formData.append('languages', JSON.stringify(updatedUser.languages || []));
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }
      const response = await API.put(`/mentor/${user._id}`, formData, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      if (response.status === 200) {
        setUser(response.data);
        setUpdatedUser(response.data);
        setProfilePic(null);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(`Failed to update profile: ${response.statusText}`);
      }
    } catch (error) {
      toast.error('An error occurred while updating the profile. ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">No user data found.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-16 bg-gradient-to-b from-background to-primary/5 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {!user.profileCompleted && (
          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <AlertTitle className="text-amber-500 font-medium">
              Complete your mentor profile
            </AlertTitle>
            <AlertDescription className="text-amber-500/90">
              Your profile is incomplete. Complete your profile to be visible to students and start
              mentoring.
            </AlertDescription>
            <Button
              className="mt-2 bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => setIsProfileFormOpen(true)} // Open the MentorProfileForm dialog
            >
              Complete Profile
            </Button>
          </Alert>
        )}
        <Card className="border-primary/10 shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary to-primary/60"></div>
          <div className="px-6 sm:px-10 pt-5 pb-6 -mt-16 relative">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              <div className="relative flex justify-center">
                <div className="h-32 w-32 rounded-full border-4 border-background overflow-hidden bg-background flex items-center justify-center">
                  <AvatarUpload
                    currentAvatar={user.profilePic}
                    onImageSelect={(file) => setProfilePic(file)}
                    onRemove={() => setProfilePic(null)}
                    isEditing={isEditing}
                  />
                </div>
                {user.profileCompleted && (
                  <Badge className="absolute bottom-0 right-0 bg-green-500 text-white border-0 flex items-center gap-1 px-2 py-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">{`${user.firstname} ${user.lastname}`}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                    {user.university && (
                      <p className="text-sm flex items-center gap-1 mt-1">
                        <School className="h-3.5 w-3.5 text-primary" />
                        {user.university}, {user.degree || ''}
                      </p>
                    )}
                  </div>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="sm:self-start flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2 sm:self-start">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateProfile}>Save Changes</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Tabs defaultValue="profile" className="px-6 sm:px-10 pb-6">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              {!isEditing ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <UserRound className="h-5 w-5 text-primary" />
                        About Me
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{user.bio || 'No bio available.'}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Experience
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Years of Experience:</span>
                          <span className="text-muted-foreground ml-2">
                            {user.yearsOfExperience || 'Not specified'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Expertise
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {user.expertise && user.expertise.length > 0 ? (
                          user.expertise.map((exp, index) => {
                            const cleanExpertise =
                              typeof exp === 'string'
                                ? exp.replace(/^"\\"|"\\"|""|\\"|"$/g, '')
                                : exp;
                            return (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-primary/10 text-primary"
                              >
                                {cleanExpertise}
                              </Badge>
                            );
                          })
                        ) : (
                          <p className="text-muted-foreground">No expertise specified.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        Languages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {user.languages && user.languages.length > 0 ? (
                          user.languages.map((lang, index) => {
                            const cleanLanguage =
                              typeof lang === 'string'
                                ? lang.replace(/^"\\"|"\\"|""|\\"|"$/g, '')
                                : lang;
                            return (
                              <Badge key={index} variant="outline">
                                {cleanLanguage}
                              </Badge>
                            );
                          })
                        ) : (
                          <p className="text-muted-foreground">No languages specified.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <input
                        type="text"
                        name="firstname"
                        value={updatedUser.firstname}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <input
                        type="text"
                        name="lastname"
                        value={updatedUser.lastname}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={updatedUser.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea
                      name="bio"
                      value={updatedUser.bio || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px]"
                    />
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Degree</label>
                      <input
                        type="text"
                        name="degree"
                        value={updatedUser.degree || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Years of Experience</label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={updatedUser.yearsOfExperience || 0}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expertise (comma separated)</label>
                    <input
                      type="text"
                      name="expertise"
                      value={
                        Array.isArray(updatedUser.expertise) ? updatedUser.expertise.join(', ') : ''
                      }
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="e.g., Scholarship Applications, Visa Process, Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Languages (comma separated)</label>
                    <input
                      type="text"
                      name="languages"
                      value={
                        Array.isArray(updatedUser.languages) ? updatedUser.languages.join(', ') : ''
                      }
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="e.g., English, Spanish, French"
                    />
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="reviews">
              <Card className="border-primary/10 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Student Reviews
                    </CardTitle>
                    <CardDescription>What students say about your mentorship</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <RatingStars rating={averageRating} />
                    <span className="font-medium">{averageRating.toFixed(1)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <MentorReviewsList mentorId={user._id} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security">
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Update Password
                  </CardTitle>
                  <CardDescription>Change your account password</CardDescription>
                </CardHeader>
                <CardContent>
                  <PasswordUpdateForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Render the MentorProfileForm dialog */}
        <MentorProfileForm
          isOpen={isProfileFormOpen}
          onClose={() => {
            setIsProfileFormOpen(false);
            fetchUserData(); // Refetch user data to update the profile
          }}
          userId={user?._id}
        />
      </div>
    </div>
  );
}

export default MentorProfilePersonal;
