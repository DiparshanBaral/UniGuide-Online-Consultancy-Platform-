import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatCard } from '@/components/ui/stat-card';
import { InfoSection } from '@/components/ui/info-section';
import { Card } from '@/components/ui/card';
import {
  GraduationCap,
  MapPin,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Trophy,
  Users,
  BookOpen,
  DollarSign,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import API from '../api';
import { toast } from 'sonner';

const UniversityProfile = () => {
  const { country, universityId } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMentor, setIsMentor] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [document, setDocument] = useState(null);
  const [description, setDescription] = useState('');
  const [session, setSession] = useState(null);
  const [mentors, setMentors] = useState([]);

  // Fetch session data from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      setSession(parsedSession);
      setIsMentor(parsedSession.role === 'mentor');
    }
  }, []);

  //fetch mentors through mentorid
  useEffect(() => {
    const fetchMentors = async () => {
      if (university && university.affiliatedMentors && university.affiliatedMentors.length > 0) {
        try {
          const mentorPromises = university.affiliatedMentors.map(mentorId =>
            API.get(`/mentor/${mentorId}`)
          );

          const mentorResponses = await Promise.all(mentorPromises);
          const fetchedMentors = mentorResponses.map(response => response.data);
          setMentors(fetchedMentors);
        } catch (error) {
          console.error('Error fetching mentor information:', error);
        }
      }
    };

    fetchMentors();
  }, [university]);

  // Format currency helper
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

  // Fetch university data from the backend
  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await API.get(`/universities/${country}/${universityId}`);
        setUniversity(response.data);
      } catch (error) {
        console.error('Error fetching university data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [country, universityId]);

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleApply = async () => {
    if (!document || !description) {
      toast.error('Please upload a document and provide a description.');
      return;
    }

    if (!session || !session._id || !session.token) {
      toast.error('You must be logged in as a mentor to apply.');
      return;
    }

    const formData = new FormData();
    formData.append('document', document);
    formData.append('mentorId', session._id);
    formData.append('universityId', university._id);
    formData.append('universityLocation', university.country);
    formData.append('description', description);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session.token}`,
        },
      };
      const response = await API.post('/affiliations/apply', formData, config);
      toast.success(response.data.message);
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!university) return <div className="p-6">University not found</div>;

  return (
    <div className="mt-[30px] min-h-screen bg-background px-20">
      <div className="container">
        {/* Header */}
        {/* University Image Section */}
        <InfoSection>
          {' '}
          {/* Add margin bottom */}
          <img
            src={university.image}
            alt={`${university.name} Image`}
            className="w-full rounded-lg shadow-md"
            style={{ height: '450px' }}
          />
          <div className="mb-0">
            {' '}
            {/* Remove margin below the content */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                >
                  {university.name}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 text-muted-foreground mt-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>{university.location}</span>
                </motion.div>
              </div>
              <div className="flex gap-2">
                {isMentor && (
                  <Button onClick={() => setShowModal(true)}>Apply for Affiliation</Button>
                )}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <a href={university.website} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2">
                      Visit Website
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </InfoSection>

        {/* Key Stats */}
        <div className="grid gap-6  mt-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="World Ranking"
            value={`#${university.ranking}`}
            icon={<Trophy className="h-6 w-6" />}
            delay={0.3}
          />
          <StatCard
            title="Acceptance Rate"
            value={`${university.acceptanceRate}%`}
            icon={<Users className="h-6 w-6" />}
            delay={0.4}
          />
          <StatCard
            title="Graduation Rate"
            value={`${university.graduationRate}%`}
            icon={<GraduationCap className="h-6 w-6" />}
            delay={0.5}
          />
          <StatCard
            title="Programs Offered"
            value={university.coursesOffered.length}
            icon={<BookOpen className="h-6 w-6" />}
            delay={0.6}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* About / Description */}
          <InfoSection title="About" delay={0.7}>
            <p className="text-muted-foreground">{university.description}</p>
          </InfoSection>

          {/* Contact Information */}
          <InfoSection title="Contact Information" delay={0.8}>
            <div className="space-y-4">
              {university.contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{university.contact.phone}</span>
                </div>
              )}
              {university.contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a
                    href={`mailto:${university.contact.email}`}
                    className="hover:text-primary transition-colors"
                  >
                    {university.contact.email}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <a
                  href={university.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {university.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          </InfoSection>

          {/* Programs Offered */}
          <InfoSection title="Programs Offered" delay={0.9}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {university.coursesOffered.map((course) => (
                <div key={course} className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>{course}</span>
                </div>
              ))}
            </div>
          </InfoSection>

          {/* Tuition Fees */}
          <InfoSection title="Tuition Fees" delay={1}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span>Undergraduate</span>
                </div>
                <span className="font-bold">
                  {formatCurrency(university.tuitionFee.undergraduate)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span>Graduate</span>
                </div>
                <span className="font-bold">{formatCurrency(university.tuitionFee.graduate)}</span>
              </div>
              <p className="text-sm text-muted-foreground">* Tuition fees are per academic year</p>
            </div>
          </InfoSection>
        </div>

        {/* Dialog for Apply for Affiliation */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply for Affiliation</DialogTitle>
            </DialogHeader>
            <p className="mb-4 text-muted-foreground">
              Please upload your graduate certificate or relevant credentials that demonstrate your
              qualifications. This may include transcripts, certifications, or other professional
              documents.
            </p>
            <Input type="file" onChange={handleFileChange} />
            <Textarea
              placeholder="Briefly describe your qualifications and reasons for applying."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleApply}>Submit</Button>
              <Button variant="outline" onClick={() => setShowModal(false)} className="ml-2">
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Affiliated Mentors Section */}
        <InfoSection title="Affiliated Mentors" className="mt-8" delay={1.2}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentors.length > 0 ? (
          mentors.map((mentor, index) => (
            <motion.div
              key={mentor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="flex items-center gap-4 p-4">
                  <img
                    src={mentor.profilePic || 'https://via.placeholder.com/150'}
                    alt={`${mentor.firstname} ${mentor.lastname} Profile`}
                    className="h-16 w-16 rounded-full border-2 border-white shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{mentor.firstname} {mentor.lastname}</h3>
                    <p className="text-muted-foreground text-sm">{mentor.bio}</p>
                    <p className="text-muted-foreground text-sm">Years of Experience: {mentor.yearsOfExperience}</p>
                  </div>
                  <Link to={`/mentorprofile/${mentor._id}`}>
                    <Button variant="outline">Visit Profile</Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <p className="text-muted-foreground">No affiliated mentors available.</p>
        )}
      </div>
    </InfoSection>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="my-8"
        >
          <Link to="/universitieslist">
            <Button variant="outline">Back to Universities</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default UniversityProfile;
