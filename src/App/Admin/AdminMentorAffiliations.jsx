'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import API from '@/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Building2,
  GraduationCap,
  Clock,
  CheckCircle,
  FileText,
  Trash2,
  Check,
  X,
  Search,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminMentorAffiliations() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [filteredPending, setFilteredPending] = useState([]);
  const [filteredApproved, setFilteredApproved] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('all');

  // Fetch pending affiliation requests
  const fetchPendingRequests = async () => {
    try {
      setIsLoading(true);
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
      setFilteredPending(response.data);
    } catch (error) {
      toast.error('Failed to fetch pending requests.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch approved affiliation requests
  const fetchApprovedRequests = async () => {
    try {
      setIsLoading(true);
      const sessionData = JSON.parse(localStorage.getItem('session'));
      const token = sessionData ? sessionData.token : null;
      if (!token) throw new Error('No token found');

      const response = await API.get('/affiliations/approvedrequests', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApprovedRequests(response.data);
      setFilteredApproved(response.data);
    } catch (error) {
      toast.error('Error fetching approved requests.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    fetchApprovedRequests();
  }, []);

  // Filter requests based on search query and selected university
  useEffect(() => {
    let filteredPendingResults = [...pendingRequests];
    let filteredApprovedResults = [...approvedRequests];

    // Filter by university
    if (selectedUniversity !== 'all') {
      filteredPendingResults = filteredPendingResults.filter(
        (request) => request.universityId?._id === selectedUniversity,
      );
      filteredApprovedResults = filteredApprovedResults.filter(
        (request) => request.universityId?._id === selectedUniversity,
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      filteredPendingResults = filteredPendingResults.filter(
        (request) =>
          request.mentorId?.firstname?.toLowerCase().includes(query) ||
          request.mentorId?.lastname?.toLowerCase().includes(query) ||
          request.universityId?.name?.toLowerCase().includes(query),
      );

      filteredApprovedResults = filteredApprovedResults.filter(
        (request) =>
          request.mentorId?.firstname?.toLowerCase().includes(query) ||
          request.mentorId?.lastname?.toLowerCase().includes(query) ||
          request.universityId?.name?.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      const sortByKey = (a, b) => {
        // Handle nested properties
        let aValue, bValue;

        if (sortConfig.key === 'mentorName') {
          aValue = `${a.mentorId?.firstname || ''} ${a.mentorId?.lastname || ''}`;
          bValue = `${b.mentorId?.firstname || ''} ${b.mentorId?.lastname || ''}`;
        } else if (sortConfig.key === 'universityName') {
          aValue = a.universityId?.name;
          bValue = b.universityId?.name;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      };

      filteredPendingResults.sort(sortByKey);
      filteredApprovedResults.sort(sortByKey);
    }

    setFilteredPending(filteredPendingResults);
    setFilteredApproved(filteredApprovedResults);
  }, [pendingRequests, approvedRequests, searchQuery, selectedUniversity, sortConfig]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

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

  // Get unique universities for filter dropdown
  const getUniqueUniversities = () => {
    const allRequests = [...pendingRequests, ...approvedRequests];
    const uniqueUniversities = [];
    const uniqueIds = new Set();

    allRequests.forEach((request) => {
      if (request.universityId && !uniqueIds.has(request.universityId._id)) {
        uniqueIds.add(request.universityId._id);
        uniqueUniversities.push({
          id: request.universityId._id,
          name: request.universityId.name,
        });
      }
    });

    return uniqueUniversities;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mentor Affiliations</h1>
        <p className="text-muted-foreground">
          Manage mentor affiliation requests with universities
        </p>
      </div>

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
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by mentor name or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by university" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Universities</SelectItem>
                {getUniqueUniversities().map((uni) => (
                  <SelectItem key={uni.id} value={uni.id}>
                    {uni.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[120px]">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSort('createdAt')}>
                  Date (Newest First)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('mentorName')}>
                  Mentor Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('universityName')}>
                  University Name (A-Z)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Pending Requests
                {filteredPending.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {filteredPending.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Approved Requests
                {filteredApproved.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filteredApproved.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredPending.length === 0 ? (
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
                  {filteredPending.map((request) => (
                    <Card
                      key={request._id}
                      className="overflow-hidden border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 bg-gray-50 dark:bg-gray-800/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                          <div className="relative">
                            <img
                              src={
                                request.mentorId?.profilePic
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
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredApproved.length === 0 ? (
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
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleSort('mentorName')}
                          >
                            Mentor
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleSort('universityName')}
                          >
                            University
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleSort('createdAt')}
                          >
                            Date Approved
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Certificate</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApproved.map((request) => (
                        <TableRow key={request._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  request.mentorId?.profilePic ||
                                  '/placeholder.svg?height=32&width=32'
                                }
                                alt="Mentor"
                                className="h-8 w-8 rounded-full object-cover"
                              />
                              <span>
                                {request.mentorId?.firstname} {request.mentorId?.lastname}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{request.universityId?.name}</TableCell>
                          <TableCell>{new Date(request.updatedAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openCertificate(request.documentUrl)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteApprovedRequest(request._id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
