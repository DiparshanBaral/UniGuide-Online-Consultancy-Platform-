import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import API from "../api";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [profilePic, setProfilePic] = useState(null); // State for profile picture
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const session = JSON.parse(localStorage.getItem('session'));
  
      if (session && session._id && session.token) {
        try {
          const response = await API.get(`/student/${session._id}`, {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          });
  
          if (response.status === 200) {
            const userData = response.data;
            setUser(userData);
            setUpdatedUser(userData);
          } else {
            console.error('Failed to fetch user data:', response.statusText);
            toast.error('Failed to fetch user data. Please log in again.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('An error occurred while fetching user data.');
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error('No valid session found in localStorage');
        toast.error('No valid session found. Please log in again.');
        setIsLoading(false);
      }
    };
  
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]); // Set the selected file
  };

  const handleUpdateProfile = async () => {
    if (!updatedUser.firstname || !updatedUser.lastname || !updatedUser.email) {
      toast.error('Please fill in all fields.');
      return;
    }
  
    try {
      const session = JSON.parse(localStorage.getItem('session'));
      const formData = new FormData();
      formData.append('firstname', updatedUser.firstname);
      formData.append('lastname', updatedUser.lastname);
      formData.append('email', updatedUser.email);
      if (profilePic) {
        formData.append('profilePic', profilePic); // Append the profile picture
      }

      const response = await API.put(`/student/${user._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type for FormData
          Authorization: `Bearer ${session.token}`,
        },
      });
  
      if (response.status === 200) {
        setUser(response.data);
        setUpdatedUser(response.data);
        setProfilePic(null); // Reset profilePic state
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(`Failed to update profile: ${response.data.message || response.statusText}`);
      }
    } catch (error) {
      toast.error('An error occurred while updating the profile. ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-[90px] min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-[90px] min-h-screen bg-gray-100 flex justify-center items-center">
        <p className="text-gray-800">No user data found.</p>
      </div>
    );
  }

  return (
    <div className="pt-[90px] min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-slate-800 p-6">
            <h1 className="text-2xl font-bold text-white">Your Profile</h1>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
                />
              </div>
              <div className="flex-grow">
                {!isEditing ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-lg font-semibold text-gray-800">
                          {user.firstname} {user.lastname}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Role</label>
                        <p className="text-lg font-semibold text-gray-800">{user.role}</p>
                      </div>
                    </div>
                    <button
                      className="mt-6 w-full md:w-auto bg-slate-800 text-white py-2 px-6 rounded-md hover:bg-slate-600 transition-colors duration-200"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">First Name</label>
                        <input
                          type="text"
                          name="firstname"
                          value={updatedUser.firstname}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                          placeholder="First Name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Last Name</label>
                        <input
                          type="text"
                          name="lastname"
                          value={updatedUser.lastname}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                          placeholder="Last Name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={updatedUser.email}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                          placeholder="Email"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Profile Picture</label>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-4">
                      <button
                        className="w-full bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors duration-200"
                        onClick={handleUpdateProfile}
                      >
                        Save
                      </button>
                      <button
                        className="w-full bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 transition-colors duration-200"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
