import AdminWalletDisplay from '@/Components/AdminWalletDisplay';

export default function AdminWallet() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Finances</h1>
        <p className="text-muted-foreground">Manage platform revenue and mentor payments</p>
      </div>
      
      <div className="space-y-6">
        <AdminWalletDisplay />
      </div>
    </div>
  );
}