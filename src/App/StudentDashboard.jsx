import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import API from "../api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, UserPlus, CircleDollarSign } from "lucide-react";

export default function StudentDashboard() {
  const [pendingConnections, setPendingConnections] = useState([]);
  const [connectedMentors, setConnectedMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("connectedMentors");
  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const session = JSON.parse(localStorage.getItem("session"));
        const studentId = session._id;

        // Fetch connected mentors
        const connectedResponse = await API.get(`/connections/student/approvedconnections?studentId=${studentId}`, {
          headers: { Authorization: `Bearer ${session.token}` },
        });
        
        // Get payment status for each connection
        const connectionsWithPaymentStatus = await Promise.all(
          connectedResponse.data.map(async (connection) => {
            try {
              // Get payment status
              const paymentResponse = await API.get(`/payment/connection-status/${connection._id}`, {
                headers: { Authorization: `Bearer ${session.token}` },
              });
              
              return {
                ...connection,
                paymentStatus: paymentResponse.data.status || 'pending'
              };
            } catch (error) {
              console.error('Error fetching payment status:', error);
              return {
                ...connection,
                paymentStatus: 'pending'
              };
            }
          })
        );
        
        setConnectedMentors(connectionsWithPaymentStatus);

        // Fetch pending connections
        const pendingResponse = await API.get(`/connections/student/pendingconnections?studentId=${studentId}`, {
          headers: { Authorization: `Bearer ${session.token}` },
        });
        setPendingConnections(pendingResponse.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch connections. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const handlePortalAccess = (connection) => {
    // Check if payment is completed
    if (connection.paymentStatus === 'paid') {
      navigate(`/studentportal/${connection.portalId}`);
    } else {
      // Redirect to access denied page with connection info
      navigate(`/access-denied/${connection._id}`, {
        state: {
          mentorName: `${connection.mentorId.firstname} ${connection.mentorId.lastname}`,
          connectionId: connection._id
        }
      });
    }
  };

  return (
    <div className="mt-[50px] flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <nav className="space-y-2">
          <Button
            variant={activeTab === "connectedMentors" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("connectedMentors")}
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Connected Mentors
          </Button>
          <Button
            variant={activeTab === "pendingRequests" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("pendingRequests")}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Pending Requests
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin h-8 w-8 text-slate-800" />
          </div>
        ) : (
          <>
            {activeTab === "connectedMentors" && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Connected Mentors</CardTitle>
                  <CardDescription>View all mentors you are connected with.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {connectedMentors.length > 0 ? (
                      connectedMentors.map((connection) => (
                        <div
                          key={connection._id}
                          className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-4 mb-2">
                              <Avatar className="w-12 h-12">
                                <AvatarImage
                                  src={connection.mentorId.profilePic || "/placeholder-avatar.png"}
                                  alt={`${connection.mentorId.firstname} ${connection.mentorId.lastname}`}
                                />
                                <AvatarFallback>
                                  {connection.mentorId.firstname[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-lg">
                                  {`${connection.mentorId.firstname} ${connection.mentorId.lastname}`}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {connection.mentorId.email}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <Badge variant="outline" className="text-sm">
                                {connection.mentorId.university || "N/A"}
                              </Badge>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-sm text-gray-700">
                                  <strong>Degree:</strong> {connection.mentorId.degree || "N/A"}
                                </p>
                                <Badge
                                  variant={connection.paymentStatus === 'paid' ? 'success' : 'destructive'}
                                  className="text-xs"
                                >
                                  {connection.paymentStatus === 'paid' ? 'Paid' : 'Payment Required'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700">
                                <strong>Experience:</strong> {connection.mentorId.yearsOfExperience || 0} years
                              </p>
                            </div>
                            
                            <div className="mt-4 flex flex-col gap-2">
                              <Button 
                                onClick={() => handlePortalAccess(connection)}
                                className="w-full"
                              >
                                Access Portal
                              </Button>
                              
                              {connection.paymentStatus !== 'paid' && (
                                <Button
                                  variant="outline"
                                  onClick={() => navigate(`/payments/${connection._id}`)}
                                  className="w-full"
                                >
                                  <CircleDollarSign className="mr-2 h-4 w-4" />
                                  Pay Now
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center col-span-full">
                        No connected mentors at the moment. 🌟
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pending Requests Tab - unchanged */}
            {activeTab === "pendingRequests" && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Requests</CardTitle>
                  <CardDescription>View all pending mentor connection requests.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {pendingConnections.length > 0 ? (
                      pendingConnections.map((connection) => (
                        <div
                          key={connection._id}
                          className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-4 mb-2">
                              <Avatar className="w-12 h-12">
                                <AvatarImage
                                  src={connection.mentorId.profilePic || "/placeholder-avatar.png"}
                                  alt={`${connection.mentorId.firstname} ${connection.mentorId.lastname}`}
                                />
                                <AvatarFallback>
                                  {connection.mentorId.firstname[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-lg">
                                  {`${connection.mentorId.firstname} ${connection.mentorId.lastname}`}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {connection.mentorId.email}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <Badge variant="outline" className="text-sm">
                                {connection.mentorId.university || "N/A"}
                              </Badge>
                              <p className="text-sm text-gray-700 mt-2">
                                <strong>Degree:</strong> {connection.mentorId.degree || "N/A"}
                              </p>
                              <p className="text-sm text-gray-700">
                                <strong>Experience:</strong> {connection.mentorId.yearsOfExperience || 0} years
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center col-span-full">
                        No pending requests at the moment. 😊
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}