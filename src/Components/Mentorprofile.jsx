import { useState, useEffect } from "react";
import { toast } from "sonner"; // For showing success/error messages

function Mentorprofile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const session = JSON.parse(localStorage.getItem("session"));
      console.log("Session Data:", session); // Debugging

      if (session && session._id && session.token) {
        try {
          const response = await fetch(`http://localhost:5000/users/${session._id}`, {
            headers: {
              Authorization: `Bearer ${session.token}`, // Include the token
            },
          });
          console.log("API Response:", response); // Debugging

          if (response.ok) {
            const userData = await response.json();
            console.log("Fetched User Data:", userData); // Debugging
            setUser(userData);
            setUpdatedUser(userData);
          } else {
            console.error("Failed to fetch user data:", response.statusText);
            toast.error("Failed to fetch user data. Please log in again.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("An error occurred while fetching user data.");
        } finally {
          setIsLoading(false); // Stop loading
        }
      } else {
        console.error("No valid session found in localStorage");
        toast.error("No valid session found. Please log in again.");
        setIsLoading(false); // Stop loading
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

  const handleUpdateProfile = async () => {
    // Validate required fields
    if (!updatedUser.firstname || !updatedUser.lastname || !updatedUser.email) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const session = JSON.parse(localStorage.getItem("session"));
      const response = await fetch(`http://localhost:5000/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`, // Include the token
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUser(updatedData); // Update local state with the new data
        setIsEditing(false); // Exit edit mode
        toast.success("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(`Failed to update profile: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.");
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
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Container with consistent spacing */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-slate-800 p-6">
            <h1 className="text-2xl font-bold text-white">Mentor Profile</h1>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <img
                  src="https://github.com/shadcn.png"
                  alt="Profile"
                  className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <button
                    className="mt-2 w-full bg-slate-800 text-white py-1 px-4 rounded-md hover:bg-slate-600 transition-colors duration-200 text-sm"
                    onClick={() => alert("Feature coming soon!")}
                  >
                    Change Photo
                  </button>
                )}
              </div>

              {/* Profile Details */}
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
                      <div>
                        <label className="text-sm font-medium text-gray-500">Affiliated University</label>
                        <p className="text-lg font-semibold text-gray-800">{user.affiliatedUniversity || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Experience</label>
                        <p className="text-lg font-semibold text-gray-800">{user.experience || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Success Stories</label>
                        <p className="text-lg font-semibold text-gray-800">{user.successStories || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ratings</label>
                        <p className="text-lg font-semibold text-gray-800">{user.ratings || "Not rated yet"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Reviews</label>
                        <p className="text-lg font-semibold text-gray-800">{user.reviews || "No reviews yet"}</p>
                      </div>
                    </div>

                    {/* Edit Button */}
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
                        <label className="text-sm font-medium text-gray-500">Affiliated University</label>
                        <input
                          type="text"
                          name="affiliatedUniversity"
                          value={updatedUser.affiliatedUniversity || ""}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                          placeholder="Affiliated University"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Experience</label>
                        <input
                          type="text"
                          name="experience"
                          value={updatedUser.experience || ""}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                          placeholder="Experience"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Success Stories</label>
                        <input
                          type="text"
                          name="successStories"
                          value={updatedUser.successStories || ""}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                          placeholder="Success Stories"
                        />
                      </div>
                    </div>

                    {/* Save and Cancel Buttons */}
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

export default Mentorprofile;