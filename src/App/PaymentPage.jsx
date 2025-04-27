import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { sessionAtom } from '@/atoms/session';
import { ArrowLeft, Check, CircleDollarSign, Users, Clock, History } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NegotiationCard from '@/Components/NegotiationCard';
import EmptyState from '@/Components/EmptyState';
import LoadingSkeletons from '@/Components/LoadingSkeletons';
import API from '../api';

export default function PaymentPage() {
  const [session] = useAtom(sessionAtom);
  const [negotiations, setNegotiations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [completedPayments, setCompletedPayments] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    session?.role === 'student' ? 'pendingPayments' : 'studentPayments',
  );
  const [counterOffer, setCounterOffer] = useState('');
  const [counterMessage, setCounterMessage] = useState('');
  const [isNegotiating, setIsNegotiating] = useState(false);
  const navigate = useNavigate();

  // Fetch all transactions for a user
  const fetchPaymentHistory = useCallback(async () => {
    if (!session || !session._id) return;

    try {
      const response = await API.get(`/payment/transactions/${session._id}`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });

      if (response.data && response.data.transactions) {
        setPaymentHistory(response.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast.error('Failed to load payment history');
    }
  }, [session]);

  // Fetch student's connected mentors
  const fetchConnections = useCallback(async () => {
    if (!session || !session._id) return;

    setIsLoading(true);
    try {
      const response = await API.get(`/connections/student/approvedconnections`, {
        params: { studentId: session._id },
        headers: { Authorization: `Bearer ${session.token}` },
      });

      if (response.data) {
        const connections = response.data;

        // Get payment status for each connection
        const connectionPayments = await Promise.all(
          connections.map(async (connection) => {
            try {
              // Get payment status
              const paymentResponse = await API.get(
                `/payment/connection-status/${connection._id}`,
                {
                  headers: { Authorization: `Bearer ${session.token}` },
                },
              );

              // Try to get negotiated fee
              let fee = connection.mentorId.consultationFee;
              let currency = connection.mentorId.currency;

              try {
                const negotiationResponse = await API.get(
                  `/paymentnegotiation/mentor/${connection.mentorId._id}`,
                  {
                    headers: { Authorization: `Bearer ${session.token}` },
                  },
                );

                const approvedNegotiation = negotiationResponse.data.negotiations.find(
                  (neg) => neg.status === 'mentor_approved' && neg.finalConsultationFee,
                );

                if (approvedNegotiation) {
                  fee = approvedNegotiation.finalConsultationFee;
                  currency = approvedNegotiation.currency;
                }
              } catch (error) {
                console.error('Error fetching negotiation data:', error);
                console.log('No negotiation found for mentor:', connection.mentorId._id);
              }

              return {
                ...connection,
                paymentStatus: paymentResponse.data.status || 'pending',
                payment: paymentResponse.data.payment,
                negotiatedFee: fee,
                feeCurrency: currency,
              };
            } catch (error) {
              console.error('Error fetching payment status:', error);
              return {
                ...connection,
                paymentStatus: 'pending',
                payment: null,
              };
            }
          }),
        );

        setConnections(connectionPayments);

        // Filter pending payments
        const pending = connectionPayments.filter(
          (connection) => connection.paymentStatus === 'pending',
        );
        setPendingPayments(pending);

        // Filter completed payments
        const completed = connectionPayments.filter(
          (connection) => connection.paymentStatus === 'paid',
        );
        setCompletedPayments(completed);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error('Failed to load connections');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  // Fetch mentor's connected students
  const fetchMentorConnections = useCallback(async () => {
    if (!session || !session._id || session.role !== 'mentor') return;

    setIsLoading(true);
    try {
      const response = await API.get(`/connections/approvedconnections`, {
        params: { mentorId: session._id },
        headers: { Authorization: `Bearer ${session.token}` },
      });

      if (response.data) {
        const connections = response.data;

        // Get payment status and negotiation data for each connection
        const connectionPayments = await Promise.all(
          connections.map(async (connection) => {
            try {
              // Get payment status
              const paymentResponse = await API.get(
                `/payment/connection-status/${connection._id}`,
                {
                  headers: { Authorization: `Bearer ${session.token}` },
                },
              );

              // Try to get negotiated fee
              let fee = connection.mentorId.consultationFee;
              let currency = connection.mentorId.currency;

              try {
                // Check for student-specific negotiations
                const negotiationResponse = await API.get(
                  `/paymentnegotiation/connection/${connection._id}`,
                  {
                    headers: { Authorization: `Bearer ${session.token}` },
                  },
                );

                if (negotiationResponse.data && negotiationResponse.data.negotiations) {
                  const approvedNegotiation = negotiationResponse.data.negotiations.find(
                    (neg) => neg.status === 'mentor_approved' && neg.finalConsultationFee
                  );

                  if (approvedNegotiation) {
                    fee = approvedNegotiation.finalConsultationFee;
                    currency = approvedNegotiation.currency;
                  }
                }
              } catch (error) {
                console.error('Error fetching negotiation data:', error);
                console.log('No negotiation found for connection:', connection._id);
              }

              return {
                ...connection,
                paymentStatus: paymentResponse.data.status || 'pending',
                payment: paymentResponse.data.payment,
                negotiatedFee: fee,
                feeCurrency: currency
              };
            } catch (error) {
              console.error('Error fetching payment status:', error);
              return {
                ...connection,
                paymentStatus: 'pending',
                payment: null,
                negotiatedFee: connection.mentorId.consultationFee,
                feeCurrency: connection.mentorId.currency
              };
            }
          }),
        );

        setConnections(connectionPayments);
      }
    } catch (error) {
      console.error('Error fetching mentor connections:', error);
      toast.error('Failed to load student connections');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  // Fetch mentor's negotiations
  const fetchNegotiations = useCallback(async () => {
    if (!session || !session._id || session.role !== 'mentor') return;

    setIsLoading(true);
    try {
      const response = await API.get(`/paymentnegotiation/mentor/${session._id}`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });

      if (response.data && response.data.success) {
        setNegotiations(response.data.negotiations || []);
      } else {
        setNegotiations([]);
      }
    } catch (error) {
      console.error('Error fetching negotiations:', error);
      toast.error('Failed to load negotiation history');
      setNegotiations([]);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session || !session._id) {
      navigate('/login');
      return;
    }

    if (session.role === 'student') {
      fetchPaymentHistory();
      fetchConnections();
    } else if (session.role === 'mentor') {
      fetchMentorConnections();
      fetchNegotiations();
    }
  }, [
    session,
    navigate,
    fetchConnections,
    fetchNegotiations,
    fetchMentorConnections,
    fetchPaymentHistory,
  ]);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case 'paid':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Paid
          </Badge>
        );
      case 'admin_approved':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Awaiting Your Response
          </Badge>
        );
      case 'mentor_approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        );
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return 'N/A';
    return `$${amount} ${currency.toUpperCase()}`;
  };

  const handleCounterOffer = async (negotiationId) => {
    if (!counterOffer || isNaN(parseFloat(counterOffer)) || parseFloat(counterOffer) <= 0) {
      toast.error('Please enter a valid counter offer amount');
      return;
    }

    setIsNegotiating(true);
    try {
      const response = await API.put(
        `/paymentnegotiation/${negotiationId}/respond`,
        {
          response: 'counter',
          counterOffer: parseFloat(counterOffer),
          message: counterMessage,
        },
        {
          headers: { Authorization: `Bearer ${session.token}` },
        },
      );

      if (response.data.success) {
        toast.success('Counter offer submitted successfully');
        fetchNegotiations();
        setCounterOffer('');
        setCounterMessage('');
      }
    } catch (error) {
      console.error('Error submitting counter offer:', error);
      toast.error('Failed to submit counter offer');
    } finally {
      setIsNegotiating(false);
    }
  };

  const handleNegotiationResponse = async (negotiationId, responseType) => {
    setIsNegotiating(true);
    try {
      const apiResponse = await API.put(
        `/paymentnegotiation/${negotiationId}/respond`,
        {
          response: responseType,
        },
        {
          headers: { Authorization: `Bearer ${session.token}` },
        },
      );

      if (apiResponse.data.success) {
        toast.success(
          `You have ${responseType === 'accept' ? 'accepted' : 'rejected'} the fee offer`,
        );
        fetchNegotiations();
      }
    } catch (error) {
      console.error(`Error ${responseType} offer:`, error);
      toast.error(`Failed to ${responseType} offer`);
    } finally {
      setIsNegotiating(false);
    }
  };

  const handleProceedToPayment = (connectionId) => {
    navigate(`/payments/${connectionId}`);
  };

  return (
    <div className="mt-[50px] container mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Payments & History</h1>
        </div>
      </div>

      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex justify-center gap-4 mb-6 w-auto mx-auto">
          {session?.role === 'student' && (
            <>
              <TabsTrigger value="pendingPayments">
                <Clock className="mr-2 h-4 w-4" />
                Pending Payments
              </TabsTrigger>
              <TabsTrigger value="paymentHistory">
                <History className="mr-2 h-4 w-4" />
                Payment History
              </TabsTrigger>
            </>
          )}
          {session?.role === 'mentor' && (
            <>
              <TabsTrigger value="studentPayments">
                <CircleDollarSign className="mr-2 h-4 w-4" />
                Student Payments
              </TabsTrigger>
              <TabsTrigger value="negotiations">
                <Users className="mr-2 h-4 w-4" />
                Negotiations
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Student: Pending Payments Tab */}
        {session?.role === 'student' && (
          <TabsContent value="pendingPayments" className="mt-0">
            {isLoading ? (
              <LoadingSkeletons />
            ) : pendingPayments.length === 0 ? (
              <EmptyState
                type="payments"
                message="You don't have any pending payments at the moment."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingPayments.map((connection) => (
                  <Card key={connection._id} className="overflow-hidden border-yellow-200">
                    <CardHeader className="pb-2 bg-yellow-50">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage
                              src={connection.mentorId.profilePic}
                              alt={connection.mentorId.firstname}
                            />
                            <AvatarFallback>
                              {connection.mentorId.firstname[0]}
                              {connection.mentorId.lastname[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">
                              {connection.mentorId.firstname} {connection.mentorId.lastname}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {connection.mentorId.university}
                            </CardDescription>
                          </div>
                        </div>
                        {getStatusBadge('pending')}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-2">
                        <p>
                          <strong>Expertise:</strong> {connection.mentorId.expertise || 'General'}
                        </p>
                        <p>
                          <strong>Fee:</strong>{' '}
                          {formatCurrency(connection.negotiatedFee, connection.feeCurrency)}
                        </p>
                        <p>
                          <strong>Connection Date:</strong> {formatDate(connection.createdAt)}
                        </p>
                        <p>
                          <strong>Payment Status:</strong>{' '}
                          <span className="text-yellow-600 font-semibold">Payment Required</span>
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        onClick={() => handleProceedToPayment(connection._id)}
                        className="w-full"
                      >
                        <CircleDollarSign className="mr-2 h-4 w-4" />
                        Pay Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}

        {/* Student: Payment History Tab */}
        {session?.role === 'student' && (
          <TabsContent value="paymentHistory" className="mt-0">
            {isLoading ? (
              <LoadingSkeletons />
            ) : paymentHistory.length === 0 ? (
              <EmptyState type="payments" message="You don't have any payment history yet." />
            ) : (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-4">Payment Transaction History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">
                            {session.role === 'student' ? 'Mentor' : 'Student'}
                          </th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Payment ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((payment) => (
                          <tr key={payment._id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{formatDate(payment.createdAt)}</td>
                            <td className="py-3 px-4">
                              {session.role === 'student'
                                ? payment.mentorId &&
                                  typeof payment.mentorId === 'object' &&
                                  payment.mentorId.firstname &&
                                  payment.mentorId.lastname
                                  ? `${payment.mentorId.firstname} ${payment.mentorId.lastname}`
                                  : 'Mentor info unavailable'
                                : payment.studentId &&
                                  typeof payment.studentId === 'object' &&
                                  payment.studentId.firstname &&
                                  payment.studentId.lastname
                                ? `${payment.studentId.firstname} ${payment.studentId.lastname}`
                                : 'Student info unavailable'}
                            </td> 
                            <td className="py-3 px-4">
                              {formatCurrency(payment.amount, payment.currency)}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  payment.paymentStatus === 'paid'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {payment.paymentStatus.charAt(0).toUpperCase() +
                                  payment.paymentStatus.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs">{payment.payment_uuid}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedPayments.map((connection) => (
                    <Card key={connection._id} className="overflow-hidden border-green-100">
                      <CardHeader className="pb-2 bg-green-50">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src={
                                  session.role === 'student'
                                    ? connection.mentorId.profilePic
                                    : connection.studentId.profilePic
                                }
                                alt={
                                  session.role === 'student'
                                    ? connection.mentorId.firstname
                                    : connection.studentId.firstname
                                }
                              />
                              <AvatarFallback>
                                {session.role === 'student'
                                  ? `${connection.mentorId.firstname[0]}${connection.mentorId.lastname[0]}`
                                  : `${connection.studentId.firstname[0]}${connection.studentId.lastname[0]}`}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">
                                {session.role === 'student'
                                  ? `${connection.mentorId.firstname} ${connection.mentorId.lastname}`
                                  : `${connection.studentId.firstname} ${connection.studentId.lastname}`}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {session.role === 'student'
                                  ? connection.mentorId.university
                                  : connection.studentId.major || 'Student'}
                              </CardDescription>
                            </div>
                          </div>
                          {getStatusBadge('paid')}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-2">
                          {session.role === 'student' && (
                            <p>
                              <strong>Expertise:</strong>{' '}
                              {connection.mentorId.expertise || 'General'}
                            </p>
                          )}
                          <p>
                            <strong>Fee:</strong>{' '}
                            {formatCurrency(
                              connection.negotiatedFee,
                              connection.feeCurrency 
                            )}
                          </p>
                          <p>
                            <strong>Connection Date:</strong> {formatDate(connection.createdAt)}
                          </p>
                          <p>
                            <strong>Payment Date:</strong>{' '}
                            {formatDate(connection.payment?.createdAt)}
                          </p>
                          <p>
                            <strong>Payment Status:</strong>{' '}
                            <span className="text-green-600 font-semibold">Completed</span>
                          </p>
                          {connection.payment && (
                            <p>
                              <strong>Payment ID:</strong>{' '}
                              <span className="font-mono text-xs">
                                {connection.payment.payment_uuid}
                              </span>
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" className="w-full" disabled>
                          <Check className="mr-2 h-4 w-4" />
                          Payment Complete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        )}

        {/* Mentor: Student Payments Tab */}
        {session?.role === 'mentor' && (
          <TabsContent value="studentPayments" className="mt-0">
            {isLoading ? (
              <LoadingSkeletons />
            ) : connections.length === 0 ? (
              <EmptyState
                type="payments"
                message="You don't have any connected students at the moment."
              />
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connections.map((connection) => (
                    <Card
                      key={connection._id}
                      className={`overflow-hidden ${
                        connection.paymentStatus === 'paid'
                          ? 'border-green-100'
                          : 'border-yellow-100'
                      }`}
                    >
                      <CardHeader
                        className={`pb-2 ${
                          connection.paymentStatus === 'paid' ? 'bg-green-50' : 'bg-yellow-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src={connection.studentId.profilePic}
                                alt={connection.studentId.firstname}
                              />
                              <AvatarFallback>
                                {connection.studentId.firstname[0]}
                                {connection.studentId.lastname[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">
                                {connection.studentId.firstname} {connection.studentId.lastname}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {connection.studentId.major || 'Student'}
                              </CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(connection.paymentStatus)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-2">
                          <p>
                            <strong>Connection Date:</strong> {formatDate(connection.createdAt)}
                          </p>
                          <p>
                            <strong>Fee Status:</strong>{' '}
                            {connection.paymentStatus === 'paid'
                              ? 'Payment received'
                              : 'Payment pending'}
                          </p>
                          {connection.paymentStatus === 'paid' && connection.payment && (
                            <>
                              <p>
                                <strong>Payment Date:</strong>{' '}
                                {formatDate(connection.payment.createdAt)}
                              </p>
                              <p>
                                <strong>Payment ID:</strong>{' '}
                                <span className="font-mono text-xs">
                                  {connection.payment.payment_uuid}
                                </span>
                              </p>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-4">Payment Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">Total Students</p>
                      <p className="text-2xl font-bold">{connections.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800">Paid Students</p>
                      <p className="text-2xl font-bold">
                        {connections.filter((c) => c.paymentStatus === 'paid').length}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800">Pending Payments</p>
                      <p className="text-2xl font-bold">
                        {connections.filter((c) => c.paymentStatus === 'pending').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        )}

        {/* Mentor: Negotiations Tab */}
        {session?.role === 'mentor' && (
          <TabsContent value="negotiations" className="mt-0">
            {isLoading ? (
              <LoadingSkeletons />
            ) : negotiations.length === 0 ? (
              <EmptyState
                type="negotiations"
                message="You don't have any fee negotiations at the moment."
              />
            ) : (
              <div className="space-y-4">
                {negotiations.map((negotiation) => (
                  <NegotiationCard
                    key={negotiation._id}
                    negotiation={negotiation}
                    handleNegotiationResponse={handleNegotiationResponse}
                    handleCounterOffer={handleCounterOffer}
                    counterOffer={counterOffer}
                    setCounterOffer={setCounterOffer}
                    counterMessage={counterMessage}
                    setCounterMessage={setCounterMessage}
                    isNegotiating={isNegotiating}
                    getStatusBadge={getStatusBadge}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
