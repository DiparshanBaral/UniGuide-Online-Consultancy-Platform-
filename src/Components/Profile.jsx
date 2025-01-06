import { useState, useEffect } from 'react';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const session = JSON.parse(localStorage.getItem('session'));
      if (session) {
        try {
          const response = await fetch(`/users/${session._id}`); // Replace with your user fetch route
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>
        <div className="flex flex-col items-center">
          <img
            src="https://github.com/shadcn.png" // Temporary placeholder for profile picture
            alt="Profile"
            className="h-24 w-24 rounded-full border border-gray-300 object-cover mb-4"
          />
          <p className="text-gray-700 font-medium text-lg">
            {user.firstname} {user.lastname}
          </p>
          <p className="text-gray-500 mb-4">{user.email}</p>
        </div>
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;
