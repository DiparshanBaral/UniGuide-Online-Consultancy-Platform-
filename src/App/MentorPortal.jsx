import { useState } from 'react';
import PortalNavigation from '@/Components/PortalNavigation';
import Tasks from '@/Components/Tasks';
import Chat from '@/Components/Chat';
import PortalDocuments from '@/Components/PortalDocuments';

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