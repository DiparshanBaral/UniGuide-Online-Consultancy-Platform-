import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Check, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const NegotiationCard = ({ 
  negotiation, 
  handleNegotiationResponse, 
  handleCounterOffer,
  counterOffer,
  setCounterOffer,
  counterMessage,
  setCounterMessage,
  isNegotiating,
  getStatusBadge
}) => (
  <Card className="mb-4">
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
);

// Add proper prop validation
NegotiationCard.propTypes = {
  negotiation: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    expectedConsultationFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    currency: PropTypes.string.isRequired,
    negotiatedConsultationFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    finalConsultationFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    createdAt: PropTypes.string,
    negotiationHistory: PropTypes.arrayOf(
      PropTypes.shape({
        proposedBy: PropTypes.string.isRequired,
        amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        message: PropTypes.string,
        timestamp: PropTypes.string
      })
    )
  }).isRequired,
  handleNegotiationResponse: PropTypes.func.isRequired,
  handleCounterOffer: PropTypes.func.isRequired,
  counterOffer: PropTypes.string.isRequired,
  setCounterOffer: PropTypes.func.isRequired,
  counterMessage: PropTypes.string.isRequired,
  setCounterMessage: PropTypes.func.isRequired,
  isNegotiating: PropTypes.bool.isRequired,
  getStatusBadge: PropTypes.func.isRequired
};

export default NegotiationCard;