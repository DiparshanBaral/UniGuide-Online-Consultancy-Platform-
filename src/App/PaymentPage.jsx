'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import PropTypes from 'prop-types';
import { sessionAtom } from '@/atoms/session';
import {
  ArrowLeft,
  Check,
  CircleDollarSign,
  Users,
  Clock,
  History,
  WalletIcon,
  Download,
  ArrowDownToLine,
  FileText,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Badge } from '@/Components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/Components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import NegotiationCard from '@/Components/NegotiationCard';
import EmptyState from '@/Components/EmptyState';
import LoadingSkeletons from '@/Components/LoadingSkeletons';
import API from '../api';

// Transaction Card Component
const TransactionCard = ({ transaction, role }) => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getName = () => {
    if (role === 'student') {
      return transaction.mentorId &&
        typeof transaction.mentorId === 'object' &&
        transaction.mentorId.firstname &&
        transaction.mentorId.lastname
        ? `${transaction.mentorId.firstname} ${transaction.mentorId.lastname}`
        : 'Mentor info unavailable';
    } else {
      return transaction.studentId &&
        typeof transaction.studentId === 'object' &&
        transaction.studentId.firstname &&
        transaction.studentId.lastname
        ? `${transaction.studentId.firstname} ${transaction.studentId.lastname}`
        : 'Student info unavailable';
    }
  };

  return (
    <Card className={`overflow-hidden border ${getStatusColor(transaction.paymentStatus)}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">{getName()}</CardTitle>
              <CardDescription className="text-xs">
                {formatDate(transaction.createdAt)}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className={
              transaction.paymentStatus === 'paid'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }
          >
            {transaction.paymentStatus.charAt(0).toUpperCase() + transaction.paymentStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(transaction.createdAt)}</span>
            </div>
          </div>
          <div className="text-lg font-bold">
            {formatCurrency(transaction.amount, transaction.currency)}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Payment ID:</span>
            <span className="font-mono">{transaction.payment_uuid}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

TransactionCard.propTypes = {
  transaction: PropTypes.shape({
    _id: PropTypes.string,
    createdAt: PropTypes.string,
    amount: PropTypes.number,
    currency: PropTypes.string,
    paymentStatus: PropTypes.string,
    payment_uuid: PropTypes.string,
    mentorId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        firstname: PropTypes.string,
        lastname: PropTypes.string,
      }),
    ]),
    studentId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        firstname: PropTypes.string,
        lastname: PropTypes.string,
      }),
    ]),
  }).isRequired,
  role: PropTypes.oneOf(['student', 'mentor']).isRequired,
};

// Connection Card Component
const ConnectionCard = ({
  connection,
  role,
  handleProceedToPayment,
  getStatusBadge,
  formatDate,
  formatCurrency,
}) => {
  const isPaid = connection.paymentStatus === 'paid';

  const renderUserInfo = (user, role) => {
    if (typeof user === 'string') {
      return {
        name: role === 'mentor' ? 'Mentor' : 'Student',
        initials: role === 'mentor' ? 'M' : 'S',
        affiliation: role === 'mentor' ? 'University' : 'Student',
        image: null,
      };
    }

    return {
      name:
        `${user.firstname || ''} ${user.lastname || ''}`.trim() ||
        (role === 'mentor' ? 'Mentor' : 'Student'),
      initials:
        `${user.firstname?.[0] || ''}${user.lastname?.[0] || ''}`.trim() ||
        (role === 'mentor' ? 'M' : 'S'),
      affiliation: role === 'mentor' ? user.university || 'University' : user.major || 'Student',
      image: user.profilePic,
    };
  };

  const mentorInfo = renderUserInfo(connection.mentorId, 'mentor');
  const studentInfo = renderUserInfo(connection.studentId, 'student');

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
        isPaid ? 'border-green-200' : 'border-yellow-200'
      }`}
    >
      <CardHeader className={`pb-2 ${isPaid ? 'bg-green-50' : 'bg-yellow-50'}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="border-2 border-white shadow-sm">
              <AvatarImage
                src={role === 'student' ? mentorInfo.image : studentInfo.image}
                alt={role === 'student' ? mentorInfo.name : studentInfo.name}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {role === 'student' ? mentorInfo.initials : studentInfo.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">
                {role === 'student' ? mentorInfo.name : studentInfo.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {role === 'student' ? mentorInfo.affiliation : studentInfo.affiliation}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge(connection.paymentStatus)}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {role === 'student' && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Expertise:</span>
              <span className="font-medium">
                {typeof connection.mentorId === 'object' && connection.mentorId.expertise
                  ? connection.mentorId.expertise
                  : 'General'}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Fee:</span>
            <span className="font-medium">
              {formatCurrency(connection.negotiatedFee, connection.feeCurrency)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Connection Date:</span>
            <span className="font-medium">{formatDate(connection.createdAt)}</span>
          </div>
          {isPaid && connection.payment && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Payment Date:</span>
              <span className="font-medium">{formatDate(connection.payment.createdAt)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Status:</span>
            <span className={`font-medium ${isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
              {isPaid ? 'Payment Complete' : 'Payment Required'}
            </span>
          </div>
          {isPaid && connection.payment && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Payment ID:</span>
              <span className="font-mono text-xs">{connection.payment.payment_uuid}</span>
            </div>
          )}
        </div>
      </CardContent>
      {role === 'student' && !isPaid && (
        <CardFooter className="pt-0">
          <Button onClick={() => handleProceedToPayment(connection._id)} className="w-full gap-2">
            <CircleDollarSign className="h-4 w-4" />
            Pay Now
          </Button>
        </CardFooter>
      )}
      {isPaid && (
        <CardFooter className="pt-0">
          <Button variant="outline" className="w-full gap-2" disabled={role === 'student'}>
            {role === 'student' ? (
              <>
                <Check className="h-4 w-4" />
                Payment Complete
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                View Invoice
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

// Update PropTypes for ConnectionCard to accept either string or object
ConnectionCard.propTypes = {
  connection: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    paymentStatus: PropTypes.string.isRequired,
    negotiatedFee: PropTypes.number,
    feeCurrency: PropTypes.string,
    payment: PropTypes.shape({
      createdAt: PropTypes.string,
      payment_uuid: PropTypes.string,
    }),
    mentorId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        firstname: PropTypes.string,
        lastname: PropTypes.string,
        profilePic: PropTypes.string,
        university: PropTypes.string,
        expertise: PropTypes.string,
      }),
    ]).isRequired,
    studentId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        firstname: PropTypes.string,
        lastname: PropTypes.string,
        profilePic: PropTypes.string,
        major: PropTypes.string,
      }),
    ]).isRequired,
  }).isRequired,
  role: PropTypes.oneOf(['student', 'mentor']).isRequired,
  handleProceedToPayment: PropTypes.func.isRequired,
  getStatusBadge: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  formatCurrency: PropTypes.func.isRequired,
};

// Enhanced Wallet Display with Withdraw Button
const EnhancedWalletDisplay = ({ walletData, onWithdraw }) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  const [accountDetails, setAccountDetails] = useState('');

  const handleWithdrawSubmit = () => {
    if (
      !withdrawAmount ||
      isNaN(Number.parseFloat(withdrawAmount)) ||
      Number.parseFloat(withdrawAmount) <= 0
    ) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (Number.parseFloat(withdrawAmount) > walletData.balance) {
      toast.error('Withdrawal amount exceeds available balance');
      return;
    }

    if (!accountDetails) {
      toast.error('Please enter your account details');
      return;
    }

    onWithdraw({
      amount: Number.parseFloat(withdrawAmount),
      method: withdrawMethod,
      accountDetails,
    });

    setShowWithdrawModal(false);
    toast.success('Withdrawal request submitted successfully');
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary/90 to-primary">
        <CardHeader>
          <CardTitle className="text-white text-xl">Mentor Wallet</CardTitle>
          <CardDescription className="text-white/80">
            Manage your earnings and withdrawals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="text-white/80 mb-2">Available Balance</div>
            <div className="text-white text-4xl font-bold mb-4">
              ${walletData?.balance || '0.00'}
            </div>
            <div className="flex gap-3 mt-2">
              <Button
                onClick={() => setShowWithdrawModal(true)}
                variant="secondary"
                className="gap-2"
              >
                <ArrowDownToLine className="h-4 w-4" />
                Withdraw Funds
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{walletData?.totalStudents || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4 text-primary" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${walletData?.totalEarnings || '0.00'}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4 text-primary" />
              Total Withdrawn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${walletData?.totalWithdrawn || '0.00'}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {walletData?.recentTransactions?.length > 0 ? (
            <div className="space-y-4">
              {walletData.recentTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === 'earning'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {transaction.type === 'earning' ? (
                        <CircleDollarSign className="h-4 w-4" />
                      ) : (
                        <ArrowDownToLine className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {transaction.type === 'earning' ? 'Payment Received' : 'Withdrawal'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold">
                      {transaction.type === 'earning' ? '+' : '-'}${transaction.amount}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">No recent transactions</div>
          )}
        </CardContent>
      </Card>

      {/* Withdraw Modal */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Enter the amount you want to withdraw and your payment details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Available balance: ${walletData?.balance || '0.00'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Withdrawal Method</Label>
              <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="venmo">Venmo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Account Details</Label>
              <Input
                id="details"
                placeholder={
                  withdrawMethod === 'bank'
                    ? 'Account number, routing number, etc.'
                    : withdrawMethod === 'paypal'
                    ? 'PayPal email address'
                    : 'Venmo username'
                }
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWithdrawModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleWithdrawSubmit}>Confirm Withdrawal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

EnhancedWalletDisplay.propTypes = {
  walletData: PropTypes.shape({
    balance: PropTypes.number,
    totalEarnings: PropTypes.number,
    totalWithdrawn: PropTypes.number,
    totalStudents: PropTypes.number,
    recentTransactions: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(['earning', 'withdrawal']).isRequired,
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        studentName: PropTypes.string,
        method: PropTypes.string,
      }),
    ),
  }).isRequired,
  onWithdraw: PropTypes.func.isRequired,
  onViewInvoice: PropTypes.func.isRequired,
};

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
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [setSelectedInvoice] = useState(null);
  const [isWalletLoading, setIsWalletLoading] = useState(true);
  const [walletData, setWalletData] = useState({
    balance: 0,
    totalEarnings: 0,
    totalWithdrawn: 0,
    totalStudents: 0,
    recentTransactions: [],
  });
  const navigate = useNavigate();

  const fetchWalletData = useCallback(async () => {
    if (!session || !session._id || session.role !== 'mentor') return;

    try {
      setIsWalletLoading(true);
      const response = await API.get(`/wallet/${session._id}`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });

      // Calculate derived data from wallet transactions
      const transactions = response.data.transactions || [];
      const deposits = transactions.filter((t) => t.type === 'deposit');
      const withdrawals = transactions.filter((t) => t.type === 'withdrawal');

      // Calculate totals
      const totalEarnings = deposits.reduce((sum, t) => sum + t.amount, 0);
      const totalWithdrawn = withdrawals.reduce((sum, t) => sum + t.amount, 0);

      // Format transactions for display
      const recentTransactions = transactions
        .map((t) => ({
          type: t.type === 'deposit' ? 'earning' : 'withdrawal',
          amount: t.amount,
          date: t.createdAt,
          studentName: t.paymentId ? 'Student' : undefined,
          method: t.type === 'withdrawal' ? 'Bank Transfer' : undefined,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      // Count unique students (fixed to avoid dependency on connections)
      const studentIds = new Set(deposits.map((t) => t.paymentId?.toString()).filter(Boolean));
      const totalStudents = studentIds.size;

      setWalletData({
        balance: response.data.balance || 0,
        currency: response.data.currency || 'usd',
        totalEarnings,
        totalWithdrawn,
        totalStudents: totalStudents,
        recentTransactions,
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load wallet information');
    } finally {
      setIsWalletLoading(false);
    }
  }, [session]);

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

                if (
                  negotiationResponse.data?.success &&
                  Array.isArray(negotiationResponse.data?.negotiations)
                ) {
                  const approvedNegotiation = negotiationResponse.data.negotiations.find(
                    (neg) => neg.status === 'mentor_approved' && neg.finalConsultationFee,
                  );

                  if (approvedNegotiation) {
                    fee = approvedNegotiation.finalConsultationFee;
                    currency = approvedNegotiation.currency;
                  }
                }
              } catch (error) {
                console.error('Error fetching negotiation data:', error);
                console.log(`Using default fee for connection ${connection._id}`);
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
                negotiatedFee: connection.mentorId.consultationFee,
                feeCurrency: connection.mentorId.currency,
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
      fetchWalletData(); // Add this line to fetch wallet data for mentors
    }
  }, [
    session,
    navigate,
    fetchConnections,
    fetchNegotiations,
    fetchMentorConnections,
    fetchPaymentHistory,
    fetchWalletData,
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
    if (
      !counterOffer ||
      isNaN(Number.parseFloat(counterOffer)) ||
      Number.parseFloat(counterOffer) <= 0
    ) {
      toast.error('Please enter a valid counter offer amount');
      return;
    }

    setIsNegotiating(true);
    try {
      const response = await API.put(
        `/paymentnegotiation/${negotiationId}/respond`,
        {
          response: 'counter',
          counterOffer: Number.parseFloat(counterOffer),
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

  const handleWithdraw = async (withdrawData) => {
    try {
      // This would be an API call in a real implementation
      toast.info('Withdrawal request sent! This feature is coming soon.');

      // For now, just update the local state for demo purposes
      setWalletData((prev) => ({
        ...prev,
        balance: prev.balance - withdrawData.amount,
        totalWithdrawn: prev.totalWithdrawn + withdrawData.amount,
        recentTransactions: [
          {
            type: 'withdrawal',
            amount: withdrawData.amount,
            date: new Date().toISOString(),
            method: withdrawData.method,
          },
          ...prev.recentTransactions,
        ],
      }));
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast.error('Failed to process withdrawal request');
    }
  };

  const handleViewInvoice = (invoice = null) => {
    if (invoice) {
      setSelectedInvoice(invoice);
    }
    setShowInvoiceModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Payments & History</h1>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="flex justify-center gap-4 mb-6 w-auto mx-auto bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              {session?.role === 'student' && (
                <>
                  <TabsTrigger
                    value="pendingPayments"
                    className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                  >
                    <Clock className="h-4 w-4" />
                    Pending Payments
                  </TabsTrigger>
                  <TabsTrigger
                    value="paymentHistory"
                    className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                  >
                    <History className="h-4 w-4" />
                    Payment History
                  </TabsTrigger>
                </>
              )}
              {session?.role === 'mentor' && (
                <>
                  <TabsTrigger
                    value="studentPayments"
                    className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                  >
                    <CircleDollarSign className="h-4 w-4" />
                    Student Payments
                  </TabsTrigger>
                  <TabsTrigger
                    value="negotiations"
                    className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                  >
                    <Users className="h-4 w-4" />
                    Negotiations
                  </TabsTrigger>
                  <TabsTrigger
                    value="wallet"
                    className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                  >
                    <WalletIcon className="h-4 w-4" />
                    My Wallet
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Student: Pending Payments Tab */}
            {session?.role === 'student' && (
              <TabsContent value="pendingPayments" className="mt-6">
                {isLoading ? (
                  <LoadingSkeletons />
                ) : pendingPayments.length === 0 ? (
                  <EmptyState
                    type="payments"
                    message="You don't have any pending payments at the moment."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingPayments.map((connection) => (
                      <ConnectionCard
                        key={connection._id}
                        connection={connection}
                        role={session.role}
                        handleProceedToPayment={handleProceedToPayment}
                        getStatusBadge={getStatusBadge}
                        formatDate={formatDate}
                        formatCurrency={formatCurrency}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )}

            {/* Student: Payment History Tab */}
            {session?.role === 'student' && (
              <TabsContent value="paymentHistory" className="mt-6">
                {isLoading ? (
                  <LoadingSkeletons />
                ) : paymentHistory.length === 0 ? (
                  <EmptyState type="payments" message="You don't have any payment history yet." />
                ) : (
                  <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium">Payment Transaction History</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="text-left py-3 px-4 font-medium">Date</th>
                              <th className="text-left py-3 px-4 font-medium">
                                {session.role === 'student' ? 'Mentor' : 'Student'}
                              </th>
                              <th className="text-left py-3 px-4 font-medium">Amount</th>
                              <th className="text-left py-3 px-4 font-medium">Status</th>
                              <th className="text-left py-3 px-4 font-medium">Payment ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paymentHistory.map((payment) => (
                              <tr
                                key={payment._id}
                                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                <td className="py-4 px-4">{formatDate(payment.createdAt)}</td>
                                <td className="py-4 px-4">
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
                                <td className="py-4 px-4 font-medium">
                                  {formatCurrency(payment.amount, payment.currency)}
                                </td>
                                <td className="py-4 px-4">
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
                                <td className="py-4 px-4 font-mono text-xs">
                                  {payment.payment_uuid}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium mt-8 mb-4">Recent Transactions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paymentHistory.slice(0, 3).map((transaction) => (
                        <TransactionCard
                          key={transaction._id}
                          transaction={transaction}
                          role={session.role}
                        />
                      ))}
                    </div>

                    <h3 className="text-lg font-medium mt-8 mb-4">Completed Payments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {completedPayments.map((connection) => (
                        <ConnectionCard
                          key={connection._id}
                          connection={connection}
                          role={session.role}
                          handleProceedToPayment={handleProceedToPayment}
                          getStatusBadge={getStatusBadge}
                          formatDate={formatDate}
                          formatCurrency={formatCurrency}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            )}

            {/* Mentor: Student Payments Tab */}
            {session?.role === 'mentor' && (
              <TabsContent value="studentPayments" className="mt-6">
                {isLoading ? (
                  <LoadingSkeletons />
                ) : connections.length === 0 ? (
                  <EmptyState
                    type="payments"
                    message="You don't have any connected students at the moment."
                  />
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <Card className="bg-white shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            Total Students
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{connections.length}</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <CircleDollarSign className="h-4 w-4 text-green-600" />
                            Paid Students
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">
                            {connections.filter((c) => c.paymentStatus === 'paid').length}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            Pending Payments
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">
                            {connections.filter((c) => c.paymentStatus === 'pending').length}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <h3 className="text-lg font-medium mb-4">Student Connections</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {connections.map((connection) => (
                        <ConnectionCard
                          key={connection._id}
                          connection={connection}
                          role={session.role}
                          handleProceedToPayment={handleProceedToPayment}
                          getStatusBadge={getStatusBadge}
                          formatDate={formatDate}
                          formatCurrency={formatCurrency}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            )}

            {/* Mentor: Negotiations Tab */}
            {session?.role === 'mentor' && (
              <TabsContent value="negotiations" className="mt-6">
                {isLoading ? (
                  <LoadingSkeletons />
                ) : negotiations.length === 0 ? (
                  <EmptyState
                    type="negotiations"
                    message="You don't have any fee negotiations at the moment."
                  />
                ) : (
                  <div className="space-y-6">
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

            {/* Mentor: Wallet Tab */}
            {session?.role === 'mentor' && (
              <TabsContent value="wallet" className="mt-6">
                {isWalletLoading ? (
                  <div className="space-y-4">
                    <div className="h-40 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                ) : (
                  <EnhancedWalletDisplay
                    walletData={walletData}
                    onWithdraw={handleWithdraw}
                    onViewInvoice={handleViewInvoice}
                  />
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {/* Invoice Modal */}
      <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoices</DialogTitle>
            <DialogDescription>View and download your payment invoices</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Student</th>
                      <th className="text-left py-3 px-4 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {connections
                      .filter((conn) => conn.paymentStatus === 'paid')
                      .map((connection) => (
                        <tr
                          key={connection._id}
                          className="border-t border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">{formatDate(connection.payment?.createdAt)}</td>
                          <td className="py-4 px-4">
                            {`${connection.studentId.firstname} ${connection.studentId.lastname}`}
                          </td>
                          <td className="py-4 px-4 font-medium">
                            {formatCurrency(connection.negotiatedFee, connection.feeCurrency)}
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Paid
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Button variant="outline" size="sm" className="gap-1">
                              <Download className="h-3 w-3" />
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
