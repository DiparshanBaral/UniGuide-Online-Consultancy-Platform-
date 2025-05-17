import { useState } from 'react';
import AdminWalletDisplay from '@/Components/AdminWalletDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Wallet, CreditCard } from 'lucide-react';

export default function AdminWallet() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Finances</h1>
        <p className="text-muted-foreground">Manage platform revenue and mentor payments</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex justify-center gap-4 mb-6 w-auto mx-auto">
          <TabsTrigger value="overview">
            <Wallet className="mr-2 h-4 w-4" />
            Platform Wallet
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <CreditCard className="mr-2 h-4 w-4" />
            Transaction Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="space-y-6">
            <AdminWalletDisplay />
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-0">
          <div className="space-y-6">
            <div className="bg-muted/50 border rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Transaction Reports</h3>
              <p className="text-muted-foreground">
                Detailed transaction reports and analytics will be available here.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}