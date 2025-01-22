import { useState, useEffect } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const session = JSON.parse(localStorage.getItem("session"));
      console.log("Session Data:", session); // Debugging

      if (session && session._id) {
        try {
          const response = await fetch(`/users/${session._id}`);
          console.log("API Response:", response); // Debugging

          if (response.ok) {
            const userData = await response.json();
            console.log("Fetched User Data:", userData); // Debugging
            setUser(userData);
            setUpdatedUser(userData);
          } else {
            console.error("Failed to fetch user data:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.error("No valid session found in localStorage");
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
    try {
      const response = await fetch(`/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUser(updatedData);
        setIsEditing(false); // Exit edit mode
      } else {
        console.error("Failed to update profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>
        <div className="flex flex-col items-center">
          <img
            src="https://github.com/shadcn.png"
            alt="Profile"
            className="h-24 w-24 rounded-full border border-gray-300 object-cover mb-4"
          />
          {!isEditing ? (
            <>
              <p className="text-gray-700 font-medium text-lg">
                {user.firstname} {user.lastname}
              </p>
              <p className="text-gray-500 mb-4">{user.email}</p>
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                name="firstname"
                value={updatedUser.firstname}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded-md"
                placeholder="First Name"
              />
              <input
                type="text"
                name="lastname"
                value={updatedUser.lastname}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded-md"
                placeholder="Last Name"
              />
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded-md"
                placeholder="Email"
              />
              <div className="flex space-x-4">
                <button
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                  onClick={handleUpdateProfile}
                >
                  Save
                </button>
                <button
                  className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
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
  );
}

export default Profile;
