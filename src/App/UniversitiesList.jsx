import { useEffect, useState } from 'react';
import API from '../api';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Globe2, MapPin, Users, GraduationCap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const UniversitiesList = () => {
  const navigate = useNavigate();
  // Initial state with country keys
  const [universities, setUniversities] = useState({
    US: [],
    UK: [],
    Canada: [],
    Australia: [],
  });
  // Use lowercase country values to fetch and then store them uppercase
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const countries = ['us', 'uk', 'canada', 'australia'];

  useEffect(() => {
    const fetchUniversities = async () => {
      let data = {};
      for (let country of countries) {
        try {
          const response = await API.get(`/universities/${country}`);
          data[country.toUpperCase()] = response.data;
        } catch (error) {
          console.error(`Error fetching ${country} universities:`, error);
          data[country.toUpperCase()] = [];
        }
      }
      setUniversities(data);
    };
    fetchUniversities();
  }, [countries]);

  return (
    // px-8 adds horizontal padding (adjust as needed)
    <div className="pt-[90px] px-24">
      <h1 className="text-2xl font-bold mb-4">Universities List</h1>

      {/* Tabs for each country */}
      <Tabs defaultValue="US" className="w-full">
        <div className="flex justify-center">
          <TabsList className="mb-4 flex gap-4 px-5">
            {Object.keys(universities).map((country) => (
              <TabsTrigger key={country} value={country}>
                {country}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {Object.entries(universities).map(([country, list]) => (
          <TabsContent key={country} value={country}>
            {list.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {list.map((university, index) => (
                  <motion.div
                    key={university._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      <CardHeader className="space-y-4 pb-4">
                        <div className="flex items-start gap-4">
                          <div className="relative h-16 w-16 flex-shrink-0">
                            <img
                              src={university.image || 'https://via.placeholder.com/150'}
                              alt={`${university.name} logo`}
                              className="h-full w-full rounded-lg object-cover" // Removed padding
                            />
                            <Badge variant="secondary" className="absolute -top-2 -right-2">
                              #{university.ranking || 'N/A'}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold text-lg leading-tight">
                              {university.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Globe2 className="h-4 w-4" />
                              {country}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {university.location}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {university.description || 'No description available.'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="font-medium">Acceptance Rate</span>
                            </div>
                            <Badge variant="secondary" className="w-full justify-center">
                              {university.acceptanceRate}%
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <GraduationCap className="h-4 w-4 text-primary" />
                              <span className="font-medium">Graduation Rate</span>
                            </div>
                            <Badge variant="secondary" className="w-full justify-center">
                              {university.graduationRate}%
                            </Badge>
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button
                            className="w-full text-white"
                            onClick={() =>
                              navigate(
                                `/universityprofile/${country.toLowerCase()}/${university._id}`,
                              )
                            }
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No universities found.</p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default UniversitiesList;
