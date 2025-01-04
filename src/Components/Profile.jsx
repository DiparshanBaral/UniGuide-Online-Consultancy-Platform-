function Profile() {
  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>
        <div className="flex flex-col items-center">
          <img
            src="./src/Img/default-profile.png" // Temporary placeholder for profile picture
            alt="Profile"
            className="h-24 w-24 rounded-full border border-gray-300 object-cover mb-4"
          />
          <p className="text-gray-700 font-medium text-lg">John Doe</p>
          <p className="text-gray-500 mb-4">johndoe@example.com</p>
        </div>
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;
