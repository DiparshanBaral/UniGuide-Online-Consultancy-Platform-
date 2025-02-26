import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, MessageCircle } from 'lucide-react';

const PortalNavigation = ({ activeTab, setActiveTab }) => {
  const [session, setSession] = useState(null);

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      setSession(JSON.parse(savedSession)); // Set session from localStorage if it exists
    }
  }, []);

  // Determine the portal title based on the session role
  const portalTitle = session?.role === 'mentor' ? 'Mentor Portal' : 'Student Portal';

  return (
    <aside className="sticky top-[80px] left-0 w-64 bg-white shadow-lg rounded-lg p-4 h-[calc(100vh-80px)] overflow-y-auto">
      {/* Portal Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-primary flex items-center justify-center gap-2">
          {session?.role === 'mentor' ? (
            <CheckCircle className="h-6 w-6 text-gray-700" />
          ) : (
            <FileText className="h-6 w-6 text-blue-500" />
          )}
          {portalTitle}
        </h2>
      </div>

      {/* Navigation Buttons */}
      <nav className="space-y-4">
        <Button
          variant={activeTab === 'tasks' ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={() => setActiveTab('tasks')}
        >
          <CheckCircle className="mr-2 h-5 w-5" /> Tasks
        </Button>
        <Button
          variant={activeTab === 'documents' ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={() => setActiveTab('documents')}
        >
          <FileText className="mr-2 h-5 w-5" /> Documents
        </Button>
        <Button
          variant={activeTab === 'chat' ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={() => setActiveTab('chat')}
        >
          <MessageCircle className="mr-2 h-5 w-5" /> Chat
        </Button>
      </nav>
    </aside>
  );
};

// Props Validation
PortalNavigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default PortalNavigation;