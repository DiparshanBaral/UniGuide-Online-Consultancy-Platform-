import { useState, useEffect } from "react";
import { toast } from "sonner";
import API from "../api";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/ui/avatarupload";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [profilePic, setProfilePic] = useState(null); // State for profile picture
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const session = JSON.parse(localStorage.getItem("session"));

        if (session && session._id && session.token) {
          const response = await API.get(`/student/${session._id}`, {
            headers: { Authorization: `Bearer ${session.token}` },
          });

          if (response.status === 200) {
            const userData = response.data;
            setUser(userData);
            setUpdatedUser(userData);
          } else {
            console.error("Failed to fetch user data:", response.statusText);
            toast.error("Failed to fetch user data. Please log in again.");
          }
        } else {
          console.error("No valid session found in localStorage");
          toast.error("No valid session found. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("An error occurred while fetching user data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update submission
  const handleUpdateProfile = async () => {
    if (!updatedUser.firstname || !updatedUser.lastname || !updatedUser.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const session = JSON.parse(localStorage.getItem("session"));
      const formData = new FormData();

      // Append updated fields to FormData
      formData.append("firstname", updatedUser.firstname);
      formData.append("lastname", updatedUser.lastname);
      formData.append("email", updatedUser.email);
      formData.append("bio", updatedUser.bio || "");
      formData.append("major", updatedUser.major || "");

      // Append profile picture if available
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const response = await API.put(`/student/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (response.status === 200) {
        setUser(response.data);
        setUpdatedUser(response.data);
        setProfilePic(null); // Reset profile picture state
        setIsEditing(false); // Exit editing mode
        toast.success("Profile updated successfully!");
      } else {
        toast.error(`Failed to update profile: ${response.data.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile. " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  // No user data found
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-800">No user data found.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-4 mb-6">
          <AvatarUpload
            currentAvatar={user.profilePic}
            onImageSelect={(file) => setProfilePic(file)}
            onRemove={() => setProfilePic(null)}
            isEditing={isEditing}
          />
          <h2 className="text-2xl font-bold">{`${user.firstname} ${user.lastname}`}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Profile Content */}
        <div className="space-y-4">
          {!isEditing ? (
            <>
              <p>
                <strong>Bio:</strong> {user.bio || "No bio available."}
              </p>
              <p>
                <strong>Major:</strong> {user.major || "Not specified."}
              </p>
              <Button onClick={() => setIsEditing(true)} className="mt-6 w-full">
                Edit Profile
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="block">
                  <span className="text-sm font-medium">First Name</span>
                  <input
                    type="text"
                    name="firstname"
                    value={updatedUser.firstname}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Last Name</span>
                  <input
                    type="text"
                    name="lastname"
                    value={updatedUser.lastname}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={updatedUser.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Bio</span>
                  <textarea
                    name="bio"
                    value={updatedUser.bio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Major</span>
                  <input
                    type="text"
                    name="major"
                    value={updatedUser.major}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleUpdateProfile}>Save Changes</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;