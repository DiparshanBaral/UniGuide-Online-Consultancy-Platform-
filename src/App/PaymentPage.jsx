import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { sessionAtom } from '@/atoms/session';
import { ArrowLeft, RefreshCw, DollarSign, Clock } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import NegotiationCard from '@/Components/NegotiationCard';
import EmptyState from '@/Components/EmptyState';
import LoadingSkeletons from '@/Components/LoadingSkeletons';
import API from '../api';

export default function PaymentPage() {
  const [session] = useAtom(sessionAtom);
  const [negotiations, setNegotiations] = useState([]);
  const [payments, setPayments] = useState([]); // For future use with student payments
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [counterOffer, setCounterOffer] = useState('');
  const [counterMessage, setCounterMessage] = useState('');
  const [isNegotiating, setIsNegotiating] = useState(false);
  const navigate = useNavigate();

  const fetchNegotiations = useCallback(async () => {
    if (!session || !session._id) return;

    setIsLoading(true);
    try {
      // Use the direct paymentnegotiation endpoint to get mentor's negotiations
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

  // Function to fetch payments (to be implemented in the future)
  const fetchPayments = useCallback(async () => {
    if (!session || !session._id) return;
    
    // This is a placeholder for future implementation
    // Will connect to payment endpoints when they're created
    setPayments([]);
  }, [session]);

  useEffect(() => {
    if (!session || !session._id) {
      navigate('/login');
      return;
    }

    if (activeTab === 'all' || activeTab === 'negotiations') {
      fetchNegotiations();
    }
    
    if (activeTab === 'all' || activeTab === 'payments') {
      fetchPayments();
    }
  }, [session, navigate, fetchNegotiations, fetchPayments, activeTab]);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'admin_approved':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Awaiting Your Response</Badge>;
      case 'mentor_approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCounterOffer = async (negotiationId) => {
    if (!counterOffer || isNaN(parseFloat(counterOffer)) || parseFloat(counterOffer) <= 0) {
      toast.error('Please enter a valid counter offer amount');
      return;
    }

    setIsNegotiating(true);
    try {
      const response = await API.put(`/paymentnegotiation/${negotiationId}/respond`, {
        response: 'counter',
        counterOffer: parseFloat(counterOffer),
        message: counterMessage,
      }, {
        headers: { Authorization: `Bearer ${session.token}` },
      });

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
      // Use the correct endpoint from paymentNegotiationRoutes.js
      const apiResponse = await API.put(`/paymentnegotiation/${negotiationId}/respond`, {
        response: responseType,
      }, {
        headers: { Authorization: `Bearer ${session.token}` },
      });

      if (apiResponse.data.success) {
        toast.success(`You have ${responseType === 'accept' ? 'accepted' : 'rejected'} the fee offer`);
        fetchNegotiations();
      }
    } catch (error) {
      console.error(`Error ${responseType} offer:`, error);
      toast.error(`Failed to ${responseType} offer`);
    } finally {
      setIsNegotiating(false);
    }
  };

  return (
    <div className="mt-[50px] container mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Fee Payment and Negotiations</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => activeTab === 'payments' ? fetchPayments() : fetchNegotiations()} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          {session?.role === 'mentor' && (
            <TabsTrigger value="negotiations">Negotiations</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <LoadingSkeletons />
          ) : (
            <div className="space-y-8">
              {/* Payments Section - if any */}
              {payments.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-primary" />
                    Payments
                  </h2>
                  <div className="space-y-4">
                    {/* Payment cards would go here in the future */}
                    <p className="text-muted-foreground text-center p-4">
                      Payment functionality will be available soon.
                    </p>
                  </div>
                </div>
              )}

              {/* Negotiations Section */}
              {session?.role === 'mentor' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Fee Negotiations
                  </h2>
                  {negotiations.length === 0 ? (
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
                </div>
              )}
              
              {payments.length === 0 && negotiations.length === 0 && (
                <EmptyState
                  type="all"
                  message="You don't have any payments or negotiations at the moment."
                />
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="payments" className="mt-0">
          {isLoading ? (
            <LoadingSkeletons />
          ) : payments.length === 0 ? (
            <EmptyState
              type="payments"
              message="You don't have any payments at the moment."
            />
          ) : (
            <div className="space-y-4">
              {/* Payment cards would go here in the future */}
              <p className="text-muted-foreground text-center p-4">
                Payment functionality will be available soon.
              </p>
            </div>
          )}
        </TabsContent>

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