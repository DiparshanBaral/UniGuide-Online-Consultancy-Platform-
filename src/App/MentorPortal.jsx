import { useState } from 'react';
import PortalNavigation from '@/components/PortalNavigation';
import Tasks from '@/components/Tasks';
import Chat from '@/components/Chat';
import PortalDocuments from '@/components/PortalDocuments';

const MentorPortal = () => {
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <div className="flex">
      {/* Left Navigation Bar */}
      <PortalNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Render content based on the active tab */}
        {activeTab === 'tasks' && <Tasks sessionRole="mentor" />}
        {activeTab === 'documents' && <PortalDocuments />}
        {activeTab === 'chat' && <Chat />}
      </div>
    </div>
  );
};

export default MentorPortal;