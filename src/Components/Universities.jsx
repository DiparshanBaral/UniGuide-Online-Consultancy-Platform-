function Universities() {
  return (
    <div className="pt-[90px] px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Ideal University</h1>
          <p className="text-lg text-gray-600">
            Search for top universities and explore the best options for your academic journey.
          </p>
        </header>

        {/* University Search Bar */}
        <section className="mb-12">
          <div className="flex justify-center items-center">
            <input
              type="text"
              placeholder="Search Universities..."
              className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:ring-2 focus:ring-gray-800"
            />
            <button
              type="button"
              className="bg-gray-800 text-white px-4 py-2 border border-gray-800 rounded-r-lg hover:bg-gray-700 transition duration-300"
            >
              Search
            </button>
          </div>
        </section>

        {/* Survey Section */}
        <section className="bg-gray-100 p-8 rounded-lg shadow-md mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Take a Survey to Find Your Best Match</h2>
            <p className="text-gray-700">
              Answer a few questions about your preferences and portfolio, and we will suggest universities that best suit you.
            </p>
          </div>
          <div className="text-center">
            <button className="bg-gray-800 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-700 transition duration-300">
              Take a Survey
            </button>
          </div>
        </section>

        {/* Top Universities Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Top Universities</h2>
          <div className="flex overflow-x-auto space-x-6">
            {/* University 1 */}
            <div className="flex-shrink-0 w-60 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <img
                src="https://via.placeholder.com/250x150"
                alt="University 1"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">University of Example 1</h3>
              <p className="text-gray-600 mb-4">
                A world-class institution offering diverse programs.
              </p>
              <a
                href="/universities/example1"
                className="text-blue-600 font-medium hover:underline"
              >
                View University
              </a>
            </div>

            {/* Additional Universities */}
            {[...Array(6)].map((_, index) => (
              <div
                key={index + 2}
                className="flex-shrink-0 w-60 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <img
                  src="https://via.placeholder.com/250x150"
                  alt={`University ${index + 2}`}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  University of Example {index + 2}
                </h3>
                <p className="text-gray-600 mb-4">Description for university {index + 2}.</p>
                <a
                  href={`/universities/example${index + 2}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  View University
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Scroll or Button to See More */}
        <div className="text-center">
          <button className="bg-gray-800 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-700 transition duration-300">
            See More Universities
          </button>
        </div>
      </div>
    </div>
  );
}

export default Universities;
