import { useEffect, useState } from 'react';
import { Globe2, Users, MessageCircle, Stamp, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/Components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import API from '../api';
import { motion } from 'framer-motion';

function HomePage() {
  const navigate = useNavigate();

  const [mentors, setMentors] = useState([]);
  const mentorIds = [
    '67a9fb9e902708715f3a8be5',
    '67b5889c669063e3459a69d0',
    '67b588b2669063e3459a69d3',
  ];

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const mentorData = await Promise.all(
          mentorIds.map((id) =>
            API.get(`/mentor/${id}`)  
              .then((response) => response.data)
          )
        );
        setMentors(mentorData);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };    
  
    fetchMentors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  

  return (
    <div className="pt-[90px] px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section
          className="relative mb-16 h-[450px] bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url('./src/assets/HomePageBanner.jpeg')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black opacity-60 rounded-lg"></div>
          <div className="relative z-10 flex justify-center items-center h-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center text-white"
            >
              <h2 className="text-4xl sm:text-5xl font-semibold mb-4 text-cyan-50">
                Find the Right University, Mentor &amp; Resources
              </h2>
              <p className="text-lg mb-6 text-cyan-50">
                Empowering students to achieve academic excellence with personalized guidance.
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center"
              >
                <Button
                  className="py-3 px-8 rounded-lg font-medium hover:bg-gray-700 transition duration-300"
                  onClick={() => navigate('/universities')}
                >
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* University Filter Section */}
        <section className="w-full py-7 md:py-7 lg:py-7">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Find Your Perfect University Match
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Use our advanced filtering system to discover universities that align with your
                  academic goals and preferences.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl mt-8 grid gap-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Field of Study" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="arts">Arts & Design</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Budget Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">$10k - $20k</SelectItem>
                    <SelectItem value="medium">$20k - $35k</SelectItem>
                    <SelectItem value="high">$35k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search universities by name..." className="pl-8" />
              </div>
              <Button className="w-full" size="lg">
                Find Universities
              </Button>
            </div>
          </div>
        </section>

        {/* Mentor Highlights */}
        <section className="w-full py-12 md:py-12 lg:py-12 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Meet Our Expert Mentors
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Learn from experienced alumni and current students who have successfully navigated
                  the international education journey.
                </p>
              </div>
            </div>
            <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
              {mentors.map((mentor) => (
                <Card key={mentor._id}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40`} // You can replace this with an actual image URL if available
                        alt="Mentor avatar"
                      />
                      <AvatarFallback>MN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <CardTitle>{`${mentor.firstname} ${mentor.lastname}`}</CardTitle>
                      <CardDescription>Harvard University, Class of 2022</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">Computer Science</Badge>
                      <Badge variant="secondary">MBA</Badge>
                      <Badge variant="secondary">Scholarships</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      &quot;I help students navigate the complex admission process and secure
                      scholarships for their dream universities.&quot;
                    </p>
                    <Button className="w-full mt-4">Connect with Mentor</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button variant="outline" size="lg">
                View All Mentors
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-12 md:py-12 lg:py-12 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Student Success Stories
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Hear from students who achieved their international education goals with UniGuide.
                </p>
              </div>
            </div>
            <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((testimonial) => (
                <Card key={testimonial}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      &quot;UniGuide&apos;s mentorship program was instrumental in helping me secure
                      admission to my dream university. The personalized guidance made all the
                      difference!&quot;
                    </p>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40`}
                          alt="Student avatar"
                        />
                        <AvatarFallback>ST</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Alex Chen</p>
                        <p className="text-sm text-muted-foreground">MIT, Class of 2023</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Explore More Section */}
        <section className="mb-16 py-12">
          <h2 className="text-3xl font-semibold text-foreground mb-8">Discover More Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Discussion Rooms Link */}
            <Card className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground mb-4">
                  Join Discussion Rooms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Engage with peers, mentors, and experts in various academic discussion rooms.
                </p>
                <Button variant="link" onClick={() => navigate('/discussionrooms')}>
                  Explore Now
                </Button>
              </CardContent>
            </Card>

            {/* Visa Information Link */}
            <Card className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground mb-4">
                  Visa Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access visa-related resources, experiences, and country-specific details to plan
                  your journey.
                </p>
                <Button variant="link" onClick={() => navigate('/visasection')}>
                  Explore Now
                </Button>
              </CardContent>
            </Card>

            {/* About Us Link */}
            <Card className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground mb-4">
                  Learn More About Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Discover who we are, our mission, and how we can help you achieve your academic
                  goals.
                </p>
                <Button variant="link" onClick={() => navigate('/aboutus')}>
                  Read More
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-12 lg:py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
              <div className="flex flex-col items-center">
                <Globe2 className="text-4xl mb-2 text-blue-600" />
                <h4 className="text-xl font-semibold">Countries Supported</h4>
                <p className="text-2xl font-semibold text-gray-900">50+</p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="text-4xl mb-2 text-green-600" />
                <h4 className="text-xl font-semibold">Mentors</h4>
                <p className="text-2xl font-semibold text-gray-900">100+</p>
              </div>
              <div className="flex flex-col items-center">
                <MessageCircle className="text-4xl mb-2 text-yellow-600" />
                <h4 className="text-xl font-semibold">Discussion Rooms</h4>
                <p className="text-2xl font-semibold text-gray-900">20+</p>
              </div>
              <div className="flex flex-col items-center">
                <Stamp className="text-4xl mb-2 text-purple-600" />
                <h4 className="text-xl font-semibold">Success Stories</h4>
                <p className="text-2xl font-semibold text-gray-900">300+</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
