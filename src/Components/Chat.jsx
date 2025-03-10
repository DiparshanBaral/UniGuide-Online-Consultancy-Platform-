// import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

const Chat = () => {
  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          Chat
        </CardTitle>
        <CardDescription>Communicate with your student through chat.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">This feature is coming soon.</p>
      </CardContent>
    </Card>
  );
};


export default Chat;