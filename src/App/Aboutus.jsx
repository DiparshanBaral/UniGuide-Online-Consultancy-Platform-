function Aboutus() {
  return (
    <div className="pt-[90px] px-6 sm:px-16 md:px-24 lg:px-32 py-10 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About UniGuide</h1>
          <p className="text-lg text-gray-600">
            Empowering students and mentors with a seamless online consultancy platform for academic
            excellence.
          </p>
        </header>

        {/* Mission Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="leading-relaxed text-gray-700">
            At UniGuide, our mission is to bridge the gap between students and mentors by providing
            an accessible and efficient platform for guidance, support, and growth. We aim to foster
            academic success through effective communication and personalized mentorship.
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
            We envision a world where every student has the opportunity to achieve their academic
            and professional dreams with the guidance of a trusted mentor. UniGuide strives to be
            the platform that makes this vision a reality.
          </p>
        </section>
        
        {/* Contact Us Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Queries
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="Type your queries or feedback here..."
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-800"
                    required
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-gray-800 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-700 transition duration-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Us</h3>
                <p className="text-gray-700">Reach us via email:</p>
                <p className="text-blue-600 font-medium mt-2">support@uniguide.com</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Us</h3>
                <p className="text-gray-700">Speak to us directly:</p>
                <p className="text-blue-600 font-medium mt-2">+977 9818601909</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Us</h3>
                <p className="text-gray-700">Our office address:</p>
                <p className="text-blue-600 font-medium mt-2">P86J+W8X, Kathmandu 44600</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {/* Question 1 */}
            <div className="border border-gray-200 rounded-lg shadow-sm">
              <button
                className="w-full text-left flex justify-between items-center px-4 py-3 text-gray-800 font-medium focus:outline-none"
                onClick={() => document.getElementById('faq1').classList.toggle('hidden')}
              >
                <span>How do I create an account?</span>
                <span className="text-gray-500">▼</span>
              </button>
              <div id="faq1" className="px-4 py-3 text-gray-700 hidden">
                To create an account, click on the &quot;Login&quot; button on the top-right navbar, then go to signup page from there and fill
                in your details, and submit.
              </div>
            </div>

            {/* Question 2 */}
            <div className="border border-gray-200 rounded-lg shadow-sm">
              <button
                className="w-full text-left flex justify-between items-center px-4 py-3 text-gray-800 font-medium focus:outline-none"
                onClick={() => document.getElementById('faq2').classList.toggle('hidden')}
              >
                <span>What services does UniGuide offer?</span>
                <span className="text-gray-500">▼</span>
              </button>
              <div id="faq2" className="px-4 py-3 text-gray-700 hidden">
                UniGuide provides mentorship, resources for exams like IELTS, and collaborative
                discussion rooms.
              </div>
            </div>

            {/* Question 3 */}
            <div className="border border-gray-200 rounded-lg shadow-sm">
              <button
                className="w-full text-left flex justify-between items-center px-4 py-3 text-gray-800 font-medium focus:outline-none"
                onClick={() => document.getElementById('faq3').classList.toggle('hidden')}
              >
                <span>How do I contact a mentor?</span>
                <span className="text-gray-500">▼</span>
              </button>
              <div id="faq3" className="px-4 py-3 text-gray-700 hidden">
                You can contact mentors through our platform by navigating to the
                &quot;Universities&quot; section and find mentors according to university of your choice.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Aboutus;
