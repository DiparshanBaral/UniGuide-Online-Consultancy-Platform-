import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import API from '../api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MentorDashboard() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedConnections, setApprovedConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('connectedStudents');

  // Fetch data on component mount
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const session = JSON.parse(localStorage.getItem('session'));
        const mentorId = session._id;

        // Fetch pending requests
        const pendingResponse = await API.get(`/connections/pendingrequests?mentorId=${mentorId}`, {
          headers: { Authorization: `Bearer ${session.token}` },
        });
        setPendingRequests(pendingResponse.data);

        // Fetch approved connections
        const approvedResponse = await API.get(
          `/connections/approvedconnections?mentorId=${mentorId}`,
          {
            headers: { Authorization: `Bearer ${session.token}` },
          },
        );
        setApprovedConnections(approvedResponse.data);
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch connections. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  // Approve or reject a connection request
  const handleUpdateStatus = async (id, status) => {
    try {
      const session = JSON.parse(localStorage.getItem('session'));
      const response = await API.put(
        `/connections/status`,
        { id, status },
        {
          headers: { Authorization: `Bearer ${session.token}` },
        },
      );

      if (response.status === 200) {
        toast.success(`Connection ${status.toLowerCase()} successfully.`);
        // Refresh the data after updating
        const updatedPending = pendingRequests.filter((req) => req._id !== id);
        setPendingRequests(updatedPending);

        if (status === 'Approved') {
          const approvedRequest = pendingRequests.find((req) => req._id === id);
          setApprovedConnections((prev) => [...prev, approvedRequest]);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update connection status. Please try again.');
    }
  };

  return (
    <div className="mt-[50px] flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <nav className="space-y-2">
          <Button
            variant={activeTab === 'connectedStudents' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('connectedStudents')}
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Connected Students
          </Button>
          <Button
            variant={activeTab === 'pendingRequests' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('pendingRequests')}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Pending Requests
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Mentor Dashboard</h1>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin h-8 w-8 text-slate-800" />
          </div>
        ) : (
          <>
            {activeTab === 'connectedStudents' && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Connected Students</CardTitle>
                  <CardDescription>View all students you are connected with.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {approvedConnections.length > 0 ? (
                      approvedConnections.map((connection) => (
                        <a
                          key={connection._id}
                          href={`/mentorportal/${connection.portalId}`}
                          className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-4 mb-2">
                              <Avatar className="w-12 h-12">
                                <AvatarImage
                                  src={connection.studentId.profilePic || '/placeholder-avatar.png'}
                                  alt={`${connection.studentId.firstname} ${connection.studentId.lastname}`}
                                />
                                <AvatarFallback>{connection.studentId.firstname[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-lg">
                                  {`${connection.studentId.firstname} ${connection.studentId.lastname}`}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {connection.studentId.email}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <strong>Major:</strong>{' '}
                              <Badge variant="outline" className="text-sm">
                                {connection.studentId.major || 'N/A'}
                              </Badge>
                            </div>
                          </div>
                        </a>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center col-span-full">
                        No connected students at the moment. 🌟
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'pendingRequests' && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Requests</CardTitle>
                  <CardDescription>Approve or reject student connection requests.</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingRequests.length > 0 ? (
                    <ScrollArea className="h-[300px]">
                      {pendingRequests.map((request) => (
                        <div
                          key={request._id}
                          className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4 last:border-none"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage
                                src={request.studentId.profilePic || '/placeholder-avatar.png'}
                                alt={`${request.studentId.firstname} ${request.studentId.lastname}`}
                              />
                              <AvatarFallback>{request.studentId.firstname[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{`${request.studentId.firstname} ${request.studentId.lastname}`}</p>
                              <p className="text-sm text-gray-500">{request.studentId.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(request._id, 'Approved')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleUpdateStatus(request._id, 'Rejected')}
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-lg">No pending requests at the moment. 😊</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Sit back and relax! You&apos;re all caught up.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
