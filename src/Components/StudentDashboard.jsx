import { useState, useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { sessionAtom } from '@/atoms/session';
import { toast } from 'sonner';

function StudentDashboard() {
  const [session] = useAtom(sessionAtom);
  const [universities, setUniversities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch student data (Universities, Notifications)
  const fetchStudentData = useCallback(async () => {
    if (!session?._id || session?.role !== 'student') return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/students/${session._id}`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student data');
      }

      const data = await response.json();
      setUniversities(data.universities || []);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Error loading student data');
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Load student data when session is available
  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  // Handle Checklist Toggle
  const handleChecklistToggle = async (universityId, documentIndex) => {
    try {
      const response = await fetch(`http://localhost:5000/students/update-checklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ studentId: session._id, universityId, documentIndex }),
      });

      if (!response.ok) {
        throw new Error('Failed to update checklist');
      }

      toast.success('Checklist updated');
      fetchStudentData();
    } catch (error) {
      console.error('Error updating checklist:', error);
      toast.error('Failed to update checklist');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-[90px] container mx-auto px-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      {/* University Portals */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your University Applications</h2>
        {universities.length === 0 ? (
          <p>You are not working with any universities yet.</p>
        ) : (
          <ul className="space-y-6">
            {universities.map((uni) => (
              <li key={uni._id} className="p-6 bg-gray-100 rounded-lg shadow">
                <h3 className="text-lg font-semibold">{uni.name}</h3>
                <p className="text-gray-600">Location: {uni.location}</p>

                {/* Mentor Info */}
                {uni.mentor ? (
                  <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                    <h4 className="font-semibold">Assigned Mentor:</h4>
                    <p>{uni.mentor.firstname} {uni.mentor.lastname}</p>
                    <p>Email: {uni.mentor.email}</p>
                  </div>
                ) : (
                  <p className="mt-4 text-gray-500">No mentor assigned yet</p>
                )}

                {/* Checklist Section */}
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Required Documents:</h4>
                  <ul className="space-y-2">
                    {uni.checklist.map((item, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleChecklistToggle(uni._id, index)}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <span className={item.completed ? 'line-through text-gray-500' : ''}>
                          {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        {notifications.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification, index) => (
              <li key={index} className="p-3 bg-yellow-100 rounded-lg shadow">
                {notification.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
