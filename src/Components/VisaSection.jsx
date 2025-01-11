function VisaSection() {
    return (
      <div className="px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-white text-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Visa Section</h1>
            <p className="text-lg text-gray-600">
              Your one-stop destination for all visa-related resources, experiences, and discussions. Simplify your journey to studying abroad.
            </p>
          </header>
  
          {/* Visa Experiences Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Visa Experiences</h2>
            <div className="space-y-6">
              {/* Example posts */}
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900">John Doe&apos;s US Visa Interview</h3>
                <p className="text-gray-700 mt-2">
                  &quot;My visa interview experience was smooth. The officer asked about my university, funding, and future plans...&quot;
                </p>
                <button className="text-blue-600 hover:underline mt-2">Read More</button>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900">Jane Smith&apos;s UK Visa Journey</h3>
                <p className="text-gray-700 mt-2">
                  &quot;I prepared all my documents in advance. The key was confidence during the interview...&quot;
                </p>
                <button className="text-blue-600 hover:underline mt-2">Read More</button>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button className="bg-gray-800 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-700 transition duration-300">
                Share Your Experience
              </button>
            </div>
          </section>
  
          {/* Discussion Rooms Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Visa-Related Discussion Rooms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "US Visa Discussions",
                "UK Visa Discussions",
                "Canada Visa Discussions",
                "Australia Visa Discussions",
                "Visa Rejection Support",
                "General Visa Questions",
              ].map((room, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{room}</h3>
                  <button className="mt-4 bg-gray-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition duration-300">
                    Join Room
                  </button>
                </div>
              ))}
            </div>
          </section>
  
          {/* Country-Specific Visa Portals */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Visa Information by Country</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {["USA", "UK", "Canada", "Australia", "Germany", "France", "Japan", "New Zealand"].map((country, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{country}</h3>
                  <button className="mt-4 text-blue-600 hover:underline">
                    Explore
                  </button>
                </div>
              ))}
            </div>
          </section>
  
          {/* Additional Resources */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Additional Resources</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li>
                <a href="/faq" className="text-blue-600 hover:underline">
                  Visa FAQs
                </a>
              </li>
              <li>
                <a href="/checklist" className="text-blue-600 hover:underline">
                  Visa Document Checklist
                </a>
              </li>
              <li>
                <a href="/tips" className="text-blue-600 hover:underline">
                  Tips for a Successful Visa Interview
                </a>
              </li>
              <li>
                <a href="/updates" className="text-blue-600 hover:underline">
                  Latest Visa Updates
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    );
  }
  
  export default VisaSection;
  