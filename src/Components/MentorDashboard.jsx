import { useState, useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { sessionAtom } from '@/atoms/session';
import { toast } from 'sonner';

function MentorDashboard() {
  const [session] = useAtom(sessionAtom);
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Mentor Data (Requests, Students, Notifications)
  const fetchMentorData = useCallback(async () => {
    if (!session?._id || session?.role !== 'mentor') return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/mentors/${session._id}`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch mentor data');
      }

      const data = await response.json();
      setRequests(data.requests || []);
      setStudents(data.students || []);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching mentor data:', error);
      toast.error('Error loading mentor data');
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Load mentor data when session is available
  useEffect(() => {
    fetchMentorData();
  }, [fetchMentorData]);

  // Handle Accept Request
  const handleAccept = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/mentors/accept-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ mentorId: session._id, studentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept request');
      }

      toast.success('Student request accepted');
      fetchMentorData(); // Refresh data
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request');
    }
  };

  // Handle Reject Request
  const handleReject = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/mentors/reject-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ mentorId: session._id, studentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject request');
      }

      toast.success('Student request rejected');
      fetchMentorData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-[90px] container mx-auto px-6">
      <h1 className="text-2xl font-bold mb-6">Mentor Dashboard</h1>

      {/* Mentorship Requests Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Mentorship Requests</h2>
        {requests.length === 0 ? (
          <p>No new requests</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((student) => (
              <li key={student._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow">
                <p>{student.firstname} {student.lastname} - {student.email}</p>
                <div className="space-x-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                    onClick={() => handleAccept(student._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={() => handleReject(student._id)}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Students Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Students</h2>
        {students.length === 0 ? (
          <p>You are not mentoring any students yet.</p>
        ) : (
          <ul className="space-y-4">
            {students.map((student) => (
              <li key={student._id} className="p-4 bg-blue-100 rounded-lg shadow flex justify-between">
                <p>{student.firstname} {student.lastname}</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => console.log('Open student portal:', student._id)}
                >
                  Open Portal
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Notifications Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        {notifications.length === 0 ? (
          <p>No notifications</p>
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

export default MentorDashboard;
