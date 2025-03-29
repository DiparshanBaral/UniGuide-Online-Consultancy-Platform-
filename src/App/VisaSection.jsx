'use client';

import { useState } from 'react';
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
  Globe,
  BookOpen,
  MessageSquare,
  FileText,
  ChevronRight,
  Calendar,
  User,
} from 'lucide-react';

export default function VisaSection() {
  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState('experiences');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

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

  const experiences = [
    {
      id: 1,
      author: 'John Doe',
      country: 'United States',
      flag: '🇺🇸',
      date: 'May 15, 2023',
      title: 'My F-1 Visa Interview Experience',
      excerpt:
        'My visa interview experience was smooth. The officer asked about my university, funding, and future plans. I was well-prepared with all my documents organized in a folder.',
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      author: 'Jane Smith',
      country: 'United Kingdom',
      flag: '🇬🇧',
      date: 'June 3, 2023',
      title: 'UK Student Visa Journey',
      excerpt:
        'I prepared all my documents in advance. The key was confidence during the interview and having clear answers about my study plans and intentions to return home after graduation.',
      likes: 18,
      comments: 5,
    },
    {
      id: 3,
      author: 'Michael Wong',
      country: 'Canada',
      flag: '🇨🇦',
      date: 'April 22, 2023',
      title: 'Canada Study Permit Success',
      excerpt:
        'The Canadian visa process was mostly online. I made sure to have strong proof of financial support and a detailed study plan. The biometrics appointment was quick and efficient.',
      likes: 31,
      comments: 12,
    },
    {
      id: 4,
      author: 'Sarah Johnson',
      country: 'Australia',
      flag: '🇦🇺',
      date: 'March 10, 2023',
      title: 'Australian Student Visa Tips',
      excerpt:
        'For my Australian visa, I focused on proving genuine temporary entrant (GTE) requirements. I wrote a strong statement explaining why I chose Australia and my career plans afterward.',
      likes: 27,
      comments: 9,
    },
  ];

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
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="title" className="text-sm font-medium">
                          Title
                        </label>
                        <Input id="title" placeholder="E.g., My F-1 Visa Interview Experience" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="country" className="text-sm font-medium">
                          Country
                        </label>
                        <Select>
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
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShareDialogOpen(false)}>Submit Experience</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experiences.map((exp) => (
                  <Card
                    key={exp.id}
                    className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-2"
                  >
                    <CardHeader className="pb-4 relative">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Badge className="px-2 py-1 bg-black text-white">
                            {exp.flag} {exp.country}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {exp.date}
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
                        <CardDescription>By {exp.author}</CardDescription>
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
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                          ❤️ {exp.likes}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                          💬 {exp.comments}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-black border-black group-hover:bg-black group-hover:text-white transition-colors"
                      >
                        Read More <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button variant="outline">Load More Experiences</Button>
              </div>
            </TabsContent>

            {/* Country Information Tab */}
            <TabsContent value="countries" className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Visa Information by Country</h2>

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
                    <CardFooter className="border-t pt-4">
                      <Button className="w-full">View Detailed Information</Button>
                    </CardFooter>
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
        </div>
      </div>
    </div>
  );
}
