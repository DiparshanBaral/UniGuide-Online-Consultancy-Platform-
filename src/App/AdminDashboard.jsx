'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import API from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2,
  GraduationCap,
  Clock,
  CheckCircle,
  Plus,
  FileText,
  Globe,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Percent,
  DollarSign,
  Trash2,
  Check,
  X,
} from 'lucide-react';

export default function AdminDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    country: '',
    name: '',
    location: '',
    ranking: '',
    coursesOffered: [],
    contact: {
      phone: '',
      email: '',
    },
    website: '',
    description: '',
    tuitionFee: { undergraduate: '', graduate: '' },
    acceptanceRate: '',
    graduationRate: '',
  });

  const [pendingRequests, setPendingRequests] = useState([]);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingRooms, setPendingRooms] = useState([]);
  const [activeMainTab, setActiveMainTab] = useState('affiliations');

  const openModal = () => {
    setForm({
      country: '',
      name: '',
      location: '',
      ranking: '',
      coursesOffered: [],
      contact: { phone: '', email: '' },
      website: '',
      description: '',
      tuitionFee: { undergraduate: '', graduate: '' },
      acceptanceRate: '',
      graduationRate: '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Handle add university request
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/universities/add', form);
      toast.success('University added successfully!');
      closeModal();
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Fetch pending affiliation requests
  const fetchPendingRequests = async () => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session'));
      const token = sessionData ? sessionData.token : null;

      if (!token) {
        throw new Error('No token found');
      }

      const response = await API.get('/affiliations/pendingrequests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPendingRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch pending requests.');
      console.error(error);
    }
  };

  // Fetch approved affiliation requests
  const fetchApprovedRequests = async () => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session'));
      const token = sessionData ? sessionData.token : null;
      if (!token) throw new Error('No token found');

      const response = await API.get('/affiliations/approvedrequests', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApprovedRequests(response.data);
    } catch (error) {
      toast.error('Error fetching approved requests.');
      console.error(error);
    }
  };

  // Fetch pending discussion room request
  const fetchPendingRooms = async () => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session'));
      const token = sessionData ? sessionData.token : null;
      if (!token) {
        throw new Error('No token found');
      }

      const response = await API.get('/discussion/pending', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Ensure pendingRooms is set to the array of rooms
      setPendingRooms(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch pending room requests.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    fetchApprovedRequests();
    fetchPendingRooms();
  }, []);

  const openCertificate = (url) => {
    setCertificateUrl(url);
    setIsOpen(true);
  };

  const approveRequest = async (id) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session'));
      const token = sessionData ? sessionData.token : null;

      if (!token) {
        throw new Error('No token found');
      }

      await API.put(
        `/affiliations/${id}/status`,
        { status: 'Approved' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success('Affiliation approved successfully!');
      fetchPendingRequests();
      fetchApprovedRequests();
    } catch (error) {
      toast.error('Error approving request.');
      console.error(error);
    }
  };

  const rejectRequest = async (id) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session'));
      const token = sessionData ? sessionData.token : null;

      if (!token) {
        throw new Error('No token found');
      }

      await API.delete(`/affiliations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Affiliation request rejected.');
      fetchPendingRequests();
    } catch (error) {
      toast.error('Error rejecting request.');
      console.error(error);
    }
  };

  const deleteApprovedRequest = async (id) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session'));
      const token = sessionData ? sessionData.token : null;

      if (!token) {
        throw new Error('No token found');
      }

      await API.delete(`/affiliations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Approved request deleted.');
      fetchApprovedRequests();
    } catch (error) {
      toast.error('Error deleting approved request.');
      console.error(error);
    }
  };

  const updateRoomStatus = async (id, status) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session'));
      const token = sessionData ? sessionData.token : null;
  
      if (!token) {
        throw new Error('No token found');
      }
  
      // Validate the status value
      if (!['approved'].includes(status)) {
        throw new Error('Invalid status value. Must be "approved".');
      }
  
      // Make the PUT request
      await API.put(
        `/discussion/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Show success toast
      if (status === 'approved') {
        toast.success('Room request approved successfully!');
      }
  
      // Refetch pending rooms to reflect the updated status
      fetchPendingRooms();
    } catch (error) {
      console.error("Error Message:", error.message);
      toast.error(`Error ${status.toLowerCase()}ing room request.`);
    }
  };

  const deletePendingRoomRequest = async (id, status) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session'));
      const token = sessionData ? sessionData.token : null;
  
      if (!token) {
        throw new Error('No token found');
      }
  
      // Validate the status value
      if (!['rejected'].includes(status)) {
        throw new Error('Invalid status value. Must be "rejected".');
      }
  
      // Make the DELETE request
      const response = await API.delete(`/discussion/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Check the response
      if (response.data.success) {
        toast.success('Room request deleted successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to delete room request.');
      }
  
      // Refetch pending rooms to reflect the updated list
      fetchPendingRooms();
    } catch (error) {
      toast.error(`Error deleting room request: ${error.message}`);
      console.error("Error Details:", error);
    }
  };

  return (
    <div className="mt-[70px] min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
            <Button
              onClick={openModal}
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add University
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          defaultValue="affiliations"
          value={activeMainTab}
          onValueChange={setActiveMainTab}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="affiliations" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Mentor Affiliations
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Discussion Rooms
              {pendingRooms.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingRooms.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="affiliations">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                  Mentor Affiliation Management
                </CardTitle>
                <CardDescription>
                  Review and manage mentor affiliation requests with universities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="pending" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Pending Requests
                      {pendingRequests.length > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {pendingRequests.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="approved" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" /> Approved Requests
                      {approvedRequests.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {approvedRequests.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="pending">
                    {pendingRequests.length === 0 ? (
                      <div className="text-center py-12">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          No pending requests
                        </h3>
                        <p className="text-muted-foreground mt-2">
                          All mentor affiliation requests have been processed.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {pendingRequests.map((request) => (
                          <Card
                            key={request._id}
                            className="overflow-hidden border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-1/4 bg-gray-50 dark:bg-gray-800/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                                <div className="relative">
                                  <img
                                    src={
                                      request.mentorId?.profilePic ||
                                      '/placeholder.svg?height=100&width=100'
                                    }
                                    alt="Mentor Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-sm"
                                  />
                                  <Badge className="absolute bottom-0 right-0" variant="secondary">
                                    Mentor
                                  </Badge>
                                </div>
                                <h3 className="font-semibold text-lg mt-4 text-center">
                                  {request.mentorId
                                    ? `${request.mentorId.firstname} ${request.mentorId.lastname}`
                                    : 'N/A'}
                                </h3>
                              </div>

                              <div className="md:w-3/4 p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                  <div>
                                    <h4 className="text-lg font-medium flex items-center">
                                      <Building2 className="h-4 w-4 mr-2 text-primary" />
                                      {request.universityId.name}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      Affiliation request submitted on{' '}
                                      {new Date(request.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 md:mt-0"
                                    onClick={() => openCertificate(request.documentUrl)}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Certificate
                                  </Button>
                                </div>

                                <Separator className="my-4" />

                                <div className="mb-4">
                                  <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                    Description
                                  </h5>
                                  <p className="text-sm">{request.description}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                  <Button
                                    onClick={() => approveRequest(request._id)}
                                    className="bg-green-600 hover:bg-green-700 text-white flex-1 flex items-center justify-center gap-2"
                                  >
                                    <Check className="h-4 w-4" />
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => rejectRequest(request._id)}
                                    variant="destructive"
                                    className="flex-1 flex items-center justify-center gap-2"
                                  >
                                    <X className="h-4 w-4" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="approved">
                    {approvedRequests.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          No approved requests
                        </h3>
                        <p className="text-muted-foreground mt-2">
                          Approved mentor affiliations will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {approvedRequests.map((request) => (
                          <Card key={request._id} className="overflow-hidden">
                            <CardHeader className="pb-3 flex flex-row items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">
                                  {request.mentorId?.firstname} {request.mentorId?.lastname}
                                </CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                  <Building2 className="h-4 w-4 mr-1" />
                                  {request.universityId.name}
                                </CardDescription>
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                              >
                                Approved
                              </Badge>
                            </CardHeader>
                            <CardFooter className="pt-3 flex justify-between items-center">
                              <p className="text-xs text-muted-foreground">
                                Approved on {new Date(request.updatedAt).toLocaleDateString()}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                onClick={() => deleteApprovedRequest(request._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-primary" />
                  Discussion Room Requests
                </CardTitle>
                <CardDescription>
                  Review and manage requests for creating discussion rooms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRooms.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      No pending room requests
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      All discussion room requests have been processed.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingRooms.map((room) => (
                      <Card
                        key={room._id}
                        className="overflow-hidden border border-gray-200 dark:border-gray-700"
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-medium flex items-center">
                                <Building2 className="h-4 w-4 mr-2 text-primary" />
                                {room.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Created on {new Date(room.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline" className="mt-2 md:mt-0">
                              {room.category || 'General'}
                            </Badge>
                          </div>

                          <Separator className="my-4" />

                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-muted-foreground mb-2">
                              Description
                            </h5>
                            <p className="text-sm">{room.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <h5 className="text-sm font-medium text-muted-foreground mb-1">
                                Participants
                              </h5>
                              <p className="text-sm">{room.participants || '0'} participants</p>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-muted-foreground mb-1">
                                Tags
                              </h5>
                              <p className="text-sm">{room.tags.join(', ') || 'No tags'}</p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <Button
                              onClick={() => updateRoomStatus(room._id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white flex-1 flex items-center justify-center gap-2"
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => deletePendingRoomRequest(room._id, 'rejected')}
                              variant="destructive"
                              className="flex-1 flex items-center justify-center gap-2"
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add University Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl mx-auto p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Building2 className="h-5 w-5 mr-2 text-primary" />
              Add New University
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new university to the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Basic Information
                </h3>
                <Separator />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">Country</label>
                <Select
                  value={form.country}
                  onValueChange={(value) => setForm({ ...form, country: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  University Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Harvard University"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Cambridge, Massachusetts"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  Global Ranking
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 1"
                  value={form.ranking}
                  onChange={(e) => setForm({ ...form, ranking: e.target.value })}
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 flex items-center">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Courses Offered
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Computer Science, Business, Medicine (comma separated)"
                  value={form.coursesOffered.join(', ')}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      coursesOffered: e.target.value.split(',').map((course) => course.trim()),
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-4 col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Information
                </h3>
                <Separator />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  Phone Number
                </label>
                <Input
                  type="text"
                  placeholder="e.g. +1 (123) 456-7890"
                  value={form.contact.phone}
                  onChange={(e) =>
                    setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="e.g. admissions@university.edu"
                  value={form.contact.email}
                  onChange={(e) =>
                    setForm({ ...form, contact: { ...form.contact, email: e.target.value } })
                  }
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  Website
                </label>
                <Input
                  type="url"
                  placeholder="e.g. https://www.university.edu"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>

              <div className="space-y-4 col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Additional Information
                </h3>
                <Separator />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 flex items-center">Description</label>
                <Textarea
                  placeholder="Brief description of the university..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Undergraduate Tuition Fee ($)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  value={form.tuitionFee.undergraduate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tuitionFee: { ...form.tuitionFee, undergraduate: e.target.value },
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Graduate Tuition Fee ($)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 60000"
                  value={form.tuitionFee.graduate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tuitionFee: { ...form.tuitionFee, graduate: e.target.value },
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Percent className="h-3 w-3 mr-1" />
                  Acceptance Rate (%)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  value={form.acceptanceRate}
                  onChange={(e) => setForm({ ...form, acceptanceRate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Percent className="h-3 w-3 mr-1" />
                  Graduation Rate (%)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 95"
                  value={form.graduationRate}
                  onChange={(e) => setForm({ ...form, graduationRate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                Add University
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Certificate Popup */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Mentor&apos;s Certificate
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            {certificateUrl ? (
              <img
                src={certificateUrl || '/placeholder.svg'}
                alt="Mentor Certificate"
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No certificate available.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
