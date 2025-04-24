import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { sessionAtom } from '@/atoms/session';
import { ArrowLeft, Check, X, RefreshCw, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import API from '../api';

export default function PaymentPage() {
  const [session] = useAtom(sessionAtom);
  const [negotiations, setNegotiations] = useState([]);
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
      const response = await API.get(`/affiliations/mentor/${session._id}`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });

      if (response.data && response.data.length > 0) {
        const affiliationsWithPayment = response.data.filter(aff => aff.paymentId);

        const paymentPromises = affiliationsWithPayment.map(aff => 
          API.get(`/affiliations/${aff._id}`, {
            headers: { Authorization: `Bearer ${session.token}` },
          })
        );

        const paymentResponses = await Promise.all(paymentPromises);
        const negotiationData = paymentResponses
          .filter(res => res.data.affiliation && res.data.affiliation.paymentId)
          .map(res => res.data.affiliation.payment);

        setNegotiations(negotiationData);
      } else {
        setNegotiations([]);
      }
    } catch (error) { 
      console.error('Error fetching negotiations:', error);
      toast.error('Failed to load negotiation history');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session || !session._id || session.role !== 'mentor') {
      navigate('/login');
      return;
    }

    fetchNegotiations();
  }, [session, navigate, fetchNegotiations]);

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

  const handleCounterOffer = async (paymentId) => {
    if (!counterOffer || isNaN(parseFloat(counterOffer)) || parseFloat(counterOffer) <= 0) {
      toast.error('Please enter a valid counter offer amount');
      return;
    }

    setIsNegotiating(true);
    try {
      const response = await API.put(`/payment/${paymentId}/respond`, {
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

  const handleNegotiationResponse = async (paymentId, response) => {
    setIsNegotiating(true);
    try {
      const apiResponse = await API.put(`/payment/${paymentId}/respond`, {
        response,
      }, {
        headers: { Authorization: `Bearer ${session.token}` },
      });

      if (apiResponse.data.success) {
        toast.success(`You have ${response === 'accept' ? 'accepted' : 'rejected'} the fee offer`);
        fetchNegotiations();
      }
    } catch (error) {
      console.error(`Error ${response} offer:`, error);
      toast.error(`Failed to ${response} offer`);
    } finally {
      setIsNegotiating(false);
    }
  };

  const filteredNegotiations = negotiations.filter(negotiation => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return negotiation.status === 'pending';
    if (activeTab === 'awaiting') return negotiation.status === 'admin_approved';
    if (activeTab === 'approved') return negotiation.status === 'mentor_approved';
    return false;
  });

  return (
    <div className="mt-[50px] container mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Fee Negotiations</h1>
        </div>
        <Button variant="outline" size="sm" onClick={fetchNegotiations} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="awaiting">Awaiting Response</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="mb-4">
                  <CardHeader className="pb-4">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/4 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredNegotiations.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No negotiations found</h3>
              <p className="text-gray-500">
                {activeTab === 'all' 
                  ? "You don't have any fee negotiations at the moment."
                  : activeTab === 'awaiting'
                  ? "No negotiations awaiting your response."
                  : `No ${activeTab} negotiations available.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNegotiations.map((negotiation) => (
                <Card key={negotiation._id} className="mb-4">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Affiliation Fee Negotiation</CardTitle>
                        <CardDescription>
                          {negotiation.createdAt && 
                            `Started on ${format(new Date(negotiation.createdAt), 'MMM dd, yyyy')}`}
                        </CardDescription>
                      </div>
                      {getStatusBadge(negotiation.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Your Initial Proposal</p>
                        <p className="font-semibold">
                          {negotiation.expectedConsultationFee} {negotiation.currency}
                        </p>
                      </div>
                      
                      {negotiation.negotiatedConsultationFee && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Admin&apos;s Proposal</p>
                          <p className="font-semibold">
                            {negotiation.negotiatedConsultationFee} {negotiation.currency}
                          </p>
                        </div>
                      )}
                      
                      {negotiation.finalConsultationFee && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Final Agreed Fee</p>
                          <p className="font-semibold text-green-600">
                            {negotiation.finalConsultationFee} {negotiation.currency}
                          </p>
                        </div>
                      )}
                    </div>

                    {negotiation.status === 'admin_approved' && (
                      <div className="mt-6 bg-blue-50 p-4 rounded-md">
                        <h4 className="text-sm font-semibold mb-2">Admin has proposed a fee of {negotiation.negotiatedConsultationFee} {negotiation.currency}</h4>
                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                          <Button 
                            onClick={() => handleNegotiationResponse(negotiation._id, 'accept')}
                            disabled={isNegotiating}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Accept Offer
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Counter Offer
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Make a Counter Offer</DialogTitle>
                                <DialogDescription>
                                  The admin proposed {negotiation.negotiatedConsultationFee} {negotiation.currency}. You can counter with your own offer.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Your Counter Offer ({negotiation.currency})</label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={counterOffer}
                                    onChange={(e) => setCounterOffer(e.target.value)}
                                    placeholder="Enter your counter offer"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Message (Optional)</label>
                                  <Textarea
                                    value={counterMessage}
                                    onChange={(e) => setCounterMessage(e.target.value)}
                                    placeholder="Explain your counter offer..."
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  type="submit" 
                                  onClick={() => handleCounterOffer(negotiation._id)}
                                  disabled={isNegotiating}
                                >
                                  Submit Counter Offer
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="destructive"
                            onClick={() => handleNegotiationResponse(negotiation._id, 'reject')}
                            disabled={isNegotiating}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject Offer
                          </Button>
                        </div>
                      </div>
                    )}

                    {negotiation.negotiationHistory && negotiation.negotiationHistory.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold mb-2">Negotiation History</h4>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {negotiation.negotiationHistory.map((entry, index) => (
                            <div key={index} className={`p-3 rounded-md text-sm ${
                              entry.proposedBy === 'admin' ? 'bg-gray-100' : 'bg-blue-50'
                            }`}>
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {entry.proposedBy === 'admin' ? 'Admin' : 'You'} proposed:
                                </span>
                                <span className="font-bold">
                                  {entry.amount} {negotiation.currency}
                                </span>
                              </div>
                              {entry.message && (
                                <p className="text-gray-600 mt-1">{entry.message}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {entry.timestamp && format(new Date(entry.timestamp), 'MMM dd, yyyy - h:mm a')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}