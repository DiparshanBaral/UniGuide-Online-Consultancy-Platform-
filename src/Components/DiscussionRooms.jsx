function DiscussionRooms() {
    return (
      <div className="px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-white text-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Discussion Rooms</h1>
            <p className="text-lg text-gray-600">
              Join our vibrant discussion rooms and connect with peers, mentors, and experts. Share ideas, collaborate, and grow together.
            </p>
          </header>
  
          {/* Rooms Section */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "IELTS Preparation", participants: 12 },
              { title: "University Applications", participants: 8 },
              { title: "Scholarship Discussions", participants: 10 },
              { title: "Career Guidance", participants: 6 },
              { title: "Subject-Specific Rooms", participants: 15 },
              { title: "General Discussion", participants: 20 },
            ].map((room, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col justify-between transition-transform transform hover:scale-105"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{room.title}</h3>
                <p className="text-gray-600 mb-6">
                  {room.participants} participants
                </p>
                <button className="bg-gray-800 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-700 transition duration-300">
                  Join Room
                </button>
              </div>
            ))}
          </section>
  
          {/* Bottom Section */}
          <section className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Join Discussion Rooms?</h2>
            <p className="text-gray-700 leading-loose max-w-3xl mx-auto">
              Discussion rooms are a great way to connect with like-minded individuals, exchange knowledge, and receive
              support in your educational journey. Dive in, share your ideas, and grow together with the UniGuide
              community.
            </p>
          </section>
        </div>
      </div>
    );
  }
  
  export default DiscussionRooms;
  