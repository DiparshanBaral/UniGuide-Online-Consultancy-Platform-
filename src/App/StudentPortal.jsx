import { useState } from 'react';
import PortalNavigation from '@/Components/PortalNavigation';
import Tasks from '@/Components/Tasks';
import Chat from '@/Components/Chat';
import PortalDocuments from '@/Components/PortalDocuments';

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState('tasks'); // Tracks the active tab

  return (
    <div className="flex">
      {/* Left Navigation Bar */}
      <PortalNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-5">
        {/* Render content based on the active tab */}
        {activeTab === 'tasks' && <Tasks sessionRole="student" />}
        {activeTab === 'documents' && <PortalDocuments />}
        {activeTab === 'chat' && <Chat />}
      </div>
    </div>
  );
};

export default StudentPortal;