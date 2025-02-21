import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import API from '../api';
import { Button } from '@/Components/ui/button';
// import { Card, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/universities/add', form); // Post to /universities/add
      toast.success('University added successfully!');
      closeModal(); // Close modal after success
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session')); // Retrieve session data
      const token = sessionData ? sessionData.token : null; // Get the token from session data

      if (!token) {
        throw new Error('No token found'); // Throw an error if the token is missing
      }

      const response = await API.get('/affiliations/pendingrequests', {
        headers: {
          Authorization: `Bearer ${token}`, // Use the retrieved token
        },
      });

      setPendingRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch pending requests.');
      console.error(error); // Log the error for debugging
    }
  };

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

  useEffect(() => {
    fetchPendingRequests();
    fetchApprovedRequests();
  }, []);

  const openCertificate = (url) => {
    setCertificateUrl(url);
    setIsOpen(true);
  };

  const approveRequest = async (id) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session')); // Retrieve session data
      const token = sessionData ? sessionData.token : null; // Get the token from session data
  
      if (!token) {
        throw new Error('No token found'); // Handle missing token
      }
  
      await API.put(
        `/affiliations/${id}/status`, 
        { status: 'Approved' },
        {
          headers: {
            Authorization: `Bearer ${token}` // Add Authorization header
          }
        }
      );
  
      toast.success('Affiliation approved successfully!');
      fetchPendingRequests();
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
      fetchApprovedRequests(); // Refresh list after deletion
    } catch (error) {
      toast.error('Error deleting approved request.');
      console.error(error);
    }
  };
  
  

  return (
    <div className="pt-[90px] min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Button onClick={openModal} className="bg-gray-900 hover:bg-gray-700 text-white">
            + Add University
          </Button>
        </div>
      </div>

      {/* Pending Affiliation Requests Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Affiliation Requests</h2>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-600">No pending requests at this time.</p>
        ) : (
          <ul className="space-y-4">
            {pendingRequests.map((request) => (
              <li key={request._id} className="p-4 border border-gray-300 rounded-md flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={request.mentorId?.profilePic || '/default-avatar.png'}
                    alt="Mentor Profile"
                    className="w-16 h-16 rounded-full border object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">
                      {request.mentorId
                        ? `${request.mentorId.firstname} ${request.mentorId.lastname}`
                        : 'N/A'}
                    </h3>
                    <p className="text-gray-600">University: {request.universityId.name}</p>
                    <p className="text-gray-600">Description: {request.description}</p>
                    <button
                      onClick={() => openCertificate(request.documentUrl)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-2"
                    >
                      View Certificate
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => approveRequest(request._id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => rejectRequest(request._id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Approved Requests Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Approved Mentor Requests</h2>
        {approvedRequests.length === 0 ? (
          <p className="text-gray-600">No approved requests at this time.</p>
        ) : (
          <ul className="space-y-4">
            {approvedRequests.map((request) => (
              <li key={request._id} className="p-4 border border-gray-300 rounded-md flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{request.mentorId?.firstname} {request.mentorId?.lastname}</h3>
                  <p className="text-gray-600">University: {request.universityId.name}</p>
                </div>
                <Button onClick={() => deleteApprovedRequest(request._id)} className="bg-red-600 hover:bg-red-700 text-white">
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add University Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg mx-auto p-6 rounded-lg bg-white shadow-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New University</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Country Select */}
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
              </SelectContent>
            </Select>

            {/* Other Fields */}
            <Input
              type="text"
              placeholder="University Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Global Ranking"
              value={form.ranking}
              onChange={(e) => setForm({ ...form, ranking: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Courses Offered (comma separated)"
              value={form.coursesOffered.join(', ')}
              onChange={(e) =>
                setForm({
                  ...form,
                  coursesOffered: e.target.value.split(',').map((course) => course.trim()),
                })
              }
              required
            />
            <Input
              type="text"
              placeholder="Phone Number"
              value={form.contact.phone}
              onChange={(e) =>
                setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })
              }
            />
            <Input
              type="email"
              placeholder="Email"
              value={form.contact.email}
              onChange={(e) =>
                setForm({ ...form, contact: { ...form.contact, email: e.target.value } })
              }
            />
            <Input
              type="url"
              placeholder="Website"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Undergraduate Tuition Fee ($)"
              value={form.tuitionFee.undergraduate}
              onChange={(e) =>
                setForm({
                  ...form,
                  tuitionFee: { ...form.tuitionFee, undergraduate: e.target.value },
                })
              }
              required
            />
            <Input
              type="number"
              placeholder="Graduate Tuition Fee ($)"
              value={form.tuitionFee.graduate}
              onChange={(e) =>
                setForm({ ...form, tuitionFee: { ...form.tuitionFee, graduate: e.target.value } })
              }
              required
            />
            <Input
              type="number"
              placeholder="Acceptance Rate (%)"
              value={form.acceptanceRate}
              onChange={(e) => setForm({ ...form, acceptanceRate: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Graduation Rate (%)"
              value={form.graduationRate}
              onChange={(e) => setForm({ ...form, graduationRate: e.target.value })}
              required
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Add University
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Certificate Popup */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mentor&apos;s Certificate</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {certificateUrl ? (
              <img
                src={certificateUrl}
                alt="Mentor Certificate"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            ) : (
              <p className="text-gray-600">No certificate available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
