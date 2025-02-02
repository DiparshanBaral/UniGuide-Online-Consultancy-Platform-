import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ClipboardList, ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

function Universities() {
  return (
    <div className="pt-[90px] px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* University Filter Section */}
        <section className="w-full py-7 md:py-7 lg:py-7">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Find Your Ideal University
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
            <CardHeader className="relative">
              <CardTitle className="text-2xl md:text-3xl text-center">
                Find Your Perfect University Match
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4 text-center">
              <p className="text-muted-foreground">
                Take our quick survey to discover universities that align perfectly with your
                academic goals, interests, and preferences.
              </p>
              <div className="flex items-center justify-center gap-4">
                <ClipboardList className="h-12 w-12 text-primary" />
                <div className="text-left">
                  <p className="font-medium">5-Minute Survey</p>
                  <p className="text-sm text-muted-foreground">
                    Get personalized university recommendations
                  </p>
                </div>
              </div>
              <Button size="lg" className="mt-4">
                Take the Survey <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>


        {/* Top Universities Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Top Universities</h2>
          <div className="flex overflow-x-auto space-x-6">
            {/* University 1 */}
            <div className="flex-shrink-0 w-60 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <img
                src="https://via.placeholder.com/250x150"
                alt="University 1"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">University of Example 1</h3>
              <p className="text-gray-600 mb-4">
                A world-class institution offering diverse programs.
              </p>
              <a
                href="/universities/example1"
                className="text-blue-600 font-medium hover:underline"
              >
                View University
              </a>
            </div>

            {/* Additional Universities */}
            {[...Array(6)].map((_, index) => (
              <div
                key={index + 2}
                className="flex-shrink-0 w-60 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <img
                  src="https://via.placeholder.com/250x150"
                  alt={`University ${index + 2}`}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  University of Example {index + 2}
                </h3>
                <p className="text-gray-600 mb-4">Description for university {index + 2}.</p>
                <a
                  href={`/universities/example${index + 2}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  View University
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Scroll or Button to See More */}
        <div className="text-center">
          <button className="bg-gray-800 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-700 transition duration-300">
            See More Universities
          </button>
        </div>
      </div>
    </div>
  );
}

export default Universities;
