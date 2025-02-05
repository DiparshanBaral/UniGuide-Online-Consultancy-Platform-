import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/Components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { InfoSection } from '@/components/ui/info-section';
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

const UniversityProfile = () => {
  const { country, universityId } = useParams();

  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Format currency helper
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

  // Fetch university data from the backend
  useEffect(() => {
    fetch(`http://localhost:5000/universities/${country}/${universityId}`)
      .then((res) => res.json())
      .then((data) => {
        setUniversity(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching university data:', error);
        setLoading(false);
      });
  }, [country, universityId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!university) return <div className="p-6">University not found</div>;

  return (
    <div className="min-h-screen bg-background py-12 md:py-24 px-20">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
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
                <Badge variant="secondary">{university.country}</Badge>
              </motion.div>
            </div>
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

        {/* Key Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
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

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-8"
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
