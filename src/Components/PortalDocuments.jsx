import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const PortalDocuments = () => {
  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Documents
        </CardTitle>
        <CardDescription>View and manage documents shared by students.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">This feature is coming soon.</p>
      </CardContent>
    </Card>
  );
};

export default PortalDocuments;