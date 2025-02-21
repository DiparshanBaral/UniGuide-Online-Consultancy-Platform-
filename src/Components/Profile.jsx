import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import API from "../api";
// import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { AvatarUpload } from './ui/avatarupload';

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const session = JSON.parse(localStorage.getItem('session'));

      if (session && session._id && session.token) {
        try {
          const response = await API.get(`/student/${session._id}`, {
            headers: { Authorization: `Bearer ${session.token}` },
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
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!updatedUser.firstname || !updatedUser.lastname || !updatedUser.email) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const session = JSON.parse(localStorage.getItem('session'));
      const formData = new FormData();
      formData.append('firstname', updatedUser.firstname);
      formData.append('lastname', updatedUser.lastname);
      formData.append('email', updatedUser.email);
      formData.append('bio', updatedUser.bio || '');
      formData.append('major', updatedUser.major || '');
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      const response = await API.put(`/student/${user._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (response.status === 200) {
        setUser(response.data);
        setUpdatedUser(response.data);
        setProfilePic(null);
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
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">No user data found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-20"> {/* Added pt-20 for navbar spacing */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gray-100 p-6 text-center">
          {/* Profile Picture */}
          <div className="relative w-40 h-40 mx-auto mb-4">
            <AvatarUpload
              currentAvatar={user.profilePic}
              onImageSelect={(file) => setProfilePic(file)}
              onRemove={() => setProfilePic(null)}
              isEditing={isEditing}
            />
          </div>
          <h1 className="text-2xl font-bold mt-2">{`${user.firstname} ${user.lastname}`}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {!isEditing ? (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Bio</label>
                  <p className="text-gray-800">{user.bio || 'No bio available.'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Major</label>
                  <p className="text-gray-800">{user.major || 'Not specified.'}</p>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} className="mt-6 w-full">
                Edit Profile
              </Button>
            </>
          ) : (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={updatedUser.firstname}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={updatedUser.lastname}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={updatedUser.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Bio</label>
                <textarea
                  name="bio"
                  value={updatedUser.bio}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Major</label>
                <input
                  type="text"
                  name="major"
                  value={updatedUser.major}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleUpdateProfile}>Save</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;