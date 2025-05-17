import { useState, useEffect } from 'react';
import { CallProvider } from '../contexts/CallContext';
import PortalNavigation from '@/Components/PortalNavigation';
import Tasks from '@/Components/Tasks';
import Chat from '@/Components/Chat';
import PortalDocuments from '@/Components/PortalDocuments';

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [session, setSession] = useState(null);

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      setSession(parsedSession);
    }
  }, []);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <CallProvider session={session}>
      <div className="flex">
        {/* Left Navigation Bar */}
        <PortalNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'tasks' && <Tasks sessionRole="student" />}
          {activeTab === 'documents' && <PortalDocuments />}
          {activeTab === 'chat' && <Chat />}
        </div>
      </div>
    </CallProvider>
  );
};

export default StudentPortal;