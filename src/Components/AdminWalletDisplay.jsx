import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { sessionAtom } from '@/atoms/session';
import API from '../api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Wallet, Download } from 'lucide-react';
import { toast } from 'sonner';

const AdminWalletDisplay = () => {
  const [session] = useAtom(sessionAtom);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!session || !session._id || session.role !== 'admin') return;
      
      try {
        setLoading(true);
        const response = await API.get(`/wallet/${session._id}`, {
          headers: { Authorization: `Bearer ${session.token}` },
        });
        
        setWalletData(response.data);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        toast.error('Failed to load wallet information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWalletData();
  }, [session]);
  
  // Format currency amount with proper currency symbol
  const formatAmount = (amount, currency = 'usd') => {
    const currencyMap = {
      'usd': '$',
      'gbp': '£',
      'eur': '€',
      'cad': 'C$',
      'aud': 'A$',
      'npr': 'रू',
      'inr': '₹'
    };
    
    const symbol = currencyMap[currency.toLowerCase()] || '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  if (session?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Platform Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Platform Wallet
        </CardTitle>
        <CardDescription>Platform revenue from the 20% fee on all transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-primary/10 p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">{formatAmount(walletData?.balance || 0, walletData?.currency)}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Transaction History</h3>
            {walletData?.transactions && walletData.transactions.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {walletData.transactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Download className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Platform Fee</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-green-600">
                      +{formatAmount(transaction.amount, walletData.currency)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No transactions yet
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminWalletDisplay;