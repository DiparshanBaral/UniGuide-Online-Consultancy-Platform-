function Aboutus() {
  return (
    <div className="px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About UniGuide</h1>
          <p className="text-lg text-gray-600">
            Empowering students and mentors with a seamless online consultancy platform for academic excellence.
          </p>
        </header>

        {/* Mission Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="leading-relaxed text-gray-700">
            At UniGuide, our mission is to bridge the gap between students and mentors by providing an accessible and
            efficient platform for guidance, support, and growth. We aim to foster academic success through effective
            communication and personalized mentorship.
          </p>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="mr-3 text-green-500">✔</span>
              <p className="text-gray-700">
                A platform for students to connect with experienced mentors for tailored guidance.
              </p>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-green-500">✔</span>
              <p className="text-gray-700">
                Resources and tools to prepare for exams like IELTS and enhance academic skills.
              </p>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-green-500">✔</span>
              <p className="text-gray-700">
                Collaborative discussion rooms to promote shared learning experiences.
              </p>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-green-500">✔</span>
              <p className="text-gray-700">
                A user-friendly interface for seamless navigation and interaction.
              </p>
            </li>
          </ul>
        </section>

        {/* Vision Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
          <p className="leading-relaxed text-gray-700">
            We envision a world where every student has the opportunity to achieve their academic and professional
            dreams with the guidance of a trusted mentor. UniGuide strives to be the platform that makes this vision a
            reality.
          </p>
        </section>

        {/* Call to Action Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Us Today!</h2>
          <p className="text-lg text-gray-700 mb-6">
            Be a part of a growing community of learners and mentors dedicated to academic success. Let’s make learning
            a collaborative and rewarding journey.
          </p>
          <a
            href="/signup"
            className="inline-block bg-slate-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-slate-700 transition duration-300"
          >
            Get Started
          </a>
        </section>
      </div>
    </div>
  );
}

export default Aboutus;
